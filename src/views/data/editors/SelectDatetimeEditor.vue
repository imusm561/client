<template>
  <FlatPickr
    class="form-control h-100"
    :placeholder="params._column.cfg.placeholder"
    :config="params._column.cfg"
    v-model="value"
  ></FlatPickr>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import FlatPickr from '@components/FlatPickr';

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
