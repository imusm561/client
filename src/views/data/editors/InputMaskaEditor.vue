<template>
  <input
    class="form-control h-100"
    type="text"
    v-maska="
      params._column.cfg.maska.length === 1 ? params._column.cfg.maska[0] : params._column.cfg.maska
    "
    :placeholder="params._column.cfg.placeholder"
    v-model="value"
  />
</template>

<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps(['params']);

const value = ref(props.params.value);

/* eslint-disable-next-line no-unused-vars */
const getValue = () => {
  return value.value;
};

/* eslint-disable-next-line no-unused-vars */
const isCancelAfterEnd = () => {
  return !!props.params._column._required && !value.value;
};
</script>
