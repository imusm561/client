<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card adaptive">
      <div class="card-body">
        <div class="row h-100">
          <div class="col-5">
            <div class="d-flex">
              <h4 class="flex-grow-1">{{ $t('layout.navbar.helper.redis.keys') }}</h4>
              <i class="mdi mdi-refresh text-primary float-end fs-16 cursor-pointer" @click.stop="handleGetKeys"></i>
            </div>
            <el-tree data-simplebar class="scroll" :data="tree" node-key="key" :draggable="false" :expand-on-click-node="false" @node-click="handleClickKey">
              <template #default="{ node }">
                <span class="d-flex flex-1 align-items-center justify-content-between fs-14 pe-2 text-truncate" :title="node.data.key">
                  <span class="tree-node-label text-truncate">
                    {{ node.data.name }}
                  </span>
                  <span class="tree-node-actions ms-3">
                    <i class="cursor-pointer fs-16 text-danger mdi mdi-delete-outline" data-bs-toggle="modal" data-bs-target="#confirmDeleteKeyModal"></i>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>

          <div class="col-7 d-none d-md-block">
            <div class="d-flex flex-column" style="height: 100%">
              <span class="fs-16">{{ current.key || '*' }}</span>
              <MonacoEditor
                v-model="current.detail"
                language="json"
                :options="{
                  readOnly: true,
                }"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <button id="showKeyDataOffcanvasBtn" class="d-none" data-bs-toggle="offcanvas" data-bs-target="#keyDataOffcanvas" />
    <div class="offcanvas form offcanvas-end w-50 d-md-none" :data-bs-backdrop="false" id="keyDataOffcanvas">
      <div class="offcanvas-body p-0 overflow-hidden">
        <i class="cursor-pointer d-md-none fs-36 mdi mdi-exit-to-app position-absolute" style="z-index: 1; right: 10px; bottom: 0" data-bs-dismiss="offcanvas" />
        <MonacoEditor
          v-model="current.detail"
          language="json"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>

    <div class="modal fade" id="confirmDeleteKeyModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $tc('layout.navbar.helper.redis.confirmDeleteKeyModal.title', current.children?.length || 1) }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $tc('layout.navbar.helper.redis.confirmDeleteKeyModal.confirm', current.children?.length || 1) }}</p>
                <code>{{ current.key }}</code>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">{{ $t('layout.navbar.helper.redis.confirmDeleteKeyModal.cancel') }}</button>
              <button type="button" class="btn w-sm btn-danger" data-bs-dismiss="modal" @click="handleDelKey">{{ $t('layout.navbar.helper.redis.confirmDeleteKeyModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/layouts/breadcrumb';
import MonacoEditor from '@components/MonacoEditor';
import { ElTree } from 'element-plus';
import 'element-plus/es/components/tree/style/css';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getKeys, getKey, delKey } from '@api/com/redis';
export default {
  components: {
    Breadcrumb,
    ElTree,
    MonacoEditor,
  },
  setup() {
    const toast = useToast();
    const keys = ref([]);
    const current = ref({});

    onMounted(() => {
      handleGetKeys();
    });

    const handleGetKeys = () => {
      current.value = {};
      getKeys().then(({ code, data, msg }) => {
        if (code === 200) {
          keys.value = data;
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
      const keyToTree = (keys) => {
        let root = [];
        for (let i = 0; i < keys.length; i++) {
          let chain = keys[i].split(':');
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
                newNode.key = keys[i];
              } else {
                newNode.key = chain.slice(0, j + 1).join(':') + ':*';
                newNode.children = [];
              }

              currentNode.push(newNode);
              currentNode = newNode.children;
            }
          }
        }
        return root;
      };
      return keyToTree(keys.value);
    });

    const handleClickKey = (e) => {
      current.value = JSON.parse(JSON.stringify(e));
      if (current.value.children) {
        current.value.detail = JSON.stringify(
          current.value.children.map((child) => {
            return child.key;
          }),
          null,
          2,
        );
      } else {
        getKey({ key: current.value.key }).then(({ code, data, msg }) => {
          if (code === 200) {
            current.value.detail = JSON.stringify(data, null, 2);
            document.getElementById('showKeyDataOffcanvasBtn').click();
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
    };

    const handleDelKey = () => {
      delKey({
        key: current.value.key,
      }).then(({ code, msg }) => {
        if (code === 200) {
          handleGetKeys();
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

    return { tree, current, handleGetKeys, handleClickKey, handleDelKey };
  },
};
</script>
