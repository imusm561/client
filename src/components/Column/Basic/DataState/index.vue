<template>
  <div>
    <label class="form-label" :title="resolveColumnTitle(column)">
      {{ $t('data.column.BasicDataState') }}
    </label>
    <VueSelect
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      :class="{ 'is-invalid': error }"
      :placeholder="$t('data.column.BasicDataState')"
      :disabled="!editable"
      v-model="value"
      :reduce="(item) => item.value"
      label="title"
      :options="[
        { title: $t('data.column.BasicDataState.published'), value: 'published' },
        { title: $t('data.column.BasicDataState.deleted'), value: 'deleted' },
        { title: $t('data.column.BasicDataState.drafted'), value: 'drafted' },
        { title: $t('data.column.BasicDataState.archived'), value: 'archived' },
      ]"
    >
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          <span v-html="$t('components.vs.search', { search })"></span>
        </template>
        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
      </template>
    </VueSelect>
    <Field
      :name="column.field"
      v-model="value"
      class="d-none"
      :class="{ 'is-invalid': error }"
      rules="required"
    />
    <span class="invalid-feedback">{{ $te(error) }}</span>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { resolveColumnTitle } from '@utils';
// eslint-disable-next-line
const props = defineProps({
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
  modelValue: {
    type: String,
    default: () => null,
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
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>
