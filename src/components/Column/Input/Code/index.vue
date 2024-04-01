<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <MonacoEditor :language="column.cfg.language" />
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <MonacoEditor
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      :class="{ 'is-invalid': error || syntax_error }"
      @error="onOccuredSyntaxError"
      v-model="value"
      :language="column.cfg.language"
      :options="{
        formControl: true,
        readOnly: !editable,
      }"
    />
    <Field
      :name="column.field"
      v-model="value"
      class="d-none"
      :class="{ 'is-invalid': error || syntax_error }"
      :rules="`${required ? 'required' : ''}`"
    />
    <span class="invalid-feedback">{{ error || syntax_error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <MonacoEditor
      v-model="value"
      :language="column.cfg.language"
      :options="{
        readOnly: true,
      }"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { resolveColumnTitle } from '@utils';
import MonacoEditor from '@components/MonacoEditor';
// eslint-disable-next-line
const props = defineProps({
  type: {
    type: String,
    default: 'EDIT',
  },
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
  modelValue: {
    type: [String, Number],
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
const emits = defineEmits(['update:modelValue', 'syntax-error']);

const syntax_error = ref(null);
const onOccuredSyntaxError = (e) => {
  syntax_error.value = e;
  emits('syntax-error', e);
};

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>
