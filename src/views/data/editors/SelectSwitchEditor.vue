<template>
  <div
    :class="`ms-3 mt-2 form-check form-switch form-switch-${params._column.cfg.style} form-switch-md`"
  >
    <input type="checkbox" class="form-check-input" :checked="value" v-model="value" />
  </div>
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
  return !!props.params._column._required;
};
</script>
