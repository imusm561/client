<template>
  <div>
    <Breadcrumb :key="$route" />
    <Form
      :columns-changed="columnsChanged"
      @setForm="
        ($event) => {
          form = $event;
        }
      "
    />
    <Column
      v-if="form.id && !form.redirect && !form.is_parent"
      :form="form"
      @setColumnsChangedFlag="
        ($event) => {
          columnsChanged = $event;
        }
      "
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import Breadcrumb from '@/layouts/breadcrumb';
import Form from './components/form.vue';
import Column from './components/column.vue';
export default {
  components: {
    Breadcrumb,
    Form,
    Column,
  },
  setup() {
    const form = ref({});
    const columnsChanged = ref(false);

    watch(
      () => form.value.id,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          columnsChanged.value = false;
        }
      },
      { immediate: true },
    );

    return {
      form,
      columnsChanged,
    };
  },
};
</script>
