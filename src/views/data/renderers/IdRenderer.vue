<template>
  <span v-if="params.node.group" class="fw-medium">
    {{ params.value }}
  </span>
  <span
    v-else-if="params.value"
    class="text-secondary text-decoration-underline cursor-pointer fw-medium"
    @click="handleViewData"
    @dblclick="handleEditData"
  >
    #{{ params.value }}
  </span>
  <span v-else></span>
</template>

<script setup>
import { useRouter } from 'vue-router';
import store from '@store';

// eslint-disable-next-line
const props = defineProps(['params']);
const router = useRouter();

let timer = null;
const handleViewData = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    router.push({
      name: 'view',
      params: { tid: props.params._form.id, rid: props.params.value },
    });
  }, 100);
};

const handleEditData = () => {
  clearTimeout(timer);
  if (
    (!props.params._form.flow?.length || props.params.node?.data?.data_state === 'drafted') &&
    store.state.user.data?.permissions?.[props.params._form.id]?.edit &&
    (props.params.node?.data?.created_by === store.state.user.data.username ||
      props.params.node?.data?.updated_by === store.state.user.data.username ||
      props.params.node?.data?.acl_edit.includes(store.state.user.data.username) ||
      (props.params.node?.data?.acl_edit.length === 0 &&
        props.params.node?.data?.acl_view.includes(store.state.user.data.username)) ||
      (props.params.node?.data?.acl_view.length === 0 &&
        props.params.node?.data?.acl_edit.length === 0))
  ) {
    router.push({
      name: 'edit',
      params: { tid: props.params._form.id, rid: props.params.value },
    });
  }
};
</script>
