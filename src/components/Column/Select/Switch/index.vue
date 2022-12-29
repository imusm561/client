<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <div :class="`ms-1 form-check form-switch form-switch-${column.cfg.style} form-switch-md`">
      <input type="checkbox" class="form-check-input" />
    </div>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <div :class="`ms-1 form-check form-switch form-switch-${column.cfg.style} form-switch-md`">
      <input :id="`${column.field}${editable ? '_enable' : '_disabled'}`" type="checkbox" :class="['form-check-input', error && 'is-invalid']" :disabled="!editable" :checked="value" v-model="value" />
    </div>
    <Field :name="column.field" v-model="value" class="d-none" :class="{ 'is-invalid': error }" :rules="`${required ? 'required' : ''}`" />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <div :class="`ms-1 form-check form-switch form-switch-${column.cfg.style} form-switch-md`">
      <input type="checkbox" class="form-check-input" disabled :checked="value" />
    </div>
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
      type: Boolean,
      default: () => false,
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
