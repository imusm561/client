<template>
  <div class="row g-3">
    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.content') }}</label>
      <CKEditor
        v-model="column.cfg.content"
        id="ck_column_layout_title"
        :error="{ id: 'ck_column_layout_title', error: errors.content }"
        :class="errors.content && 'is-invalid'"
      />
      <Field name="content" v-model="column.cfg.content" rules="required" class="d-none" />
      <span class="invalid-feedback">{{ errors.content }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CKEditor from '@components/CKEditor';
// eslint-disable-next-line
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return {};
    },
  },
  errors: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
// eslint-disable-next-line
const emits = defineEmits(['update:modelValue']);
const column = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>
