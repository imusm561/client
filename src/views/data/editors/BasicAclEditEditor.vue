<template>
  <UserSelector
    :key="`editor_acl_edit_${params._form.id}`"
    v-model="value"
    :placeholder="$t('data.column.BasicAclEdit')"
    :disabled="params._form.flow.length > 0"
  />
</template>

<script setup>
import { ref } from 'vue';
import UserSelector from '@components/UserSelector';
// eslint-disable-next-line
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
