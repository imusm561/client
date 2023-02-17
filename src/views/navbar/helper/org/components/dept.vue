<template>
  <div class="card card-height-100">
    <div class="card-header border-0 align-items-center d-flex pb-0">
      <h4 class="card-title mb-0 flex-grow-1">
        {{ $t('layout.navbar.helper.org.dept.departments') }}
      </h4>
    </div>
    <div class="card-body">
      <el-tree
        :data="tree"
        node-key="id"
        :empty-text="$t('layout.navbar.helper.org.dept.departments.empty')"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleSelectDept"
      >
        <template #default="{ node }">
          <span class="d-flex flex-1 align-items-center justify-content-between fs-14 pe-2">
            <span class="tree-node-label">
              <input
                id="node_edit"
                v-if="node.data.edit"
                type="text"
                class="form-control form-control-sm"
                v-model="node.data.name"
                @keyup.enter="$event.target.blur()"
                @blur="handleSaveDeptName(node)"
              />
              <span v-else @dblclick="handleEditDept(node)">{{ node.data.name }}</span>
            </span>
            <span v-if="!node.data.edit" class="tree-node-actions ms-3">
              <i
                class="cursor-pointer fs-16 text-primary mdi mdi-plus-box-outline"
                @click.stop="handleAddDept(node)"
              ></i>
              <i
                v-if="!node.data.children && node.data.pid !== 0"
                class="cursor-pointer fs-16 text-danger mdi mdi-delete-outline"
                @click.stop="handlePreDelDept(node)"
              ></i>
            </span>
          </span>
        </template>
      </el-tree>
    </div>

    <button
      id="showDeleteDeptModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#deleteDeptModal"
    />
    <div class="modal fade" id="deleteDeptModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              id="hideDeleteDeptModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $t('layout.navbar.helper.org.dept.deleteDeptModal.title', {
                      name: current_dept.name,
                    })
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.org.dept.deleteDeptModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.helper.org.dept.deleteDeptModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelDept">
                {{ $t('layout.navbar.helper.org.dept.deleteDeptModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { createDept, updateDept } from '@api/dept';
import store from '@store';
import i18n from '@utils/i18n';
import { listToTree, getChildrenById } from '@utils';
import { ElTree } from 'element-plus';
import 'element-plus/es/components/tree/style/css';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
export default {
  components: {
    ElTree,
  },
  setup(_, { emit }) {
    const toast = useToast();

    const tree = computed(() => {
      return listToTree(JSON.parse(JSON.stringify(store.state.org.depts)));
    });

    let timer = null;
    const focusInputEl = () => {
      setTimeout(() => {
        document.getElementById('node_edit').focus();
      }, 50);
    };

    const handleSelectDept = (node) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const dept = store.state.org.depts.find((dept) => dept.id === node.id);
        if (dept) {
          const depts = [...[dept], ...getChildrenById(store.state.org.depts, node.id)];
          emit('setDepts', depts);
        }
      }, 200);
    };

    const handleEditDept = (node) => {
      clearTimeout(timer);
      node.data.name_old = node.data.name;
      node.data.edit = true;
      focusInputEl();
    };

    const handleAddDept = (node) => {
      const child = { pid: node.data.id, name: '', name_old: 'new', edit: true };
      if (!node.data.children) node.data.children = [];
      node.data.children.push(child);
      focusInputEl();
    };

    const handleSaveDeptName = (node) => {
      node.data.name = node.data.name.trim();
      if (!node.data.name) node.data.name = node.data.name_old;
      if (node.data.id) {
        if (node.data.name != node.data.name_old) {
          if (store.state.org.depts.filter((dept) => dept.name == node.data.name).length > 0) {
            toast({
              component: ToastificationContent,
              props: {
                variant: 'danger',
                icon: 'mdi-alert',
                text: i18n.global.t('layout.navbar.helper.org.dept.create.error', {
                  name: node.data.name,
                }),
              },
            });
          } else {
            node.data.edit = false;
            updateDept(node.data);
          }
        } else {
          node.data.edit = false;
        }
      } else {
        if (store.state.org.depts.filter((dept) => dept.name == node.data.name).length !== 0) {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: i18n.globa.t('layout.navbar.helper.org.dept.create.error', {
                name: node.data.name,
              }),
            },
          });
        } else {
          node.data.edit = false;
          createDept(node.data);
        }
      }
    };

    const current_dept = ref({});
    const handlePreDelDept = (node) => {
      if (store.state.org.users.filter((user) => user.dept === node.data.id).length !== 0) {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: i18n.globa.t('layout.navbar.helper.org.dept.delete.error', {
              name: node.data.name,
            }),
          },
        });
      } else {
        current_dept.value = node.data;
        document.getElementById('showDeleteDeptModalBtn').click();
      }
    };

    const handleDelDept = () => {
      updateDept({
        id: current_dept.value.id,
        data_state: 'deleted',
      }).then(() => {
        current_dept.value = {};
        document.getElementById('hideDeleteDeptModalBtn').click();
      });
    };

    return {
      tree,
      handleSelectDept,
      handleEditDept,
      handleAddDept,
      handleSaveDeptName,
      current_dept,
      handlePreDelDept,
      handleDelDept,
    };
  },
};
</script>
