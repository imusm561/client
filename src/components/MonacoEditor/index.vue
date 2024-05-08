<template>
  <div ref="editorRef" class="m-editor" :style="{ height }"></div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as monaco from 'monaco-editor';
import store from '@store';

// eslint-disable-next-line
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
// eslint-disable-next-line
const emits = defineEmits(['update:modelValue', 'blur', 'error']);

monaco.editor.defineTheme('vs-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ background: '#212529' }],
  colors: {
    'editor.background': '#212529',
  },
});
monaco.editor.setTheme('vs-dark');

monaco.editor.defineTheme('vs-readonly', {
  base: 'vs',
  inherit: true,
  rules: [{ background: '#eff2f6' }],
  colors: {
    'editor.background': '#eff2f6',
  },
});
monaco.editor.setTheme('vs-readonly');

monaco.editor.defineTheme('vs-dark-readonly', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ background: '#262a2f' }],
  colors: {
    'editor.background': '#262a2f',
  },
});
monaco.editor.setTheme('vs-dark-readonly');

const editorRef = ref(null);
let editor;

onMounted(() => {
  editor = monaco.editor[props.options?.diff ? 'createDiffEditor' : 'create'](editorRef.value, {
    language: props.language,
    theme: theme.value,
    minimap: { enabled: true },
    multiCursorModifier: 'ctrlCmd',
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      alwaysConsumeMouseWheel: false,
    },
    tabSize: 2,
    useTabStops: false,
    wordWrap: true,
    automaticLayout: true,
    ...props.options,
  });

  updateValue();

  if (editor?.onDidChangeModelContent)
    editor.onDidChangeModelContent(() => {
      emits('update:modelValue', editor.getValue());
    });

  if (editor?.onDidBlurEditorText)
    editor.onDidBlurEditorText(() => {
      emits('blur');
    });

  if (editor?.onDidUpdateDiff)
    editor.onDidUpdateDiff(() => {
      emits('update:modelValue', editor.getModel()?.modified?.getValue());
    });
});

const theme = computed(() => {
  return (
    'vs' +
    (store.state.sys.theme === 'dark' ? '-dark' : '') +
    (props.options?.formControl && props.options?.readOnly ? '-readonly' : '')
  );
});

const updateValue = (val) => {
  const { modelValue, oldValue, preComment, language, options } = props;
  const value = preComment ? `${preComment}\n${val || modelValue}` : val || modelValue;
  if (options?.diff) {
    editor?.setModel({
      original: monaco.editor.createModel(oldValue || '', language),
      modified: monaco.editor.createModel(value || '', language),
    });
  } else {
    editor?.setValue(value || '');
  }
};

watch(
  () => [store.state.sys.theme, props.options?.readOnly],
  () => {
    editor?.updateOptions({ theme: theme.value, readOnly: props.options?.readOnly });
  },
);

watch(
  () => props.modelValue,
  (value) => {
    const editorValue = props.options?.diff
      ? editor?.getModel()?.modified?.getValue()
      : editor?.getValue();
    if (value !== editorValue) updateValue(value);
    if (!props.options?.readOnly && props.language === 'json') {
      try {
        if (value) JSON.parse(value);
        emits('error', null);
      } catch (error) {
        emits('error', error.message);
      }
    }
  },
);
</script>
