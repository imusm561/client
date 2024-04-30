<template>
  <div :key="store.state.sys.lang">
    <CKEditor
      v-model="data"
      :editor="editor"
      :disabled="disabled"
      :config="{ ...config, ...{ language: store.state.sys.lang } }"
    />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { component as CKEditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from './ckeditor';
import store from '@store';

// eslint-disable-next-line
const props = defineProps({
  error: {
    type: Object,
    default: () => {
      return { id: null, error: null };
    },
  },
  modelValue: {
    type: String,
    default: () => {
      return '';
    },
  },
  disabled: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  placeholder: {
    type: String,
    default: () => {
      return '';
    },
  },
});
// eslint-disable-next-line
const emits = defineEmits(['update:modelValue']);

const editor = ClassicEditor;
const config = {
  placeholder: props.placeholder,
};

const data = computed({
  get() {
    return props.modelValue || ' ';
  },
  set(value) {
    emits('update:modelValue', value || null);
  },
});

watch(
  () => [props.error, store.state.sys.lang],
  ([{ id, error }]) => {
    if (id) {
      setTimeout(() => {
        const ck_editor = document.getElementById(id)?.children?.[1];
        if (ck_editor) {
          ck_editor.style.setProperty('border', '1px solid #f06548', error && 'important');
          const toolbar = ck_editor
            ?.getElementsByClassName('ck-editor__top')?.[0]
            ?.getElementsByClassName('ck-toolbar')?.[0];
          if (toolbar) toolbar.style.setProperty('border-color', '#f06548', error && 'important');
        }
      }, 0);
    }
  },
  { immediate: true, deep: true },
);
</script>
