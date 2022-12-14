<template>
  <ckeditor v-model="data" :editor="editor" :disabled="disabled" :config="config" />
</template>

<script>
import { defineComponent, computed, watch, onMounted } from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from './ckeditor';
export default defineComponent({
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
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
  },
  setup(props, { emit }) {
    const editor = ClassicEditor;
    const config = {
      placeholder: props.placeholder,
    };

    onMounted(() => {
      watch(
        () => props.error,
        ({ id, error }) => {
          if (id) {
            const ck_editor = document.getElementById(id)?.nextSibling;
            if (ck_editor) {
              ck_editor.style.setProperty('border', '1px solid #f06548', error && 'important');
              const toolbar = ck_editor?.getElementsByClassName('ck-editor__top')?.[0]?.getElementsByClassName('ck-toolbar')?.[0];
              if (toolbar) toolbar.style.setProperty('border-color', '#f06548', error && 'important');
            }
          }
        },
        { immediate: true, deep: true },
      );
    });

    return {
      editor,
      config,
      data: computed({
        get() {
          return props.modelValue || ' ';
        },
        set(value) {
          emit('update:modelValue', value || null);
        },
      }),
    };
  },
});
</script>
