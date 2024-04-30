import { setLocaleData } from 'monaco-editor-nls';
import zh_CN from 'monaco-editor-nls/locale/zh-hans';
import store from '@store';
if (store.state.sys.lang === 'zh-cn') setLocaleData(zh_CN);
const monaco = require('monaco-editor/esm/vs/editor/editor.api');

monaco.editor.defineTheme('vs-readonly', {
  base: 'vs',
  inherit: true,
  rules: [{ background: '#eff2f6' }],
  colors: {
    'editor.background': '#eff2f6',
  },
});
monaco.editor.setTheme('vs-readonly');

monaco.editor.defineTheme('dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ background: '#212529' }],
  colors: {
    'editor.background': '#212529',
  },
});

monaco.editor.setTheme('dark');

monaco.editor.defineTheme('dark-readonly', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ background: '#262a2f' }],
  colors: {
    'editor.background': '#262a2f',
  },
});
monaco.editor.setTheme('dark-readonly');

export default function useMonaco(language = 'json') {
  let monacoEditor = null;
  const updateValue = async (val) => {
    monacoEditor?.setValue(val);
  };

  const createEditor = (el, editorOption = {}) => {
    if (monacoEditor) {
      return;
    }
    monacoEditor =
      el &&
      monaco.editor[editorOption?.diff ? 'createDiffEditor' : 'create'](el, {
        language,
        theme: 'vs',
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
        ...editorOption,
      });
    return monacoEditor;
  };
  const createModel = (value, language) => {
    return monaco.editor.createModel(value, language);
  };
  const onFormatDoc = () => {
    monacoEditor?.getAction('editor.action.formatDocument').run();
  };
  return {
    updateValue,
    getEditor: () => monacoEditor,
    createEditor,
    createModel,
    onFormatDoc,
  };
}
