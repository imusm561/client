<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <CKEditor :placeholder="column.cfg.placeholder" />
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <CKEditor
      :id="`ck_${column.field}${editable ? '' : '_disabled'}`"
      :error="{ id: `ck_${column.field}${editable ? '' : '_disabled'}`, error }"
      :class="{ 'is-invalid': error }"
      :placeholder="column.cfg.placeholder"
      :disabled="!editable"
      v-model="value"
    />
    <Field :name="column.field" v-model="value" class="d-none" :class="{ 'is-invalid': error }" :rules="`${required ? 'required' : ''}`" />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else data-simplebar class="border p-1 vh-50">
    <span class="ck ck-content" v-html="value" />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { resolveColumnTitle } from '@utils';
import CKEditor from '@components/CKEditor';
export default defineComponent({
  components: {
    CKEditor,
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
