<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card adaptive">
      <div class="card-body">
        <div class="row h-100">
          <div class="col-md-3">
            <div class="d-flex">
              <h4 class="flex-grow-1">
                {{ $t('layout.navbar.helper.code.files') }}
              </h4>
              <i
                class="mdi mdi-refresh text-secondary float-end fs-16 cursor-pointer ms-1"
                @click="handleGetCodeDirs()"
              ></i>
            </div>
            <Draggable
              ref="treeRef"
              data-simplebar
              class="scroll"
              v-model="tree"
              :defaultOpen="false"
              nodeKey="path"
              :statHandler="statHandler"
              :rootDroppable="false"
              :keepPlaceholder="true"
              :dragOpenDelay="500"
              :eachDraggable="eachDraggable"
              :eachDroppable="eachDroppable"
              @before-drag-start="handleBeforeDragStart"
              @after-drop="handleAfterDrop"
            >
              <template #default="{ node, stat }">
                <div
                  class="tree-node-items d-flex justify-content-between align-items-center cursor-pointer fs-14"
                  @click="handleClickPath(node, stat)"
                >
                  <span
                    class="tree-node-info align-items-center d-flex text-truncate w-100"
                    :title="node.path"
                  >
                    <i
                      v-if="node.type === 'file'"
                      :style="{
                        minWidth: '20px',
                        marginLeft: '-3px',
                        marginRight: node.edit ? '-2.2px' : '2px',
                      }"
                      class="file-icon file-icon-sm"
                      :class="FileIcons.getClassWithColor(node.name)"
                    />
                    <i
                      v-else
                      :style="{ marginRight: node.edit ? '0.8px' : '5px' }"
                      class="mdi"
                      :class="stat.open ? 'mdi-folder-open-outline' : 'mdi-folder-outline'"
                    />
                    <input
                      v-if="node.edit"
                      type="text"
                      class="tree_node_input form-control w-100 me-2"
                      v-model="node.name"
                      @keyup.enter="$event.target.blur()"
                      @blur="handleSaveFileName(node, stat)"
                    />
                    <span v-else class="w-100 text-truncate" @dblclick="handleEditFileName(node)">
                      {{ node.name }}
                    </span>
                  </span>
                  <span class="tree-node-actions me-2" v-if="!node.edit && node.path.includes('/')">
                    <i
                      v-if="node.type === 'directory' && !node.path.startsWith('logs')"
                      class="fs-16 text-primary mdi mdi-cloud-upload-outline ms-1"
                      @click.stop="handleUpload(node)"
                    ></i>
                    <i
                      v-if="node.type === 'file' && node.name === 'package.json'"
                      class="fs-16 text-info mdi ms-1"
                      :class="
                        installing === node.key ? 'mdi-loading mdi-spin' : 'mdi-package-down '
                      "
                      @click.stop="handleInstallPackage(node, stat)"
                    ></i>
                    <i
                      v-if="!dirs.includes(node.path) && !node.path.startsWith('logs/pm2')"
                      class="fs-16 text-danger mdi mdi-delete-outline ms-1"
                      @click.stop="confirm = node"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmDeleteFileOrDirectoryModal"
                    ></i>
                  </span>
                </div>
              </template>
            </Draggable>
          </div>
          <div class="col-md-9 d-none d-md-block">
            <div class="d-flex flex-column" style="height: 100%">
              <span>
                <div class="d-flex justify-content-between mb-2">
                  <h5
                    class="text-truncate"
                    :title="
                      $t('layout.navbar.helper.code.file.info', {
                        created_by: current.created_by
                          ? getUserInfo(current.created_by).fullname
                          : $t('layout.navbar.helper.code.file.info.system'),
                        created_at: dayjs(current.created_at || current.birthtime).format('llll'),
                        updated_by: current.updated_by
                          ? getUserInfo(current.updated_by).fullname
                          : $t('layout.navbar.helper.code.file.info.system'),
                        updated_at: dayjs(current.updated_at || current.mtime).format('llll'),
                      })
                    "
                  >
                    <code>{{ current.path }}</code>
                  </h5>
                  <div
                    class="d-none d-md-inline"
                    v-if="current.editable && current.data != current.file"
                  >
                    <button
                      class="btn btn-sm btn-primary btn-icon waves-effect waves-light"
                      data-bs-toggle="modal"
                      data-bs-target="#codeDiffModal"
                    >
                      <i class="fs-20 mdi mdi-ab-testing"></i>
                    </button>
                  </div>
                </div>
              </span>
              <MonacoEditor
                :key="current.path"
                v-model="current.data"
                :language="current.language"
                :options="{
                  readOnly: !current.editable,
                }"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <input
      id="code-file-input"
      class="d-none"
      type="file"
      multiple
      @click="
        (e) => {
          e.target.value = '';
        }
      "
      @change="handleFileInput"
    />

    <div class="modal fade" id="codeDiffModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header p-2">
            <h5 class="modal-title">{{ $t('layout.navbar.helper.code.codeDiffModal.title') }}</h5>
            <button
              type="button"
              id="hideCodeDiffModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body p-0" style="height: 80vh">
            <MonacoEditor
              :key="`diff_${current.path}`"
              v-model="current.data"
              :old-value="current.file"
              :language="current.language"
              :options="{
                readOnly: true,
                diff: true,
              }"
              height="100%"
            />
          </div>
          <div class="modal-footer p-1">
            <button
              class="btn btn-sm btn-danger"
              data-bs-dismiss="modal"
              @click="current.data = current.file"
            >
              <i class="mdi mdi-restore"></i>
              {{ $t('layout.navbar.helper.code.codeDiffModal.footer.restore') }}
            </button>
            <button class="btn btn-sm btn-success" @click="handleSaveCode">
              <i class="mdi mdi-content-save-outline"></i>
              {{ $t('layout.navbar.helper.code.codeDiffModal.footer.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      id="showCodeDataOffcanvasBtn"
      class="d-none"
      data-bs-toggle="offcanvas"
      data-bs-target="#codeDataOffcanvas"
    />
    <div
      class="offcanvas offcanvas-end w-resp d-md-none"
      :data-bs-backdrop="false"
      id="codeDataOffcanvas"
    >
      <div class="offcanvas-body p-0 overflow-hidden">
        <i
          class="i-close mdi mdi-close-box fs-24 text-muted cursor-pointer"
          data-bs-dismiss="offcanvas"
        />
        <MonacoEditor
          :key="current.path"
          v-model="current.data"
          :language="current.language"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>

    <div
      class="modal fade"
      id="confirmDeleteFileOrDirectoryModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4 class="text-capitalize">
                  {{
                    confirm.type === 'file'
                      ? $t('layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.title.file')
                      : $t(
                          'layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.title.directory',
                        )
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">
                  {{
                    $t('layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.confirm.before')
                  }}
                  <code class="text-primary fw-bold d-block" style="white-space: break-spaces">
                    {{ confirm.path }}
                  </code>
                  {{
                    $t('layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.confirm.after')
                  }}
                </p>
                <h5 class="text-warning" v-if="confirm.children?.length">
                  {{ $t('layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.attention') }}
                </h5>
                <input class="form-control" v-model="confirm.confirm" :placeholder="confirm.path" />
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.cancel') }}
              </button>
              <button
                type="button"
                :disabled="confirm.confirm !== confirm.path"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="handleDelete"
              >
                {{ $t('layout.navbar.helper.code.confirmDeleteFileOrDirectoryModal.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { Draggable, dragContext } from '@he-tree/vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getFileExt, getUserInfo } from '@utils';
import dayjs from '@utils/dayjs';
import Breadcrumb from '@layouts/breadcrumb';
import MonacoEditor from '@components/MonacoEditor';
import {
  getCodeDirs,
  getCodeData,
  createCode,
  uploadCode,
  installPackage,
  deleteCode,
  renameCode,
  saveCode,
  dropCode,
} from '@api/code';

const { FileIcons } = window;
const toast = useToast();

const dirs = ref([]);
const list = ref([]);
const handleGetCodeDirs = (callback) => {
  getCodeDirs().then(({ code, data, msg }) => {
    if (code === 200) {
      dirs.value = data.dirs;
      list.value = data.list;
      nextTick(() => {
        callback && callback();
      });
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

const keydownHandler = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    if (current.value?.data != current.value?.file) handleSaveCode();
    e.preventDefault();
  }
};

onMounted(() => {
  handleGetCodeDirs();
  document.addEventListener('keydown', keydownHandler);
});

onUnmounted(() => {
  document.removeEventListener('keydown', keydownHandler);
});

const treeRef = ref(null);
const expandKeys = reactive([]);

const tree = computed(() => {
  const pathToTree = (arr) => {
    let root = [];
    for (let i = 0; i < arr.length; i++) {
      let chain = arr[i].path.split('/');
      let currentNode = root;
      for (let j = 0; j < chain.length; j++) {
        let name = chain[j];
        let lastNode = currentNode;

        for (let k = 0; k < currentNode.length; k++) {
          if (currentNode[k].name === name) {
            currentNode = currentNode[k].children;
            break;
          }
        }

        if (lastNode === currentNode) {
          let newNode = {
            name: name,
          };

          if (j === chain.length - 1) {
            newNode.path = arr[i].path;
          } else {
            newNode.path = chain.slice(0, j + 1).join('/');
            newNode.children = [];
          }
          newNode.type = arr.find((item) => item.path === newNode.path)?.type || 'directory';

          if (newNode.type === 'file') {
            let extension = getFileExt(newNode.name);
            switch (extension) {
              case 'log':
                newNode.language = 'log';
                break;
              case 'html':
                newNode.language = 'html';
                break;
              case 'js':
                newNode.language = 'javascript';
                break;
              case 'json':
                newNode.language = 'json';
                break;
              case 'md':
                newNode.language = 'markdown';
                break;
              case 'yml':
                newNode.language = 'yaml';
                break;
              case 'ts':
                newNode.language = 'typescript';
                break;
              case 'css':
                newNode.language = 'css';
                break;
              case 'scss':
                newNode.language = 'scss';
                break;
              case 'less':
                newNode.language = 'less';
                break;
              case 'php':
                newNode.language = 'php';
                break;
              case 'py':
                newNode.language = 'python';
                break;
              case 'sql':
                newNode.language = 'mysql';
                break;
              default:
                newNode.language = /.log(.\d{1,2})?$/.test(newNode.name) ? 'log' : 'plaintext';
                break;
            }
            newNode.editable = !newNode.path.startsWith('logs');
          }
          currentNode.push(newNode);
          currentNode = newNode.children;
        }
      }
    }
    return root;
  };

  const sortTree = (tree, sort = false) => {
    if (sort) {
      tree
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .sort((a, b) => {
          return a.type.localeCompare(b.type);
        });
    }
    tree.forEach((item) => {
      if (item.children) {
        item.children = sortTree(item.children, true);
      }
    });
    return tree;
  };

  return sortTree(pathToTree(list.value));
});

const statHandler = (stat) => {
  stat.open = expandKeys.includes(stat.data.path);
  return stat;
};

const eachDraggable = (targetStat) => {
  if (
    current.value?.path?.startsWith(targetStat.data.path) &&
    current.value?.data != current.value?.file
  ) {
    return false;
  }
  return targetStat.level > 2 && !targetStat.data.path.startsWith('logs');
};

const eachDroppable = (targetStat) => {
  return (
    targetStat.level >= 2 &&
    !targetStat.data.path.startsWith('logs') &&
    targetStat.data.type === 'directory' &&
    !targetStat.data.children.some((item) => item.name === dragContext.dragNode.data.name)
  );
};

const handleBeforeDragStart = () => {
  clearTimeout(timer);
};

const handleAfterDrop = () => {
  let data = {
    source: dragContext.dragNode.data,
    destination: dragContext.dragNode.parent.data.path,
  };
  dropCode(data).then(({ code, msg }) => {
    if (code === 200) {
      handleGetCodeDirs(() => {
        let stat = treeRef.value.statsFlat.find((item) => item.data.path === data.destination);
        treeRef.value.openNodeAndParents(stat);
      });
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

let timer = null;
const current = ref({});

const handleClickPath = (node, stat) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (node.edit) return;
    if (node.type === 'directory') {
      // if (node.children?.length) stat.open = !stat.open;
      stat.open = !stat.open;
      if (stat.open) {
        expandKeys.push(node.path);
      } else {
        const index = expandKeys.indexOf(node.path);
        if (index > -1) expandKeys.splice(index, 1);
        // treeRef.value.statsFlat
        //   .filter((item) => item.data.path.startsWith(node.path))
        //   .forEach((item) => {
        //     item.open = false;
        //     const index = expandKeys.indexOf(item.data.path);
        //     if (index > -1) expandKeys.splice(index, 1);
        //   });
      }
    } else {
      if (current.value.path != node.path) {
        if (current.value?.path && current.value?.data != current.value?.file) {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: 'layout.navbar.helper.code.editing',
            },
          });
        } else {
          getCodeData({ path: node.path }).then(({ code, data, msg }) => {
            if (code === 200) {
              current.value = { ...data, ...node };
              document.getElementById('showCodeDataOffcanvasBtn').click();
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
        }
      }
    }
  }, 100);
};

const handleEditFileName = (node) => {
  clearTimeout(timer);
  if (!(node.path.includes('/') && !node.path.startsWith('logs'))) return;
  if (current.value?.path?.startsWith(node.path) && current.value?.data != current.value?.file) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: 'layout.navbar.helper.code.editing',
      },
    });
    return;
  }
  node._name = node.name;
  node.edit = true;
  nextTick(() => document.querySelector('.tree_node_input')?.focus());
};

const handleSaveFileName = (node, stat) => {
  node.name = node.name.trim();
  node._path = stat?.parent?.data?.path ? `${stat.parent.data.path}/${node.name}` : node.name;

  if (
    !node.name ||
    node.name === node._name ||
    (dirs.value.includes(node.path) && !node.name.startsWith(`${node._name}/`))
  ) {
    node.name = node._name;
    delete node._name;
    delete node.edit;
    return;
  }

  if (
    node._path.includes('/node_modules/') ||
    node._path.endsWith('/node_modules') ||
    (node.type === 'file' && node.name.includes('/')) ||
    (((node.type === 'directory' && node.name.includes('/')) || dirs.value.includes(node.path)) &&
      (node.name === `${node._name}/` || !node.name.startsWith(`${node._name}/`)))
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: 'layout.navbar.helper.code.name.illegal',
      },
    });
    nextTick(() => document.querySelector('.tree_node_input')?.focus());
    return;
  }

  if (
    list.value.find((item) => item.path === node._path) ||
    list.value.find((item) => item.type === 'file' && node._path.includes(`${item.path}/`))
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: 'layout.navbar.helper.code.name.duplicate',
      },
    });
    nextTick(() => document.querySelector('.tree_node_input')?.focus());
    return;
  }

  if (node.name.includes('/')) {
    const data = {
      type: node.name.endsWith('/') ? 'directory' : 'file',
      name: (node.name.endsWith('/') ? node.name.slice(0, -1) : node.name).replace(
        `${node._name}/`,
        '',
      ),
      path: node.path,
    };
    createCode(data).then((res) => {
      if (res.code === 200) {
        delete node._name;
        delete node.edit;
        if (!stat.open) {
          stat.open = true;
          expandKeys.push(node.path);
        }
        handleGetCodeDirs(() => {
          let stat = treeRef.value.statsFlat.find((item) => item.data.path === res.data.path);
          treeRef.value.openNodeAndParents(stat);
          handleClickPath(stat.data, stat);
        });
      } else {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: res.msg,
          },
        });
      }
    });
  } else {
    const data = {
      old: node.path,
      new: node._path,
    };
    renameCode(data).then((res) => {
      if (res.code === 200) {
        delete node._name;
        delete node.edit;
        handleGetCodeDirs();
      } else {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: res.msg,
          },
        });
      }
    });
  }
};

