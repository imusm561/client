<template>
  <span v-if="params.node.group" class="fw-medium">
    {{ params.value }}
  </span>
  <span v-else>
    <span
      v-if="params.value"
      class="text-primary text-decoration-underline cursor-pointer fw-medium"
      @click="handleViewData"
      @dblclick="handleEditData"
    >
      #{{ params.value }}
    </span>
    <span v-else></span>
  </span>
</template>

<script>
import { defineComponent } from 'vue';
import router from '@/router';
export default defineComponent({
  setup(props) {
    let timer = null;
    const handleViewData = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        router.push({
          name: 'view',
          params: { tid: props.params._form.id, rid: props.params.value },
        });
      }, 200);
    };
    const handleEditData = () => {
      clearTimeout(timer);
      router.push({
        name: 'edit',
        params: { tid: props.params._form.id, rid: props.params.value },
      });
    };
    return {
      handleViewData,
      handleEditData,
    };
  },
});
</script>
