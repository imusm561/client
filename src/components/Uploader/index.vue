<template>
  <uploader
    ref="uploaderRef"
    :options="options"
    :autoStart="false"
    @file-added="onFileAdded"
    @file-success="onFileSuccess"
  >
    <uploader-btn ref="fileUploadRef" class="d-none" :attrs="{ accept }"></uploader-btn>
    <uploader-btn ref="folderUploadRef" class="d-none" :directory="true"></uploader-btn>

    <div id="file-list" data-simplebar style="max-height: 30vh">
      <div class="d-flex align-items-center mb-2" v-for="file in files" :key="file.identifier">
        <div class="flex-shrink-0 me-2 mt-1">
          <img
            v-if="file.category === 'image'"
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
          <i v-else class="file-icon" :class="$fileIcons.getClassWithColor(file.name)" />
        </div>
        <div class="flex-grow-1 w-75">
          <div class="d-flex">
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
                @click="handleRemoveUpload(file)"
              />
            </div>
          </div>
          <small class="text-muted">
            {{ size2Str(file.size) }}
            <i
              class="mdi mdi-download cursor-pointer text-primary"
              @click="handleDownloadFile(file)"
            />
          </small>
        </div>
      </div>
      <uploader-files id="upload-list">
        <template #default="props">
          <div v-for="file in props.files" :key="file.id" class="mb-75">
            <uploader-file :file="file" class="upload-file">
              <template #default="props">
                <div class="d-flex align-items-center mb-2">
                  <div class="flex-shrink-0 me-2 mt-1">
                    <i class="file-icon" :class="$fileIcons.getClassWithColor(file.name)" />
                  </div>
                  <div class="flex-grow-1 w-75">
                    <div class="d-flex">
                      <div class="flex-grow-1 mt-1 text-truncate">
                        <b>{{ file.name }}</b>
                        <small class="text-muted text-capitalize ms-2">
                          {{
                            file._status.value == 'computing'
                              ? `${$t('components.uploader.status.computing')} [${
                                  file._status.text
                                }%]`
                              : file._status.value == 'uploading'
                              ? `${file._status.text} [${size2Str(props.currentSpeed)}/S]`
                              : `${file._status.text}`
                          }}
                        </small>
                      </div>
                      <div class="flex-shrink-0 mb-1">
                        <i
                          v-if="['waiting', 'uploading', 'paused'].includes(file._status.value)"
                          :class="`mdi mdi-${
                            file._status.value == 'paused' ? 'play' : 'pause'
                          } cursor-pointer text-primary me-2`"
                          @click="
                            () => {
                              if (file._status.value == 'paused') {
                                handleResumeUpload(file);
                              } else {
                                handlePauseUpload(file);
                              }
                            }
                          "
                        />
                        <i
                          class="mdi mdi-close cursor-pointer text-danger me-2"
                          @click.stop="handleCancelUpload(file)"
                        />
                      </div>
                    </div>
                    <div class="mt-1 mb-1">
                      <div class="progress" v-if="['computing'].includes(file._status.value)">
                        <div
                          class="progress-bar bg-info"
                          :style="{ width: `${file._status.text}%` }"
                        ></div>
                      </div>
                      <div
                        class="progress"
                        v-else-if="['waiting', 'uploading', 'paused'].includes(file._status.value)"
                      >
                        <div
                          class="progress-bar bg-primary"
                          :style="{ width: `${props.progress}%` }"
                        >
                          <div class="label">{{ props.progress }}%</div>
                        </div>
                      </div>
                      <div class="progress" v-else>
                        <div
                          :class="`progress-bar bg-${
                            file._status.value == 'merging' ? 'warning' : 'success'
                          }`"
                          style="width: 100%"
                        >
                          <div class="label">100%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </uploader-file>
          </div>
        </template>
      </uploader-files>
    </div>

    <div class="mt-1 d-flex">
      <div class="btn-group float-start" v-if="!readonly && (multiple || files.length === 0)">
        <button
          id="uploadFile"
          type="button"
          :disabled="disabled"
          class="btn btn-sm"
          :class="fieldClass"
          @click="$refs.fileUploadRef.$el.click()"
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
              @click="$refs.fileUploadRef.$el.click()"
            >
              <i class="mdi mdi-file-upload" />
              <span class="ms-1">
                {{
                  $t('components.uploader.selectFile', { count: accept == '*' && multiple ? 2 : 1 })
                }}
              </span>
            </a>
          </li>
          <li v-if="accept == '*' && multiple">
            <a
              class="dropdown-item cursor-pointer"
              :class="{ disabled }"
              @click="$refs.folderUploadRef.$el.click()"
            >
              <i class="mdi mdi-folder-upload" />
              <span class="ms-1">{{ $t('components.uploader.selectFolder') }}</span>
            </a>
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
  </uploader>
</template>

<script>
import { defineComponent, computed, ref, nextTick, onMounted, onUnmounted } from 'vue';
import SparkMD5 from 'spark-md5';
import QRCode from 'qrcodejs2';
import { useRouter, isMobile, encryptData, getFileSuffix, size2Str, copyToClipboard } from '@utils';
import store from '@store';
import { mergeFile, addUpload } from '@api/file';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import i18n from '@utils/i18n';
export default defineComponent({
  props: {
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
  },
  setup(props, { emit }) {
    const { router } = useRouter();
    const uploaderRef = ref(null);
    const fileUploadRef = ref(null);
    const folderUploadRef = ref(null);
    const uploader = computed(() => {
      return uploaderRef.value.uploader;
    });

    const chunkSize = 1024 * 1024 * 1;
    const categories = {
      image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp', 'ico'],
      video: ['mp4', 'mov', 'rmvb', 'webm', 'avi', 'swf', '3gp', 'mkv', 'flv'],
      audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
      office: ['doc', 'docx', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'],
      document: [
        'txt',
        'log',
        'json',
        'cnf',
        'conf',
        'ini',
        'js',
        'html',
        'css',
        'pdf',
        'md',
        'xml',
      ],
    };

    const options = ref({
      target: `${process.env.BASE_URL}cor/file/upload`,
      chunkSize: chunkSize,
      testChunks: true,
      singleFile: !props.multiple,
      categoryMap: categories,
      successStatuses: [200, 201, 202],
      checkChunkUploadedByResponse: (chunk, res) => {
        res = JSON.parse(res);
        if (res.code == 200) {
          return true;
        } else {
          let chunkNumber = chunk.offset + 1;
          if (chunkNumber == chunk.file.chunks.length && (res.chunks || []).includes(chunkNumber))
            mergingFile(chunk.file);
          return (res.chunks || []).includes(chunkNumber);
        }
      },
    });

    const toast = useToast();

    const files = computed({
      get() {
        return props.modelValue || [];
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const onFileAdded = (file) => {
      emit('upload-start');
      file.key = Math.random().toString(36).slice(-6);
      file.pause();
      file['_status'] = { value: 'computing', text: 0 };
      file['extension'] = getFileSuffix(file.name);
      let fileCategory = 'unknown';
      for (let category in categories) {
        if (categories[category].includes(file.extension)) fileCategory = category;
      }
      file['category'] = fileCategory;
      emit('file-add', file);
      computeFile(file);
      nextTick(() => {
        setTimeout(() => {
          const fileList = document
            .getElementById('file-list')
            ?.querySelector('.simplebar-content-wrapper');
          if (fileList)
            fileList.scrollTo({
              top: fileList.scrollHeight,
              behavior: 'smooth',
            });
        }, 100);
      });
    };

    const computeFile = (file) => {
      let fileReader = new FileReader();
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let currentChunk = 0;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();

      fileReader.onload = (e) => {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
          file['_status'] = {
            value: 'computing',
            text: ((currentChunk / chunks) * 100).toFixed(0),
          };
          loadNext();
        } else {
          let md5 = spark.end();
          spark.destroy();
          if (files.value.find((file) => file.identifier === md5)) {
            handleCancelUpload(
              file,
              i18n.global.t('components.uploader.cancel.duplicate', { name: file.name }),
            );
          } else if (file.size === 0) {
            handleCancelUpload(
              file,
              i18n.global.t('components.uploader.cancel.empty', { name: file.name }),
            );
          } else {
            file.uniqueIdentifier = md5;
            file['_status'] = {
              value: 'waiting',
              text: i18n.global.t('components.uploader.status.waiting'),
            };
          }
          uploadWaitingFiles();
        }
      };

      let loadNext = () => {
        let start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      };

      loadNext();
    };

    const onFileSuccess = (_, file, response) => {
      response = JSON.parse(response);
      if (response.code == 200) {
        onFileCompleted(file, response.data);
      } else if (response.code == 201) {
        mergingFile(file);
      }
    };

    const handleCancelUpload = (file, msg) => {
      file.cancel();
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
      if (uploader.value.files.length) uploadWaitingFiles();
      else emit('upload-end');
    };

    const uploadWaitingFiles = () => {
      setTimeout(() => {
        // let computingFiles = uploader.value.files.filter((file) => file._status.value == 'computing');
        let waitingFiles = uploader.value.files.filter((file) => file._status.value == 'waiting');
        let uploadingFile = uploader.value.files.find((file) => file._status.value == 'uploading');
        // let pausedFiles = uploader.value.files.filter((file) => file._status.value == 'paused');
        // let mergingFiles = uploader.value.files.filter((file) => file._status.value == 'merging');
        if (!uploadingFile && waitingFiles.length) {
          waitingFiles[0]['_status'] = {
            value: 'uploading',
            text: i18n.global.t('components.uploader.status.uploading'),
          };
          waitingFiles[0].resume();
        }
      }, 500);
    };

    const handlePauseUpload = (file) => {
      file.pause();
      file['_status'] = {
        value: 'paused',
        text: i18n.global.t('components.uploader.status.paused'),
      };
      uploadWaitingFiles();
    };

    const handleResumeUpload = (file) => {
      let uploadingFile = uploader.value.files.find((file) => file._status.value == 'uploading');
      if (uploadingFile) {
        file['_status'] = {
          value: 'waiting',
          text: i18n.global.t('components.uploader.status.waiting'),
        };
      } else {
        file.resume();
        file['_status'] = {
          value: 'uploading',
          text: i18n.global.t('components.uploader.status.uploading'),
        };
      }
    };

    const mergingFile = (file) => {
      file['_status'] = {
        value: 'merging',
        text: i18n.global.t('components.uploader.status.merging'),
      };
      uploadWaitingFiles();
      mergeFile(file).then(({ code, msg, data }) => {
        if (code === 200) {
          onFileCompleted(file, data);
        } else {
          handleCancelUpload(file, msg);
        }
      });
    };

    const onFileCompleted = (file, data) => {
      data.name = `${props.prefix}${file.name}`;
      addUpload(data).then(({ code, msg, data }) => {
        if (code === 200) {
          handleCancelUpload(file);
          files.value = [...files.value, ...[data]];
          emit('completed', { ...file, data });
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

    const handleRemoveUpload = (file) => {
      const _files = files.value.filter((item) => item.id != file.id);
      files.value = _files.length ? _files : null;
    };

    const handlePreviewFile = (file) => {
      const route = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
      window.open(route.href, '_blank');
    };

    const handleDownloadFile = (file) => {
      let downloadElement = document.createElement('a');
      downloadElement.href = `${process.env.BASE_URL}cor/file/load/${file.uuid}`;
      downloadElement.download = file.name;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
    };

    const socket = window.socket;

    const fileChangedHandler = ({ type, code, file }) => {
      if (code === qrcode.value) {
        if (type === 'add') files.value = [...files.value, ...[file]];
        else if (type === 'del') files.value = files.value.filter((_file) => _file.id != file.id);
      }
    };

    const uploadDropdownMenuShowHandler = () => {
      qrcode.value = null;
      if (props.qrable) hendleClickMobileUpload();
    };
    const uploadDropdownMenuHideHandler = () => {
      qrcode.value = null;
    };

    onMounted(() => {
      socket.on('fileChanged', fileChangedHandler);
      const uploadDropdownMenu = document.getElementById(`${props.id}_uploadDropdownMenu`);
      if (uploadDropdownMenu) {
        uploadDropdownMenu.addEventListener('show.bs.dropdown', uploadDropdownMenuShowHandler);
        uploadDropdownMenu.addEventListener('hide.bs.dropdown', uploadDropdownMenuHideHandler);
      }
    });

    onUnmounted(() => {
      socket.off('fileChanged', fileChangedHandler);
      const uploadDropdownMenu = document.getElementById(`${props.id}_uploadDropdownMenu`);
      if (uploadDropdownMenu) {
        uploadDropdownMenu.removeEventListener('show.bs.dropdown', uploadDropdownMenuShowHandler);
        uploadDropdownMenu.removeEventListener('hide.bs.dropdown', uploadDropdownMenuHideHandler);
      }
    });

    const qrcode = ref(null);
    const hendleClickMobileUpload = () => {
      const options = {};
      options.prefix = props.prefix;
      options.accept = props.accept;
      options.placeholder = props.placeholder;
      options.multiple = props.multiple;
      options.username =
        sessionStorage.getItem(`${process.env.BASE_URL.replace(/\//g, '_')}pubun`) ||
        store.state.user.data.username;
      qrcode.value = options.code = Math.random().toString(36).slice(-6);
      let url = `${location.origin}${process.env.BASE_URL}uploader/${encodeURIComponent(
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

    return {
      isMobile,
      size2Str,

      uploaderRef,
      fileUploadRef,
      folderUploadRef,
      options,

      files,

      onFileAdded,
      onFileSuccess,
      handleCancelUpload,
      handlePauseUpload,
      handleResumeUpload,
      handleRemoveUpload,

      handlePreviewFile,
      handleDownloadFile,

      qrcode,
    };
  },
});
</script>

<style lang="scss" scoped>
.uploader-file {
  position: relative;
  height: unset !important;
  line-height: unset !important;
  overflow: auto;
  border-bottom: unset !important;
}
</style>
