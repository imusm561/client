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
                @click.stop="handleGetCodeDirs()"
              ></i>
            </div>
            <el-tree
              ref="reftree"
              data-simplebar
              class="scroll"
              :data="tree"
              :empty-text="$t('layout.navbar.helper.code.files.empty')"
              :default-expanded-keys="defaultExpandKeys"
              @node-expand="(data) => handleNodeToggle(data, true)"
              @node-collapse="(data) => handleNodeToggle(data, false)"
              node-key="path"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              @node-drop="handleDropCode"
              @node-click="handleClickPath"
            >
              <template #default="{ node }">
                <span
                  class="d-flex flex-1 align-items-center justify-content-between fs-14 pe-2 text-truncate"
                >
                  <span class="tree-node-label text-truncate" :title="node.data.path">
                    <input
                      id="node_edit"
                      v-if="node.data.edit"
                      type="text"
                      class="form-control form-control-sm"
                      v-model="node.data.name"
                      @keyup.enter="$event.target.blur()"
                      @blur="handleSaveFileName(node)"
                    />
                    <span
                      v-else
                      @dblclick="
                        dirs.some((dir) => node.data.path.includes(dir)) &&
                          !dirs.includes(node.data.path) &&
                          handleEditFileName(node)
                      "
                    >
                      <i
                        v-if="node.data.type === 'file'"
                        style="margin-left: -3px"
                        class="file-icon file-icon-sm"
                        :class="$fileIcons.getClassWithColor(node.data.name)"
                      />
                      <i v-else class="mdi mdi-folder-outline" />
                      {{ node.data.name }}
                    </span>
                  </span>
                  <span
                    v-if="!isEditing && dirs.some((dir) => node.data.path.includes(dir))"
                    class="tree-node-actions ms-3"
                  >
                    <i
                      v-if="node.data.type === 'directory'"
                      class="cursor-pointer fs-16 text-primary mdi mdi-folder-plus-outline ms-1"
                      @click.stop="handleCreate('directory', node)"
                    ></i>
                    <i
                      v-if="node.data.type === 'directory'"
                      class="cursor-pointer fs-16 text-primary mdi mdi-file-plus-outline ms-1"
                      @click.stop="handleCreate('file', node)"
                    ></i>
                    <i
                      v-if="node.data.type === 'directory'"
                      class="cursor-pointer fs-16 text-primary mdi mdi-cloud-upload-outline ms-1"
                      @click.stop="handleUpload(node)"
                    ></i>
                    <i
                      v-if="node.data.type === 'file' && node.data.name === 'package.json'"
                      class="cursor-pointer fs-16 text-info mdi ms-1"
                      :class="
                        installing === node.key ? 'mdi-loading mdi-spin' : 'mdi-package-down '
                      "
                      @click.stop="handleInstallPackage(node)"
                    ></i>
                    <i
                      v-if="!dirs.includes(node.data.path)"
                      class="cursor-pointer fs-16 text-danger mdi mdi-delete-outline ms-1"
                      @click.stop="handleDeleteConfirm(node)"
                    ></i>
                  </span>
                </span>
              </template>
            </el-tree>
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
                        created_at: $moment(current.created_at || current.birthtime).format('llll'),
                        updated_by: current.updated_by
                          ? getUserInfo(current.updated_by).fullname
                          : $t('layout.navbar.helper.code.file.info.system'),
                        updated_at: $moment(current.updated_at || current.mtime).format('llll'),
                      })
                    "
                  >
                    <code>{{ current.path }}</code>
                  </h5>
                  <div
                    class="d-none d-md-inline"
                    v-if="editable(current) && current.data != current.file"
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
                  readOnly: !editable(current),
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

    <button
      id="showConfirmDeleteFileOrDirectoryModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#confirmDeleteFileOrDirectoryModal"
    ></button>
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