const folder = ref(null);

const handleUpload = (node) => {
  folder.value = node.path;
  document.getElementById('code-file-input').click();
};

const handleFileInput = (e) => {
  toast({
    component: ToastificationContent,
    props: {
      variant: 'success',
      icon: 'mdi-upload',
      text: 'layout.navbar.helper.code.uploading',
    },
  });
  const formData = new FormData();
  formData.append('folder', folder.value);
  Array.from(e.target.files).forEach((file) => {
    formData.append('file', file, file.name);
  });
  uploadCode(formData).then(async ({ code, msg }) => {
    toast.clear();
    if (code === 200) {
      e.target.value = null;
      handleGetCodeDirs(() => {
        let stat = treeRef.value.statsFlat.find((item) => item.data.path === folder.value);
        treeRef.value.openNodeAndParents(stat);
      });
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: 'layout.navbar.helper.code.upload.success',
        },
      });
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

const installing = ref(null);

const handleInstallPackage = (node, stat) => {
  if (installing.value) return;
  toast({
    component: ToastificationContent,
    props: {
      variant: 'success',
      icon: 'mdi-package-down',
      text: 'layout.navbar.helper.code.package.installing',
    },
  });
  installing.value = node.key;
  installPackage({ path: stat.parent.data.path }).then(async ({ code, msg }) => {
    installing.value = null;
    handleGetCodeDirs();
    toast.clear();
    if (code === 200) {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: 'layout.navbar.helper.code.package.install.success',
        },
      });
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

const confirm = ref({});
const handleDelete = () => {
  deleteCode({ type: confirm.value.type, path: confirm.value.path }).then(({ code, msg }) => {
    if (code === 200) {
      handleGetCodeDirs();
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

const handleSaveCode = () => {
  saveCode({ path: current.value.path, data: current.value.data }).then(({ code, data, msg }) => {
    if (code === 200) {
      if (data.refresh) handleGetCodeDirs();
      document.getElementById('hideCodeDiffModalBtn').click();
      current.value.file = current.value.data;
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: 'layout.navbar.helper.code.edit.success',
        },
      });
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
</script>
