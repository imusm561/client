import i18n from '@utils/i18n';
export default [
  {
    title: 'layout.navbar.helper.form.column.components.input',
    icon: 'mdi-form-textbox',
    list: [
      {
        icon: 'mdi-form-textbox',
        name: 'layout.navbar.helper.form.column.components.input.text',
        component: 'InputText',
        col: 6,
        type: 'varchar',
        length: 255,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          type: 'text',
          placeholder: '',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-numeric',
        name: 'layout.navbar.helper.form.column.components.input.number',
        component: 'InputNumber',
        col: 6,
        type: 'int',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
          min: -99999999,
          max: 99999999,
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-ruler',
        name: 'layout.navbar.helper.form.column.components.input.maska',
        component: 'InputMaska',
        col: 6,
        type: 'varchar',
        length: 255,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          maska: ['+86 1##-####-####', '+86 (###) ####-####'],
          placeholder: '',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-form-textarea',
        name: 'layout.navbar.helper.form.column.components.input.textarea',
        component: 'InputTextarea',
        col: 12,
        type: 'text',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          rows: 3,
          placeholder: '',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-format-float-left',
        name: 'layout.navbar.helper.form.column.components.input.richtext',
        component: 'InputRichtext',
        col: 12,
        type: 'text',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-code-tags',
        name: 'layout.navbar.helper.form.column.components.input.code',
        component: 'InputCode',
        col: 12,
        type: 'text',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          language: 'plaintext',
        },
        header: '',
        footer: '',
        sort: 0,
      },
    ],
  },
  {
    title: 'layout.navbar.helper.form.column.components.select',
    icon: 'mdi-form-select',
    list: [
      {
        icon: 'mdi-form-dropdown',
        name: 'layout.navbar.helper.form.column.components.select.single',
        component: 'SelectSingle',
        col: 6,
        type: 'varchar',
        length: 255,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
          source: null,
          options: [],
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-form-select',
        name: 'layout.navbar.helper.form.column.components.select.multiple',
        component: 'SelectMultiple',
        col: 6,
        type: 'text',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
          source: null,
          options: [],
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-label-multiple-outline',
        name: 'layout.navbar.helper.form.column.components.select.tags',
        component: 'SelectTags',
        col: 6,
        type: 'text',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
          options: [],
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-calendar',
        name: 'layout.navbar.helper.form.column.components.select.datetime',
        component: 'SelectDatetime',
        col: 6,
        type: 'date',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
          dateFormat: 'Y-m-d',
          min: null,
          max: null,
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-google-maps',
        name: 'layout.navbar.helper.form.column.components.select.position',
        component: 'SelectPosition',
        col: 6,
        type: 'varchar',
        length: 255,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          placeholder: '',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-upload',
        name: 'layout.navbar.helper.form.column.components.select.file',
        component: 'SelectFile',
        col: 6,
        type: 'text',
        length: null,
        default: null,
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          style: 'btn-primary',
          placeholder: i18n.global.t(
            'layout.navbar.helper.form.column.components.select.file.browse',
          ),
          accept: '*',
          prefix: '',
          multiple: false,
          qrable: true,
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-toggle-switch-outline',
        name: 'layout.navbar.helper.form.column.components.select.switch',
        component: 'SelectSwitch',
        col: 6,
        type: 'boolean',
        length: null,
        default: '',
        alias: null,
        visible: '',
        required: '',
        editable: '',
        tags: [],
        cfg: {
          style: 'primary',
        },
        header: '',
        footer: '',
        sort: 0,
      },
    ],
  },
  {
    title: 'layout.navbar.helper.form.column.components.layout',
    icon: 'mdi-widgets-outline',
    list: [
      {
        icon: 'mdi-gesture-tap-button',
        name: 'layout.navbar.helper.form.column.components.layout.button',
        component: 'LayoutButton',
        col: 12,
        type: null,
        length: null,
        default: null,
        alias: null,
        visible: '',
        required: null,
        editable: '',
        tags: ['hideInDataEdit'],
        cfg: {
          icon: 'mdi-link-variant',
          style: 'primary',
          href: '#',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-format-header-1',
        name: 'layout.navbar.helper.form.column.components.layout.title',
        component: 'LayoutTitle',
        col: 12,
        type: null,
        length: null,
        default: null,
        alias: null,
        visible: null,
        required: null,
        editable: null,
        tags: [],
        cfg: {
          content: '<p><strong>Content here...</strong></p>',
        },
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-format-page-break',
        name: 'layout.navbar.helper.form.column.components.layout.separator',
        component: 'LayoutSeparator',
        col: 12,
        type: null,
        length: null,
        default: null,
        alias: null,
        visible: null,
        required: null,
        editable: null,
        tags: [],
        cfg: {},
        header: '',
        footer: '',
        sort: 0,
      },
      {
        icon: 'mdi-tab',
        name: 'layout.navbar.helper.form.column.components.layout.tab',
        component: 'LayoutTab',
        col: 12,
        type: null,
        length: null,
        default: null,
        alias: null,
        visible: null,
        required: null,
        editable: null,
        tags: [],
        cfg: {
          icon: 'mdi-tab',
          style: 'primary',
        },
        header: '',
        footer: '',
        sort: 0,
      },
    ],
  },
];
