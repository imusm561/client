import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import AutoFormat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';

import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';

import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import SubScript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import SuperScript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import Link from '@ckeditor/ckeditor5-link/src/link';
import Blockquote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';

import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';

import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';

import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import List from '@ckeditor/ckeditor5-list/src/list';
import Todolist from '@ckeditor/ckeditor5-list/src/todolist';

import Code from '@ckeditor/ckeditor5-basic-styles/src/code';

const { BASE_URL } = process.env;

export default class ClassicEditor extends ClassicEditorBase {}
ClassicEditor.builtinPlugins = [
  Essentials,
  AutoFormat,
  PasteFromOffice,

  SourceEditing,

  Paragraph,
  Heading,

  Bold,
  Italic,
  Underline,
  Strikethrough,
  SubScript,
  SuperScript,

  Link,
  Blockquote,
  HorizontalLine,

  FontSize,
  FontColor,
  FontBackgroundColor,

  SimpleUploadAdapter,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResize,

  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,

  Indent,
  IndentBlock,

  Alignment,
  List,
  Todolist,

  Code,
];

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'sourceEditing',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      '|',
      'link',
      'blockQuote',
      'horizontalLine',
      '|',
      'fontSize',
      'fontcolor',
      'fontbackgroundcolor',
      '|',
      'code',
      'imageUpload',
      'insertTable',
      '|',
      'indent',
      'outdent',
      '|',
      'alignment',
      'bulletedList',
      'numberedList',
      'todolist',
    ],
  },
  heading: {
    options: [
      {
        model: 'paragraph',
        title: 'Paragraph',
        class: 'ck-heading_paragraph',
      },
      {
        model: 'heading1',
        view: 'h1',
        title: 'Heading 1',
        class: 'ck-heading_heading1',
      },
      {
        model: 'heading2',
        view: 'h2',
        title: 'Heading 2',
        class: 'ck-heading_heading2',
      },
      {
        model: 'heading3',
        view: 'h3',
        title: 'Heading 3',
        class: 'ck-heading_heading3',
      },
      {
        model: 'heading4',
        view: 'h4',
        title: 'Heading 4',
        class: 'ck-heading_heading4',
      },
      {
        model: 'heading5',
        view: 'h5',
        title: 'Heading 5',
        class: 'ck-heading_heading5',
      },
      {
        model: 'heading6',
        view: 'h6',
        title: 'Heading 6',
        class: 'ck-heading_heading6',
      },
    ],
  },
  fontSize: {
    options: [10, 'default', 14, 16, 18, 24, 36, 48],
  },
  simpleUpload: {
    uploadUrl: `${BASE_URL}cor/file/ckeditor`,
  },
  link: {
    addTargetToExternalLinks: true,
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      'imageStyle:alignBlockLeft',
      'imageStyle:inline',
      'imageStyle:alignBlockRight',
    ],
    styles: [
      'alignLeft',
      'alignCenter',
      'alignRight',
      'alignBlockLeft',
      'inline',
      'alignBlockRight',
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tablecellproperties',
    ],
  },
};
