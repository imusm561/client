<template>
  <div ref="editorRef" class="m-editor" :style="{ height }"></div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, ref, watch } from 'vue';
import useMonaco from './useMonaco';
import store from '@store';
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  oldValue: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '30vh',
  },
  language: {
    type: String,
    default: 'json',
  },
  preComment: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'blur', 'error']);

const editorRef = ref(null);
const { createEditor, getEditor, updateValue, createModel } = useMonaco(props.language);

const updateMonacoValue = (monacoEditor, val) => {
  const { modelValue, oldValue, preComment, language, options } = props;
  const value = preComment ? `${preComment}\n${val || modelValue}` : val || modelValue;
  if (options?.diff) {
    monacoEditor?.setModel({
      original: createModel(oldValue || '', language),
      modified: createModel(value || '', language),
    });
  } else {
    updateValue(value || '');
  }
};

const resolveEditorTheme = () => {
  const theme = store.state.sys.theme === 'dark' ? 'dark' : 'vs';
  const readonly = !!props.options.formControl && props.options?.readOnly ? '-readonly' : '';
  return { theme: `${theme}${readonly}` };
};

let monacoEditor;

onMounted(() => {
  monacoEditor = createEditor(editorRef.value, props.options);
  updateMonacoValue(monacoEditor);

  if (monacoEditor?.onDidChangeModelContent)
    monacoEditor.onDidChangeModelContent(() => {
      emit('update:modelValue', monacoEditor.getValue());
    });

  if (monacoEditor?.onDidBlurEditorText)
    monacoEditor.onDidBlurEditorText(() => {
      emit('blur');
    });

  if (monacoEditor?.onDidUpdateDiff)
    monacoEditor.onDidUpdateDiff(() => {
      emit('update:modelValue', monacoEditor.getModel()?.modified?.getValue());
    });
});

watch(
  () => props.modelValue,
  (value) => {
    const editorValue = props.options?.diff
      ? monacoEditor?.getModel()?.modified?.getValue()
      : getEditor()?.getValue();
    if (value !== editorValue) updateMonacoValue(monacoEditor, value);
    if (!props.options?.readOnly && props.language === 'json') {
      try {
        if (value) JSON.parse(value);
        emit('error', null);
      } catch (error) {
        emit('error', error.message);
      }
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => {
    return { theme: store.state.sys.theme, readOnly: props.options?.readOnly };
  },
  () => {
    getEditor()?.updateOptions(resolveEditorTheme());
  },
  { immediate: true, deep: true },
);
</script>
