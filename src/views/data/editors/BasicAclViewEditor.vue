<template>
  <UserSelector
    :key="`editor_acl_view_${params._form.id}`"
    v-model="value"
    :placeholder="$t('data.column.BasicAclView')"
  />
</template>

<script setup>
import { defineProps, ref } from 'vue';
import UserSelector from '@components/UserSelector';
const props = defineProps(['params']);

const value = ref(props.params.value);

/* eslint-disable-next-line no-unused-vars */
const getValue = () => {
  return value.value;
};

/* eslint-disable-next-line no-unused-vars */
const isCancelAfterEnd = () => {
  return false;
};
</script>
