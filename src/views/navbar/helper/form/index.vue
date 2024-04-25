<template>
  <div>
    <Breadcrumb :key="$route" />
    <Form
      :columnChanged="columnChanged"
      @setForm="
        ($event) => {
          form = $event;
          columnChanged = false;
        }
      "
    />
    <Column
      v-if="form.id && !(form.redirect || form.children)"
      :form="form"
      @setColumnsChangedFlag="
        ($event) => {
          columnChanged = $event;
        }
      "
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Breadcrumb from '@layouts/breadcrumb';
import Form from './components/form.vue';
import Column from './components/column.vue';

const form = ref({});
const columnChanged = ref(false);
</script>
