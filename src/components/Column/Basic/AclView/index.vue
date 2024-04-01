<template>
  <div>
    <label class="form-label" :title="resolveColumnTitle(column)">
      {{ $t('data.column.BasicAclView') }}
    </label>
    <UserSelector
      :key="`${column.field}${editable ? '_enable' : '_disabled'}`"
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      v-model="value"
      :disabled="!editable"
      :placeholder="$t('data.column.BasicAclView')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { resolveColumnTitle } from '@utils';
import UserSelector from '@components/UserSelector';
// eslint-disable-next-line
const props = defineProps({
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
  modelValue: {
    type: Array,
    default: () => {
      return [];
    },
  },
  required: {
    type: [Boolean, Number],
    default: () => false,
  },
  editable: {
    type: [Boolean, Number],
    default: () => true,
  },
  error: {
    type: String,
    default: () => null,
  },
});
// eslint-disable-next-line
const emits = defineEmits(['update:modelValue']);
const value = computed({
  get() {
    return props.modelValue || [];
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>
