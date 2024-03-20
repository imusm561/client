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
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        @node-drop="handleDropDept"
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

<script setup>
import { defineEmits, computed, ref, nextTick } from 'vue';
import { ElTree } from 'element-plus';
import 'element-plus/es/components/tree/style/css';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { listToTree, getChildrenById } from '@utils';
import i18n from '@utils/i18n';
import store from '@store';
import { createDept, updateDept, dropDept } from '@api/dept';

const emit = defineEmits(['setDepts']);

const toast = useToast();

const tree = computed(() => {
  return listToTree(JSON.parse(JSON.stringify(store.state.org.depts)));
});

let timer = null;

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

const allowDrop = (draggingNode, dropNode, type) => {
  if (dropNode.data.id === 1) {
    return type === 'inner';
  } else {
    return true;
  }
};

const allowDrag = (draggingNode) => {
  return draggingNode.data.id != 1;
};

const handleDropDept = (draggingNode, dropNode, type) => {
  const updates = [];
  if (type == 'inner') {
    dropNode.childNodes.forEach((node, index) => {
      const update = { id: node.data.id, pid: dropNode.data.id, sort: index + 1 };
      const origin = store.state.org.depts.find((dept) => dept.id === update.id);
      if (update.pid != origin.pid || update.sort != origin.sort) updates.push(update);
    });
  } else {
    dropNode.parent.childNodes.forEach((node, index) => {
      const update = { id: node.data.id, pid: dropNode.parent.data.id, sort: index + 1 };
      const origin = store.state.org.depts.find((dept) => dept.id === update.id);
      if (update.pid != origin.pid || update.sort != origin.sort) updates.push(update);
    });
  }
  dropDept({ depts: updates }).then(({ code, msg }) => {
    if (code != 200) {
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

const handleEditDept = (node) => {
  clearTimeout(timer);
  node.data.name_old = node.data.name;
  node.data.edit = true;
  nextTick(() => document.getElementById('node_edit').focus());
};

const handleAddDept = (node) => {
  const child = { pid: node.data.id, name: '', name_old: 'new', edit: true };
  if (!node.data.children) node.data.children = [];
  node.data.children.push(child);
  nextTick(() => document.getElementById('node_edit').focus());
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
</script>
