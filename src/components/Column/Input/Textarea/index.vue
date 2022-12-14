<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <textarea class="form-control" :rows="column.cfg.rows" :placeholder="column.cfg.placeholder" />
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <textarea
      :id="`id_${column.field}${editable ? '' : '_disabled'}`"
      :class="['form-control', error && 'is-invalid']"
      :rows="column.cfg.rows"
      :placeholder="column.cfg.placeholder"
      :disabled="!editable"
      v-model="value"
    />
    <Field :name="column.field" v-model="value" class="d-none" :class="{ 'is-invalid': error }" :rules="`${required ? 'required' : ''}`" />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <span style="white-space: pre-wrap">{{ value }}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { resolveColumnTitle } from '@utils';
export default defineComponent({
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
