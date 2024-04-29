<template>
  <div class="card card-height-100">
    <div class="card-header border-0 align-items-center d-flex pb-0">
      <h4 class="card-title mb-0 flex-grow-1">
        {{ $t('layout.navbar.helper.org.dept.departments') }}
      </h4>
    </div>
    <div class="card-body">
      <Draggable
        ref="treeRef"
        v-model="tree"
        nodeKey="id"
        :statHandler="statHandler"
        :rootDroppable="false"
        :keepPlaceholder="true"
        :dragOpenDelay="500"
        :eachDraggable="eachDraggable"
        @before-drag-start="handleBeforeDragStart"
        @after-drop="handleAfterDrop"
      >
        <template #default="{ node, stat }">
          <div
            class="tree-node-items d-flex justify-content-between align-items-center cursor-pointer fs-14"
            @click="handleClickDept(node, stat)"
          >
            <span
              class="tree-node-info align-items-center d-flex text-truncate w-100"
              :title="node.name"
            >
              <i
                :style="{ marginRight: node.edit ? '0.8px' : '5px' }"
                class="mdi"
                :class="{
                  'mdi-folder-open-outline': stat.open,
                  'mdi-folder-outline': !stat.open,
                  'opacity-0': !node.children?.length,
                }"
              />
              <input
                v-if="node.edit"
                type="text"
                class="tree_node_input form-control w-100 me-2"
                v-model="node.name"
                @keyup.enter="$event.target.blur()"
                @blur="handleSaveDeptName(node)"
              />
              <span v-else class="w-100 text-truncate" @dblclick="handleEditDeptName(node)">
                {{ node.name }}
              </span>
            </span>
            <span class="tree-node-actions me-2" v-if="!node.edit">
              <i
                class="fs-16 text-primary mdi mdi-plus-box-outline"
                @click="handleAddDept(stat)"
              ></i>
              <i
                v-if="!node.children?.length && node.pid !== 0"
                class="fs-16 text-danger mdi mdi-delete-outline"
                @click="handleDelDeptComfirm(node)"
              ></i>
            </span>
          </div>
        </template>
      </Draggable>
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
import { computed, ref, reactive, nextTick } from 'vue';
import { Draggable, dragContext } from '@he-tree/vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { listToTree, getChildrenById } from '@utils';
import i18n from '@utils/i18n';
import store from '@store';
import { createDept, updateDept, dropDept } from '@api/dept';

// eslint-disable-next-line
const emits = defineEmits(['setDepts']);

const toast = useToast();

const treeRef = ref(null);
const expandKeys = reactive(store.state.org.depts.map((dept) => dept.id));
const tree = computed(() => {
  return listToTree(JSON.parse(JSON.stringify(store.state.org.depts)));
});

const statHandler = (stat) => {
  stat.open = expandKeys.includes(stat.data.id);
  return stat;
};

const eachDraggable = (targetStat) => {
  return targetStat.data.id != 1;
};

const handleBeforeDragStart = () => {
  clearTimeout(timer);
};

const handleAfterDrop = () => {
  const updates = [];
  const parent = dragContext.dragNode.parent?.data || { id: 0, children: treeRef.value.getData() };

  parent.children.forEach((child, index) => {
    const update = {
      id: child.id,
      pid: parent.id,
      sort: index + 1,
    };
    const origin = store.state.org.depts.find((dept) => dept.id === update.id);
    if (update.pid != origin.pid || update.sort != origin.sort) updates.push(update);
  });

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

let timer = null;

const handleClickDept = (node, stat) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (node.edit) return;
    let setDept = true;
    if (node.children?.length) {
      stat.open = !stat.open;
      if (stat.open) {
        expandKeys.push(node.id);
      } else {
        setDept = false;
        const index = expandKeys.indexOf(node.id);
        if (index > -1) expandKeys.splice(index, 1);
      }
    }
    if (setDept) {
      const dept = store.state.org.depts.find((dept) => dept.id === node.id);
      if (dept) {
        const depts = [...[dept], ...getChildrenById(store.state.org.depts, node.id)];
        emits('setDepts', depts);
      }
    }
  }, 100);
};

const handleEditDeptName = (node) => {
  clearTimeout(timer);
  node._name = node.name;
  node.edit = true;
  nextTick(() => document.querySelector('.tree_node_input')?.focus());
};

const handleSaveDeptName = (node) => {
  node.name = node.name.trim();

  if (!node.name || node.name === node._name) {
    if (node.id) {
      node.name = node._name;
      delete node._name;
      delete node.edit;
    } else {
      let stat = treeRef.value.statsFlat.find((e) => e.data === node);
      treeRef.value.remove(stat);
    }
    return;
  }

  if (store.state.org.depts.filter((dept) => dept.name == node.name).length > 0) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.dept.create.error', {
          name: node.name,
        }),
      },
    });
    return;
  }

  if (node.id) {
    updateDept(node).then(() => {
      delete node._name;
      delete node.edit;
    });
  } else {
    createDept(node).then(() => {
      delete node._name;
      delete node.edit;
    });
  }
};

const handleAddDept = (stat) => {
  treeRef.value.add(
    { pid: stat ? stat.data.id : 0, name: '', _name: '', edit: true },
    stat || null,
    stat ? stat.children.length : treeRef.value.rootChildren.length,
  );

  if (stat && !stat.open) {
    stat.open = true;
    expandKeys.push(stat.data.id);
  }
  nextTick(() => document.querySelector('.tree_node_input')?.focus());
};

const current_dept = ref({});
const handleDelDeptComfirm = (node) => {
  if (store.state.org.users.filter((user) => user.dept === node.id).length !== 0) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.dept.delete.error', {
          name: node.name,
        }),
      },
    });
  } else {
    current_dept.value = node;
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
