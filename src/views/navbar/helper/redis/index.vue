<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card adaptive">
      <div class="card-body">
        <div class="row h-100">
          <div class="col-md-3">
            <div class="d-flex">
              <h4 class="flex-grow-1">{{ $t('layout.navbar.helper.redis.keys') }}</h4>
              <i
                class="mdi mdi-refresh text-primary float-end fs-16 cursor-pointer"
                @click="handleGetKeys"
              ></i>
            </div>
            <BaseTree
              ref="treeRef"
              data-simplebar
              class="scroll"
              v-model="tree"
              :defaultOpen="false"
              nodeKey="key"
              :statHandler="statHandler"
            >
              <template #default="{ node, stat }">
                <div
                  class="tree-node-items d-flex justify-content-between align-items-center cursor-pointer fs-14"
                >
                  <span
                    class="tree-node-info align-items-center d-flex text-truncate w-100"
                    @click="handleClickKey(node, stat)"
                    :title="node.key"
                  >
                    <i
                      v-if="node.children?.length"
                      class="me-1 mdi"
                      :class="stat.open ? 'mdi-folder-open-outline' : 'mdi-folder-outline'"
                    />
                    <i v-else class="me-1 mdi mdi-key-outline" />
                    <span class="w-100 text-truncate">
                      {{ node.name }}
                    </span>
                  </span>
                  <span class="tree-node-actions me-2">
                    <i
                      class="fs-16 text-danger mdi mdi-delete-outline ms-1"
                      @click="confirm = node"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmDeleteKeyModal"
                    ></i>
                  </span>
                </div>
              </template>
            </BaseTree>
          </div>

          <div class="col-md-9 d-none d-md-block">
            <div class="d-flex flex-column" style="height: 100%">
              <span class="fs-16">{{ current.key || '*' }}</span>
              <MonacoEditor
                :key="current.key"
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

    <button
      id="showKeyDataOffcanvasBtn"
      class="d-none"
      data-bs-toggle="offcanvas"
      data-bs-target="#keyDataOffcanvas"
    />
    <div
      class="offcanvas offcanvas-end w-resp d-md-none"
      :data-bs-backdrop="false"
      id="keyDataOffcanvas"
    >
      <div class="offcanvas-body p-0 overflow-hidden">
        <i
          class="i-close mdi mdi-close-box fs-24 text-muted cursor-pointer"
          data-bs-dismiss="offcanvas"
        />
        <MonacoEditor
          :key="current.key"
          v-model="current.detail"
          language="json"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>

    <div
      class="modal fade"
      id="confirmDeleteKeyModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $tc(
                      'layout.navbar.helper.redis.confirmDeleteKeyModal.title',
                      confirm.children?.length || 1,
                    )
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{
                    $tc(
                      'layout.navbar.helper.redis.confirmDeleteKeyModal.confirm',
                      confirm.children?.length || 1,
                    )
                  }}
                </p>
                <code>{{ confirm.key }}</code>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.helper.redis.confirmDeleteKeyModal.cancel') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="handleDelKey"
              >
                {{ $t('layout.navbar.helper.redis.confirmDeleteKeyModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { BaseTree } from '@he-tree/vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import Breadcrumb from '@layouts/breadcrumb';
import MonacoEditor from '@components/MonacoEditor';
import { getKeys, getKey, delKey } from '@api/com/redis';

const toast = useToast();

const keys = ref([]);
const handleGetKeys = () => {
  getKeys().then(({ code, data, msg }) => {
    if (code === 200) {
      keys.value = data.sort();
      if (!current.value.detail || Array.isArray(JSON.parse(current.value.detail))) {
        current.value.name = '*';
        current.value.key = '*';
        current.value.detail = JSON.stringify(keys.value, null, 2);
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
  });
};

onMounted(() => {
  handleGetKeys();
});

const treeRef = ref(null);
const expandKeys = reactive([]);

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

const statHandler = (stat) => {
  stat.open = expandKeys.includes(stat.data.key);
  return stat;
};

const current = ref({});
const handleClickKey = (node, stat) => {
  if (node.children?.length) {
    stat.open = !stat.open;
    if (stat.open) {
      expandKeys.push(node.key);
      current.value = node;
      current.value.detail = JSON.stringify(
        current.value.children.map((child) => {
          return child.key;
        }),
        null,
        2,
      );
    } else {
      const index = expandKeys.indexOf(node.key);
      if (index > -1) expandKeys.splice(index, 1);
    }
  } else {
    if (current.value.key != node.key) {
      getKey({ key: node.key }).then(({ code, data, msg }) => {
        if (code === 200) {
          current.value = node;
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
  }
};

const confirm = ref({});
const handleDelKey = () => {
  delKey({
    key: confirm.value.key,
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
</script>