<script>
import Breadcrumb from '@layouts/breadcrumb';
import MonacoEditor from '@components/MonacoEditor';
import { ElTree } from 'element-plus';
import 'element-plus/es/components/tree/style/css';
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import i18n from '@utils/i18n';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getFileSuffix, getUserInfo } from '@utils';
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
export default {
  components: {
    Breadcrumb,
    ElTree,
    MonacoEditor,
  },
  setup() {
    const reftree = ref(null);
    const toast = useToast();
    const dirs = ref([]);
    const list = ref([]);
    const current = ref({});
    const confirm = ref({});

    const editable = computed(() => {
      return (item) => {
        return (
          item.type === 'file' &&
          ['txt', 'md', 'json', 'html', 'css', 'js'].includes(getFileSuffix(item.name))
        );
      };
    });

    const isEditing = ref(false);
    const isModified = (option) => {
      if (editable.value(current.value) && current.value.data != current.value.file) {
        if (option.toast)
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: i18n.global.t('layout.navbar.helper.code.modified'),
            },
          });
        return true;
      }
      return false;
    };

    const keydownHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (isModified({ toast: false })) handleSaveCode();
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

    const handleGetCodeDirs = (callback) => {
      if (isModified({ toast: true })) return;
      getCodeDirs().then(({ code, data, msg }) => {
        if (code === 200) {
          dirs.value = data.dirs;
          list.value = data.list;
          if (!current.value.path) {
            current.value.name = '';
            current.value.path = '/';
            current.value.type = 'directory';
            current.value.children = tree.value;
            current.value.data = JSON.stringify(
              tree.value.map((i) => {
                return `${i.type}:${i.path}`;
              }),
              null,
              2,
            );
          }
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
                switch (getFileSuffix(newNode.name)) {
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
              }
              currentNode.push(newNode);
              currentNode = newNode.children;
            }
          }
        }
        return root;
      };

      const sortTree = (tree) => {
        tree
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          })
          .sort((a, b) => {
            return a.type.localeCompare(b.type);
          });
        tree.forEach((item) => {
          if (item.children) {
            item.children = sortTree(item.children);
          }
        });
        return tree;
      };

      return sortTree(pathToTree(list.value));
    });

    const defaultExpandKeys = ref([]);
    const removeChildrenKeys = (data) => {
      if (data.children) {
        data.children.forEach((item) => {
          const index = defaultExpandKeys.value.indexOf(item.path);
          if (index != -1) defaultExpandKeys.value.splice(index, 1);
          removeChildrenKeys(item);
        });
      }
    };
    const handleNodeToggle = (data, expanded) => {
      if (expanded) {
        if (!defaultExpandKeys.value.includes(data.path)) defaultExpandKeys.value.push(data.path);
      } else {
        const index = defaultExpandKeys.value.indexOf(data.path);
        if (index != -1) defaultExpandKeys.value.splice(index, 1);
      }
      removeChildrenKeys(data);
    };

    const allowDrop = (draggingNode, dropNode, type) => {
      console.log(draggingNode, dropNode);
      return (
        type === 'inner' &&
        dropNode.data.type === 'directory' &&
        dropNode.data.path != 'public' &&
        !dropNode.data.children.some((item) => item.name === draggingNode.data.name)
      );
    };

    const allowDrag = (draggingNode) => {
      return !['logs', 'public', 'public/client', 'scripts', 'scripts'].includes(
        draggingNode.data.path,
      );
    };

    const handleDropCode = (draggingNode, dropNode) => {
      dropCode({ source: draggingNode.data, destination: dropNode.data.path }).then(
        ({ code, msg }) => {
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
        },
      );
    };

    let timer = null;
    const handleClickPath = (e) => {
      if (current.value.path != e.path && !e?.edit) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (isModified({ toast: true })) return;
          if (e.type === 'directory') {
            current.value = JSON.parse(JSON.stringify(e));
            current.value.data = JSON.stringify(
              current.value.children?.map((child) => {
                return `${child.type}:${child.path}`;
              }) || [],
              null,
              2,
            );
          } else {
            getCodeData({ path: e.path }).then(({ code, data, msg }) => {
              if (code === 200) {
                current.value = { ...data, ...JSON.parse(JSON.stringify(e)) };
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
        }, 200);
      }
    };

    const focusInputEl = () => {
      isEditing.value = true;
      setTimeout(() => {
        document.getElementById('node_edit').focus();
      }, 50);
    };

    const handleEditFileName = (node) => {
      if (isModified({ toast: true })) return;
      clearTimeout(timer);
      node.data._name = node.data.name;
      node.data.edit = true;
      focusInputEl();
    };

    const handleSaveFileName = (node) => {
      node.data.name = node.data.name.trim();

      if (
        !node.data._name &&
        (!node.data.name ||
          (node.data.type === 'directory' &&
            (node.data.name === 'node_modules' ||
              (node.parent.data.name === 'logs' && node.data.name === 'pm2'))))
      ) {
        node.parent.data.children.splice(
          node.parent.data.children.findIndex((item) => !item.name),
          1,
        );
        isEditing.value = false;
        return;
      }

      if (
        node.data._name &&
        (!node.data.name ||
          node.data.name === node.data._name ||
          (node.data.type === 'directory' &&
            (node.data.name === 'node_modules' ||
              (node.parent.data.name === 'logs' && node.data.name === 'pm2'))))
      ) {
        node.data.name = node.data._name;
        delete node.data._name;
        delete node.data.edit;
        isEditing.value = false;
        return;
      }

      if (node.parent.data.children?.some((item) => !item.edit && item.name === node.data.name)) {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: i18n.global.t('layout.navbar.helper.code.create.error'),
          },
        });
        focusInputEl();
      } else {
        if (node.data._name) {
          const data = {
            old: node.data.path,
            new: node.parent.key ? `${node.parent.key}/${node.data.name}` : node.data.name,
          };
          renameCode(data).then(({ code, msg }) => {
            if (code === 200) {
              delete node.data._name;
              delete node.data.edit;
              isEditing.value = false;
              handleGetCodeDirs(() => {
                if (current.value.path === data.old) {
                  const NODE = reftree.value.getNode(data.new);
                  if (NODE) handleClickPath(NODE.data);
                }
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
        } else {
          createCode({ type: node.data.type, name: node.data.name, path: node.data.path }).then(
            ({ code, data, msg }) => {
              if (code === 200) {
                delete node.data.edit;
                isEditing.value = false;
                handleGetCodeDirs();
                if (node.data.type === 'file') {
                  let interval;
                  interval = setInterval(() => {
                    const node = reftree.value.getNode(data.path);
                    if (node) {
                      clearInterval(interval);
                      handleClickPath(node.data);
                    }
                  }, 100);
                }
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
            },
          );
        }
      }
    };

    const handleCreate = (type, node = null) => {
      if (isModified({ toast: true })) return;
      const name = `${Math.random().toString(36).slice(-6)}${type === 'file' ? '.txt' : ''}`;
      if (node) {
        const child = { name: '', type, path: node.data.path, edit: true };
        if (!node.data.children) node.data.children = [];
        node.data.children.push(child);
        node.expanded = true;
        focusInputEl();
      } else {
        list.value.push({ type, path: name });
        setTimeout(() => {
          const node = reftree.value.getNode(name);
          node.data.name = '';
          node.data.path = '';
          node.data.edit = true;
          focusInputEl();
        }, 10);
      }
    };

    const folder = ref(null);
    const handleUpload = (node) => {
      folder.value = node.data.path;
      document.getElementById('code-file-input').click();
    };
    const handleFileInput = (e) => {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-upload',
          text: i18n.global.t('layout.navbar.helper.code.uploading'),
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
          handleGetCodeDirs();
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: i18n.global.t('layout.navbar.helper.code.upload.success'),
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
    const handleInstallPackage = (node) => {
      if (installing.value) return;
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-package-down',
          text: i18n.global.t('layout.navbar.helper.code.package.installing'),
        },
      });
      installing.value = node.key;
      installPackage({ path: node.parent.data.path }).then(async ({ code, msg }) => {
        installing.value = null;
        handleGetCodeDirs();
        toast.clear();
        if (code === 200) {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: i18n.global.t('layout.navbar.helper.code.package.install.success'),
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

    const handleDeleteConfirm = (node) => {
      if (isModified({ toast: true })) return;
      confirm.value = node.data;
      document.getElementById('showConfirmDeleteFileOrDirectoryModalBtn').click();
    };

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
      saveCode({ path: current.value.path, data: current.value.data }).then(({ code, msg }) => {
        if (code === 200) {
          document.getElementById('hideCodeDiffModalBtn').click();
          current.value.file = current.value.data;
          toast({
            component: ToastificationContent,
            props: {
              variant: 'success',
              icon: 'mdi-check-circle',
              text: i18n.global.t('layout.navbar.helper.code.modify.success'),
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

    return {
      reftree,
      dirs,
      tree,
      editable,
      isEditing,
      current,
      confirm,
      handleGetCodeDirs,
      defaultExpandKeys,
      handleNodeToggle,
      allowDrop,
      allowDrag,
      handleDropCode,
      handleClickPath,
      getUserInfo,
      handleEditFileName,
      handleSaveFileName,
      handleCreate,
      handleUpload,
      handleFileInput,
      installing,
      handleInstallPackage,
      handleDeleteConfirm,
      handleDelete,
      handleSaveCode,
    };
  },
};
</script>
