<template>
  <div ref="dropRef">
    <div ref="fileUploadRef" class="d-none"></div>
    <div ref="folderUploadRef" class="d-none"></div>
    <div id="file-list" data-simplebar style="max-height: 30vh">
      <div class="d-flex align-items-center mb-2" v-for="file in files" :key="file.identifier">
        <div class="flex-shrink-0 me-2 mt-1">
          <img
            v-if="file.uuid && file.category === 'image'"
            :src="`${BASE_URL}cor/file/load/${file.uuid}`"
            class="rounded avatar-xs cursor-pointer"
            @click="
              () => {
                const images = files.filter((file) => file.category === 'image');
                $viewerApi({
                  options: {
                    focus: false,
                    movable: false,
                    initialViewIndex: images.findIndex((image) => image.uuid == file.uuid),
                  },
                  images: images.map((image) => {
                    return `${BASE_URL}cor/file/load/${image.uuid}`;
                  }),
                });
              }
            "
            loading="lazy"
          />
          <i v-else class="file-icon" :class="FileIcons.getClassWithColor(file.name)" />
        </div>
        <div class="flex-grow-1 w-75">
          <div class="d-flex">
            <template v-if="file.uuid">
              <div
                class="flex-grow-1 mt-1 cursor-pointer text-truncate"
                @dblclick="handlePreviewFile(file)"
              >
                <b>{{ file.name }}</b>
              </div>
              <div class="flex-shrink-0 mb-1">
                <i
                  v-if="!readonly && !disabled"
                  class="mdi mdi-close cursor-pointer text-danger me-2"
                  @click="handleRemoveFile(file)"
                />
              </div>
            </template>
            <template v-else>
              <div class="flex-grow-1 mt-1 text-truncate">
                <b>{{ file.name }}</b>
                <small class="text-muted text-capitalize ms-2">
                  {{
                    file.status.name == 'computing'
                      ? `${$t(file.status.text)} [${file.status.progress}%]`
                      : file.status.name == 'uploading'
                      ? `${$t(file.status.text)} [${file.status.speed}/S]`
                      : `${$t(file.status.text)}`
                  }}
                </small>
              </div>
              <div class="flex-shrink-0 mb-1">
                <i
                  v-if="['waiting', 'uploading', 'paused'].includes(file.status.name)"
                  :class="`mdi mdi-${
                    file.status.name == 'paused' ? 'play' : 'pause'
                  } cursor-pointer text-primary me-2`"
                  @click="
                    () => {
                      if (file.status.name == 'paused') {
                        handleResumeFileUpload(file);
                      } else {
                        handlePauseFileUpload(file);
                      }
                    }
                  "
                />
                <i
                  class="mdi mdi-close cursor-pointer text-danger me-2"
                  @click.stop="handleRemoveFile(file)"
                />
              </div>
            </template>
          </div>
          <small v-if="file.uuid" class="text-muted">
            {{ size2Str(file.size) }}
            <i
              class="mdi mdi-download cursor-pointer text-primary"
              @click="handleDownloadFile(file)"
            />
          </small>
          <div v-else class="mt-1 mb-1">
            <div class="progress">
              <div
                class="progress-bar bg-success"
                :class="{
                  'bg-info': ['computing'].includes(file.status.name),
                  'bg-primary': ['waiting', 'uploading', 'paused'].includes(file.status.name),
                  'bg-warning': ['merging'].includes(file.status.name),
                }"
                :style="{ width: `${file.status.progress || 0}%` }"
              >
                <div class="label">{{ file.status.progress || 0 }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-1 d-flex">
      <div class="btn-group float-start" v-if="!readonly && (multiple || files.length === 0)">
        <button
          id="uploadFile"
          type="button"
          :disabled="disabled"
          class="btn btn-sm"
          :class="fieldClass"
          @click="fileUploadRef.click()"
        >
          {{ placeholder }}
        </button>
        <button
          type="button"
          :disabled="disabled"
          :id="`${id}_uploadDropdownMenu`"
          class="btn btn-sm dropdown-toggle dropdown-toggle-split"
          :class="fieldClass"
          data-bs-toggle="dropdown"
          :data-bs-auto-close="qrable ? 'inside' : 'true'"
          aria-expanded="false"
        ></button>
        <ul class="dropdown-menu">
          <li>
            <a
              class="dropdown-item cursor-pointer"
              :class="{ disabled }"
              @click="fileUploadRef.click()"
            >
              <i class="mdi mdi-file-upload" />
              <span class="ms-1">
                {{
                  $t('components.uploader.selectFile', {
                    count: multiple ? 2 : 1,
                  })
                }}
              </span>
            </a>
          </li>
          <li v-if="accept == '*' && multiple">
            <span
              class="dropdown-item cursor-pointer"
              :class="{ disabled }"
              @click="folderUploadRef.click()"
            >
              <i class="mdi mdi-folder-upload" />
              <span class="ms-1">{{ $t('components.uploader.selectFolder') }}</span>
            </span>
          </li>
          <div v-if="qrable && !isMobile()">
            <div class="dropdown-divider"></div>
            <div class="mb-0 text-center text-muted">
              <b>{{ qrcode }}</b>
            </div>
            <div class="p-2 pb-0" id="qrcode" :key="qrcode"></div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, reactive, shallowReactive, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import Uploader from 'simple-uploader.js';
import SparkMD5 from 'spark-md5';
import QRCode from 'qrcodejs2';
import { nanoid } from 'nanoid';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getFileExt, isMobile, encryptData, size2Str, copyToClipboard } from '@utils';
import i18n from '@utils/i18n';
import { socket } from '@utils/socket';
import store from '@store';
import { mergeFile, addUpload } from '@api/file';

// eslint-disable-next-line
const props = defineProps({
  id: {
    type: String,
    default: () => 'Uploader',
    requried: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
    requried: true,
  },
  readonly: {
    type: Boolean,
    default: () => false,
    requried: true,
  },
  prefix: {
    type: String,
    default: () => '',
    requried: true,
  },
  accept: {
    type: String,
    default: () => '*',
    requried: true,
  },
  multiple: {
    type: Boolean,
    default: () => true,
    requried: true,
  },
  placeholder: {
    type: String,
    default: () => 'Upload',
    requried: true,
  },
  disabled: {
    type: Boolean,
    default: () => false,
    requried: true,
  },
  qrable: {
    type: Boolean,
    default: () => true,
    requried: true,
  },
  fieldClass: {
    type: [String, Object],
    default: () => 'btn-primary',
    requried: true,
  },
});

// eslint-disable-next-line
const emits = defineEmits([
  'update:modelValue',
  'upload-start',
  'upload-end',
  'file-added', // @chat
  'file-uploaded', // @chat
]);

const { FileIcons } = window;
const { BASE_URL } = process.env;

const chunkSize = 1024 * 1024 * 1;
const categories = {
  image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp', 'ico'],
  video: ['mp4', 'mov', 'rmvb', 'webm', 'avi', 'swf', '3gp', 'mkv', 'flv'],
  audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
  office: ['doc', 'docx', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'],
  document: ['txt', 'log', 'json', 'cnf', 'conf', 'ini', 'js', 'html', 'css', 'pdf', 'md', 'xml'],
};

const options = {
  target: `${BASE_URL}cor/file/upload`,
  chunkSize,
  allowDuplicateUploads: true,
  testChunks: true,
  checkChunkUploadedByResponse: (chunk, res) => {
    res = JSON.parse(res);
    if (res.code == 200) {
      return true;
    } else {
      let chunkNumber = chunk.offset + 1;
      if (chunkNumber == chunk.file.chunks.length && (res.chunks || []).includes(chunkNumber)) {
        handleMergeFile(chunk.file);
      }
      return (res.chunks || []).includes(chunkNumber);
    }
  },
  successStatuses: [200, 201, 202],
  initialPaused: true,
};
let uploader = new Uploader(options);

const files = reactive([...(props.modelValue || [])]);

let updateFlag = false;
const updateValue = () => {
  updateFlag = true;
  const value = files.filter((file) => file.md5);
  emits('update:modelValue', value.length ? value : null);
};

watch(
  () => props.modelValue,
  (value) => {
    if (!updateFlag) files.splice(0, files.length, ...(value || []));
    updateFlag = false;
  },
);

const dropRef = ref(null);
const fileUploadRef = ref(null);
const folderUploadRef = ref(null);

onMounted(() => {
  if (!props.readonly) {
    socket.on('fileChanged', fileChangedHandler);
    uploader.assignDrop(dropRef.value);
    uploader.assignBrowse(fileUploadRef.value, false, !props.multiple, { accept: props.accept });
    uploader.assignBrowse(folderUploadRef.value, true, !props.multiple, { accept: props.accept });

    uploader.on('fileAdded', onFileAdded);
    uploader.on('fileProgress', onFileProgress);
    uploader.on('fileSuccess', onFileSuccess);

    const uploadDropdownMenu = document.getElementById(`${props.id}_uploadDropdownMenu`);
    if (uploadDropdownMenu) {
      uploadDropdownMenu.addEventListener('show.bs.dropdown', uploadDropdownMenuShowHandler);
      uploadDropdownMenu.addEventListener('hide.bs.dropdown', uploadDropdownMenuHideHandler);
    }
  }
});

onUnmounted(() => {
  if (!props.readonly) {
    socket.off('fileChanged', fileChangedHandler);

    uploader.off('fileAdded', onFileAdded);
    uploader.off('fileProgress', onFileProgress);
    uploader.off('fileSuccess', onFileSuccess);

    uploader = null;

    const uploadDropdownMenu = document.getElementById(`${props.id}_uploadDropdownMenu`);
    if (uploadDropdownMenu) {
      uploadDropdownMenu.removeEventListener('show.bs.dropdown', uploadDropdownMenuShowHandler);
      uploadDropdownMenu.removeEventListener('hide.bs.dropdown', uploadDropdownMenuHideHandler);
    }
  }
});

const scrollToBottom = () => {
  nextTick(() => {
    const fileList = document
      .getElementById('file-list')
      ?.querySelector('.simplebar-content-wrapper');
    if (fileList)
      fileList.scrollTo({
        top: fileList.scrollHeight,
        behavior: 'smooth',
      });
  });
};

const onFileAdded = (file) => {
  emits('upload-start');
  file.key = nanoid();
  file.status = {
    name: 'computing',
    text: 'components.uploader.status.computing',
    progress: 0,
  };
  file.extension = getFileExt(file.name);
  file.category = 'unknown';
  for (let category in categories) {
    if (categories[category].includes(file.extension)) {
      file.category = category;
      break;
    }
  }
  file = shallowReactive(file);
  files.push(file);
  emits('file-added', file);
  scrollToBottom();
  computeFile(file);
};

const computeFile = (file) => {
  let fileReader = new FileReader();
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  let currentChunk = 0;
  let chunks = Math.ceil(file.size / chunkSize);
  let spark = new SparkMD5.ArrayBuffer();

  const loadNext = () => {
    const start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
  };

  fileReader.onload = (e) => {
    spark.append(e.target.result);
    currentChunk++;
    if (currentChunk < chunks) {
      if (file.status?.name === 'computing') {
        const progress = ((currentChunk / chunks) * 100).toFixed(0);
        if (file.status.progress != progress) {
          file.status = { ...file.status, progress };
        }
        loadNext();
      }
    } else {
      const md5 = spark.end();
      file.uniqueIdentifier = md5;
      spark.destroy();
      if (
        files.find((item) => item.uuid && item.md5 === md5) ||
        files.find((item) => item != file && item.uniqueIdentifier === md5)
      ) {
        handleRemoveFile(
          file,
          i18n.global.t('components.uploader.cancel.duplicate', { name: file.name }),
        );
      } else if (file.size === 0) {
        handleRemoveFile(
          file,
          i18n.global.t('components.uploader.cancel.empty', { name: file.name }),
        );
      } else {
        file.status = {
          name: 'waiting',
          text: 'components.uploader.status.waiting',
          progress: 0,
        };
      }
      checkUploadTasks();
    }
  };
  loadNext();
};

const onFileProgress = (_, file) => {
  file = files.find((item) => item.uniqueIdentifier === file.uniqueIdentifier);
  if (file.status.name === 'uploading') {
    file.status = {
      name: 'uploading',
      text: 'components.uploader.status.uploading',
      speed: size2Str(file.currentSpeed),
      progress: Math.floor(file.progress() * 100),
    };
  }
};

const onFileSuccess = (_, file, message) => {
  message = JSON.parse(message);
  if (message.code == 200) {
    handleAddUpload(file, message.data);
  } else if (message.code == 201) {
    handleMergeFile(file);
  }
};

const toast = useToast();

const handleRemoveFile = (file, msg) => {
  if (file.uuid) {
    const index = files.findIndex((item) => item.md5 === file.md5);
    if (index != -1) {
      files.splice(index, 1);
      updateValue();
    }
  } else {
    file.cancel();
    checkUploadTasks();
    const index = files.findIndex((item) => item === file);
    if (index != -1) {
      files.splice(index, 1);
      delete file.status;
    }
  }

  if (msg) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: msg,
      },
    });
  }
};

const checkUploadTasks = () => {
  Promise.resolve().then(() => {
    let uploadingFile = files.find((file) => file.status?.name === 'uploading');
    if (uploadingFile) return;

    let waitingFile = files.find((file) => file.status?.name === 'waiting');
    if (waitingFile) {
      resumeFileUpload(waitingFile);
      return;
    }

    let computingFile = files.find((file) => file.status?.name === 'computing');
    let pausedFile = files.find((file) => file.status?.name === 'paused');
    let mergingFile = files.find((file) => file.status?.name === 'merging');
    if (!(computingFile || pausedFile || mergingFile)) emits('upload-end');
  });
};

const handlePauseFileUpload = (file) => {
  file.pause();
  checkUploadTasks();
  file.status = {
    name: 'paused',
    text: 'components.uploader.status.paused',
    progress: file.status.progress,
  };
};

const handleResumeFileUpload = (file) => {
  let uploadingFile = files.find((file) => file?.status?.name === 'uploading');
  if (uploadingFile) {
    file.status = {
      name: 'waiting',
      text: 'components.uploader.status.waiting',
      progress: file.status.progress,
    };
  } else {
    resumeFileUpload(file);
  }
};

const resumeFileUpload = (file) => {
  file.status = {
    name: 'uploading',
    text: 'components.uploader.status.uploading',
    speed: size2Str(file.currentSpeed),
    progress: Math.floor(file.progress() * 100),
  };
  file.resume();
};

const handleMergeFile = (file) => {
  file.status = {
    name: 'merging',
    text: 'components.uploader.status.merging',
    progress: 100,
  };
  checkUploadTasks();
  mergeFile({
    name: file.name,
    extension: file.extension,
    category: file.category,
    md5: file.uniqueIdentifier,
    relativePath: file.relativePath,
    size: file.size,
  }).then(({ code, msg, data }) => {
    if (code === 200) {
      handleAddUpload(file, data);
    } else {
      handleRemoveFile(file, msg);
    }
  });
};

const handleAddUpload = (file, data) => {
  data.name = `${props.prefix}${file.name}`;
  addUpload(data).then(({ code, msg, data }) => {
    if (code === 200) {
      const index = files.findIndex((file) => file.uniqueIdentifier === data.md5);
      if (index != -1) {
        files[index] = data;
        updateValue();
        emits('file-uploaded', { ...file, data });
      }
      checkUploadTasks();
    } else {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: msg,
        },
      });
    }
  });
};

const router = useRouter();
const handlePreviewFile = (file) => {
  const route = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
  window.open(route.href, '_blank');
};

const handleDownloadFile = (file) => {
  let downloadElement = document.createElement('a');
  downloadElement.href = `${BASE_URL}cor/file/load/${file.uuid}?raw=1`;
  downloadElement.download = file.name;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
};

const fileChangedHandler = ({ type, code, file }) => {
  if (code === qrcode.value) {
    if (type === 'add') {
      const index = files.findIndex(
        (item) => item.md5 === file.md5 || item.uniqueIdentifier === file.md5,
      );
      if (index === -1) {
        files.push(file);
        updateValue();
        scrollToBottom();
      }
    } else if (type === 'del') handleRemoveFile(file);
  }
};

const qrcode = ref(null);
const uploadDropdownMenuShowHandler = () => {
  qrcode.value = null;
  if (props.qrable) hendleClickMobileUpload();
};
const uploadDropdownMenuHideHandler = () => {
  qrcode.value = null;
};

const hendleClickMobileUpload = () => {
  const options = {};
  options.prefix = props.prefix;
  options.accept = props.accept;
  options.placeholder = props.placeholder;
  options.multiple = props.multiple;
  options.username =
    sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubun`) ||
    store.state.user.data.username;
  qrcode.value = options.code = nanoid();
  let url = `${location.origin}${BASE_URL}uploader/${encodeURIComponent(
    encryptData(JSON.stringify(options)),
  )}`;
  copyToClipboard(url);
  nextTick(() => {
    new QRCode(document.getElementById('qrcode'), {
      text: url,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: 3,
    });
  });
};
</script>
