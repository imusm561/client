<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <Uploader
      :placeholder="column.cfg.placeholder"
      :accept="column.cfg.accept"
      :prefix="column.cfg.prefix"
      :multiple="column.cfg.multiple"
      disabled
    />
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <Uploader
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      :field-class="error ? 'btn-outline-danger' : column.cfg.style || 'btn-primary'"
      :placeholder="column.cfg.placeholder"
      :accept="column.cfg.accept"
      :prefix="column.cfg.__prefix || ''"
      :multiple="column.cfg.multiple"
      :qrable="column.cfg.qrable"
      :disabled="!editable"
      v-model="value"
      @uploadStart="$emit('set-upload-status', true)"
      @uploadEnd="$emit('set-upload-status', false)"
    />
    <Field
      :name="column.field"
      v-model="value"
      class="d-none"
      :class="{ 'is-invalid': error }"
      :rules="`${required ? 'required' : ''}`"
    />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <Uploader v-model="value" readonly />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { resolveColumnTitle } from '@utils';
import Uploader from '@components/Uploader';
export default defineComponent({
  components: {
    Uploader,
  },
  props: {
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
      type: Array,
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
  },
  setup(props, { emit }) {
    return {
      resolveColumnTitle,
      value: computed({
        get() {
          return props.modelValue;
        },
        set(value) {
          emit('update:modelValue', value);
        },
      }),
    };
  },
});
</script>
