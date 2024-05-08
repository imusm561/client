<template>
  <div class="card m-0">
    <div class="card-header border-0 p-2 pb-0">
      <i
        class="mdi mdi-refresh fs-16 cursor-pointer text-muted float-end pe-2"
        @click="handleRefetchPubForm"
      ></i>
      <i
        v-if="tabs.length > 1"
        class="mdi fs-16 cursor-pointer text-muted float-end pe-2"
        :class="ribbon_mode ? 'mdi-tab' : 'mdi-ribbon'"
        @click="handleToggleRibbonMode"
      ></i>
    </div>
    <div class="card-body pt-0">
      <Form :id="`zz_${form.id}`" v-slot="{ errors }" @submit="handleSubmitFormData">
        <div v-if="tabs.length > 1 && ribbon_mode">
          <div
            :id="tab.field"
            class="p-3 mt-2 border-bottom border-bottom-dashed ribbon-box right"
            v-for="(tab, index) in tabs"
            :key="index"
          >
            <div v-if="tab.name" class="ribbon ribbon-primary round-shape">
              <i v-if="tab.cfg.icon" :class="`mdi ${tab.cfg.icon} me-2`"></i>
              {{ tab.name }}
            </div>
            <div class="row">
              <template v-for="column in tab.columns">
                <h5
                  :id="column.field"
                  :key="column.id"
                  v-if="column._visible"
                  class="fs-14 mb-2 mt-2"
                  :class="`col-sm-${column.col}`"
                >
                  <component
                    :key="column.key"
                    :is="column.component"
                    type="EDIT"
                    :column="column"
                    v-model="data[column.field]"
                    :required="column._required"
                    :editable="column._editable"
                    :error="errors[column.field]"
                    @search="handleSelecterSearch"
                    @selected="($event) => (column.cfg.selected = $event)"
                    @refresh="setColumnConfiguration($event)"
                    @syntaxError="
                      ($event) => {
                        column.cfg.syntax_error = $event;
                      }
                    "
                    @setUploadStatus="
                      ($event) => {
                        column.cfg.is_uploading = $event;
                      }
                    "
                  ></component>
                </h5>
              </template>
            </div>
          </div>
          <div class="p-3 border-0 d-flex justify-content-end gap-2">
            <button
              type="submit"
              class="btn btn-sm btn-primary"
              :disabled="
                Object.keys(errors).length ||
                columns.filter((column) => column.cfg.syntax_error).length != 0 ||
                columns.filter((column) => column.cfg.is_uploading).length != 0
              "
            >
              {{ $t('public.form.submit') }}
            </button>
          </div>
        </div>
        <div v-else>
          <div v-if="tabs[0] && tabs[0].id" class="row align-items-center mt-3">
            <div class="col">
              <ul class="nav nav-tabs nav-tabs-custom nav-primary">
                <li class="nav-item" v-for="(tab, index) in tabs" :key="tab.id">
                  <a
                    :class="`nav-link text-${tab.cfg.style} ${index === current_tab && 'active'}`"
                    data-bs-toggle="tab"
                    :href="`#${tab.field}`"
                    @click="current_tab = index"
                  >
                    <i v-if="tab.cfg.icon" :class="`mdi ${tab.cfg.icon}`"></i>
                    {{ tab.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="tab-content text-muted">
            <div
              class="tab-pane"
              :class="{ active: index === current_tab }"
              :id="tab.field"
              v-for="(tab, index) in tabs"
              :key="tab.id"
            >
              <div class="row p-3">
                <template v-for="column in tab.columns">
                  <h5
                    :id="column.field"
                    :key="column.id"
                    v-if="column._visible"
                    class="fs-14 mb-2 mt-2"
                    :class="`col-sm-${column.col}`"
                  >
                    <component
                      :key="column.key"
                      :is="column.component"
                      type="EDIT"
                      :column="column"
                      v-model="data[column.field]"
                      :required="column._required"
                      :editable="column._editable"
                      :error="errors[column.field]"
                      @search="handleSelecterSearch"
                      @selected="($event) => (column.cfg.selected = $event)"
                      @refresh="setColumnConfiguration($event)"
                      @syntaxError="
                        ($event) => {
                          column.cfg.syntax_error = $event;
                        }
                      "
                      @setUploadStatus="
                        ($event) => {
                          column.cfg.is_uploading = $event;
                        }
                      "
                    ></component>
                  </h5>
                </template>
              </div>
              <div v-if="index === tabs.length - 1">
                <div
                  class="p-3 border-top border-top-dashed border-0 d-flex justify-content-end gap-2"
                >
                  <button
                    type="submit"
                    class="btn btn-sm btn-primary"
                    :disabled="
                      Object.keys(errors).length ||
                      columns.filter((column) => column.cfg.syntax_error).length != 0 ||
                      columns.filter((column) => column.cfg.is_uploading).length != 0
                    "
                  >
                    {{ $t('public.form.submit') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
    <button
      id="showResultModalBtn"
      type="button"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#resultModal"
    ></button>
    <div class="modal fade" id="resultModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <p class="ck ck-content" v-html="pub.message"></p>
            <button
              v-if="pub.tags?.includes('allowContinuousSubmission')"
              class="btn btn-sm btn-primary float-end"
              data-bs-dismiss="modal"
            >
              {{ $t('public.form.result.submitAgain') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';

import {
  replaceVariables,
  getDataByFormula,
  getRulesByFormula,
  getChanges,
  hashData,
} from '@utils';
import dayjs from '@utils/dayjs';
import { socket } from '@utils/socket';

import InputText from '@components/Column/Input/Text/index.vue';
import InputNumber from '@components/Column/Input/Number/index.vue';
import InputMaska from '@components/Column/Input/Maska/index.vue';
import InputTextarea from '@components/Column/Input/Textarea/index.vue';
import InputRichtext from '@components/Column/Input/Richtext/index.vue';
import InputCode from '@components/Column/Input/Code/index.vue';

import SelectSingle from '@components/Column/Select/Single/index.vue';
import SelectMultiple from '@components/Column/Select/Multiple/index.vue';
import SelectTags from '@components/Column/Select/Tags/index.vue';
import SelectDatetime from '@components/Column/Select/Datetime/index.vue';
import SelectPosition from '@components/Column/Select/Position/index.vue';
import SelectFile from '@components/Column/Select/File/index.vue';
import SelectSwitch from '@components/Column/Select/Switch/index.vue';

import LayoutButton from '@components/Column/Layout/Button/index.vue';
import LayoutTitle from '@components/Column/Layout/Title/index.vue';
import LayoutSeparator from '@components/Column/Layout/Separator/index.vue';
import LayoutTab from '@components/Column/Layout/Tab/index.vue';

import { createData } from '@api/data';
import { getPubForm } from '@api/pub';

// eslint-disable-next-line
defineOptions({
  components: {
    InputText,
    InputNumber,
    InputMaska,
    InputTextarea,
    InputRichtext,
    InputCode,

    SelectSingle,
    SelectMultiple,
    SelectTags,
    SelectDatetime,
    SelectPosition,
    SelectFile,
    SelectSwitch,

    LayoutButton,
    LayoutTitle,
    LayoutSeparator,
    LayoutTab,
  },
});

const route = useRoute();
const toast = useToast();

const pub = ref({});
const form = ref({});
const columns = ref([]);
const ribbon_mode = ref(false);
const tabs = ref([]);
const current_tab = ref(0);
const alias = ref({});
const data = ref({ id: 0 });

const formData = computed(() => {
  return JSON.parse(JSON.stringify(data.value));
});

let initialized = false;

const { BASE_URL } = process.env;
const fetchPubForm = async (uuid) => {
  const { code, data: res, msg } = await getPubForm({ uuid });
  if (code === 200) {
    initialized = false;
    sessionStorage.setItem(`${BASE_URL.replace(/\//g, '_')}pubtk`, res.token);
    sessionStorage.setItem(`${BASE_URL.replace(/\//g, '_')}pubun`, res.username);
    socket.emit('login', { username: res.username });
    pub.value = res.pub;
    document.title = pub.value.title;

    form.value = res.form;
    columns.value = res.columns;
    alias.value = res.alias;
    data.value = res.data;

    setFormConfiguration();
    await setFormColumns();

    current_tab.value = current_tab.value || 0;
    initialized = true;
  } else {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: msg,
      },
    });
  }
};

watch(
  () => route.params.uuid,
  (newVal, oldVal) => {
    if (route.name === 'pubForm' && newVal !== oldVal) {
      fetchPubForm(newVal);
    }
  },
  { immediate: true },
);

watch(
  () => formData.value,
  (newVal = {}, oldVal = {}) => {
    if (initialized) {
      const changes = getChanges(newVal, oldVal);
      for (let field in changes) {
        columns.value
          .filter(
            (column) =>
              column.visible?.includes(`data.${field}`) ||
              column.required?.includes(`data.${field}`) ||
              column.editable?.includes(`data.${field}`) ||
              column.__default?.includes(`data.${field}`) ||
              column.cfg?.__source?.includes(`data.${field}`) ||
              column.cfg?.prefix?.includes(`data.${field}`) ||
              column.cfg?.href?.includes(`data.${field}`) ||
              (typeof column.cfg?.min === 'string' && column.cfg?.min?.includes(`data.${field}`)) ||
              (typeof column.cfg?.max === 'string' && column.cfg?.max?.includes(`data.${field}`)),
          )
          .map(async (column) => {
            if (
              column.visible?.includes(`data.${field}`) ||
              column.required?.includes(`data.${field}`) ||
              column.editable?.includes(`data.${field}`)
            ) {
              await setColumnRules(column);
            }
            if (column._visible) {
              await setColumnConfiguration(column);
            }
          });
      }
    }
  },
  { immediate: true, deep: true },
);

const handleRefetchPubForm = () => {
  fetchPubForm(route.params.uuid);
};

const handleToggleRibbonMode = () => {
  ribbon_mode.value = !ribbon_mode.value;
};

const setFormConfiguration = () => {
  if (form.value.script) form.value.script = replaceVariables(form.value.script, alias.value);
  if (form.value.style) {
    const style = document.createElement('style');
    style.innerHTML = form.value.style;
    document.querySelector('head').appendChild(style);
  }
};

const setFormColumns = async () => {
  const BasicColumns = columns.value.filter((column) => column.component.includes('Basic'));
  const FormColumns = columns.value.filter((column) => !column.component.includes('Basic'));
  const HasTabs = FormColumns.find((column) => column.component === 'LayoutTab') ? true : false;

  if (Number(data.value.id) === 0) {
    BasicColumns.forEach((column) => {
      if (column.field === 'acl_view' && form.value.acl_view.length)
        data.value.acl_view = Array.from(
          new Set([...form.value.acl_view, ...(data.value.acl_view || [])]),
        );
      if (column.field === 'acl_edit' && form.value.acl_edit.length)
        data.value.acl_edit = Array.from(
          new Set([...form.value.acl_edit, ...(data.value.acl_edit || [])]),
        );
    });

    // for (let column of BasicColumns) {
    //   if (column.field === 'acl_view' && form.value.acl_view.length)
    //     data.value.acl_view = Array.from(
    //       new Set([...form.value.acl_view, ...(data.value.acl_view || [])]),
    //     );
    //   if (column.field === 'acl_edit' && form.value.acl_edit.length)
    //     data.value.acl_edit = Array.from(
    //       new Set([...form.value.acl_edit, ...(data.value.acl_edit || [])]),
    //     );
    // }
  }

  tabs.value = [];

  if (HasTabs)
    FormColumns.forEach((column) => {
      if (column.component === 'LayoutTab')
        tabs.value.push({ ...column, ...{ children: [], columns: [] } });
      else tabs.value[tabs.value.length - 1].children.push(column);
    });
  else
    tabs.value.push({
      children: FormColumns,
      columns: [],
    });

  tabs.value.forEach((tab) => {
    tab.children.forEach(async (column) => {
      column._visible = true;
      column._required = false;
      column._editable = true;
      column.key = hashData(JSON.stringify(column));
      replaceColumnVariables(column);
      await setColumnRules(column);
      await setColumnConfiguration(column);
    });
    tab.columns = tab.children;
  });
};

const replaceColumnVariables = (column) => {
  if (column.visible) column.visible = replaceVariables(column.visible, alias.value);
  if (column.required) column.required = replaceVariables(column.required, alias.value);
  if (column.editable) column.editable = replaceVariables(column.editable, alias.value);
  if (column.default) column.__default = replaceVariables(column.default, alias.value);
  if (column.cfg?.source) column.cfg.__source = replaceVariables(column.cfg.source, alias.value);
  if (column.cfg?.prefix) column.cfg.prefix = replaceVariables(column.cfg.prefix, alias.value);
  if (column.cfg?.href) column.cfg.href = replaceVariables(column.cfg.href, alias.value);
  if (typeof column.cfg?.min === 'string')
    column.cfg.min = replaceVariables(column.cfg.min, alias.value);
  if (typeof column.cfg?.max === 'string')
    column.cfg.max = replaceVariables(column.cfg.max, alias.value);
};

const setColumnConfiguration = async (column) => {
  if (Number(data.value.id) === 0 || initialized) {
    if (column.default && (!initialized || column.__default?.includes('data.'))) {
      const val = await getDataByFormula(data.value, column.__default);
      const res =
        column.component === 'SelectTags'
          ? val.split(',')
          : column.component === 'SelectDatetime'
          ? dayjs(
              column.cfg.dateFormat.includes('Y-m-d')
                ? val
                : `${dayjs().format('YYYY-MM-DD')} ${val}`,
            ).format(
              column.cfg.dateFormat
                .replace('Y', 'YYYY')
                .replace('m', 'MM')
                .replace('d', 'DD')
                .replace('H', 'HH')
                .replace('i', 'mm')
                .replace('S', 'ss'),
            )
          : val;

      if (
        res &&
        typeof res === 'string' &&
        (res.includes('Error: ') ||
          (column.component === 'SelectDatetime' && res === 'Invalid date'))
      )
        column.cfg.placeholder = res;
      else data.value[column.field] = res;
    }

    if (column.alias && route.query[column.alias])
      data.value[column.field] = route.query[column.alias];
  }

  if (column.cfg?.source) {
    column.cfg.search = [];
    column.cfg.options = await getDataByFormula(data.value, column.cfg.__source, {
      value: !initialized ? data.value[column.field] : null,
    });

    column.cfg.selected = [];
    if (column.cfg.options.length) {
      data.value[column.field] =
        column.component == 'SelectMultiple'
          ? column.cfg.options
              .filter((option) =>
                data.value[column.field]
                  ?.map((value) => {
                    return isNaN(Number(value)) ? value : Number(value);
                  })
                  ?.includes(option.value),
              )
              .map((option) => {
                return option.value;
              })
          : column.cfg.options.find((option) => option.value == data.value[column.field])?.value ||
            null;
    } else {
      data.value[column.field] = column.component == 'SelectMultiple' ? [] : null;
    }
  }

  if (column.cfg?.prefix)
    column.cfg.__prefix = await getDataByFormula(data.value, column.cfg.prefix);
  if (column.cfg?.href) column.cfg.__href = await getDataByFormula(data.value, column.cfg.href);

  if (typeof column.cfg?.min === 'string') {
    const minDate = await getDataByFormula(data.value, column.cfg.min);
    if (isNaN(minDate) && !isNaN(Date.parse(minDate))) {
      column.cfg.minDate = minDate;
      column.key = hashData(JSON.stringify(column));
    }
  }
  if (typeof column.cfg?.max === 'string') {
    const maxDate = await getDataByFormula(data.value, column.cfg.max);
    if (isNaN(maxDate) && !isNaN(Date.parse(maxDate))) {
      column.cfg.maxDate = maxDate;
      column.key = hashData(JSON.stringify(column));
    }
  }
};

const setColumnRules = async (column, setColumnCfg = false) => {
  const { visible, required, editable } = getRulesByFormula(data.value, column);
  if (column._visible != visible || column._required != required || column._editable != editable)
    column.key = hashData(JSON.stringify(column));

  // column._visible = visible;
  column._required = required;
  column._editable = editable;

  if (column._visible != visible || setColumnCfg) {
    column._visible = visible;
    if (column._visible) await setColumnConfiguration(column);
    else
      data.value[column.field] = ['SelectMultiple', 'SelectTags', 'SelectFile'].includes(
        column.component,
      )
        ? []
        : null;
  }
};

const handleSelecterSearch = async ({ search, loading, column }) => {
  loading(true);
  column.cfg.search = await getDataByFormula(data.value, column.cfg.__source, { search });
  loading(false);
};

const handleSubmitFormData = () => {
  const formdata = JSON.parse(JSON.stringify(data.value));
  formdata.tid = form.value.id;
  formdata.id = 0;
  columns.value.forEach((column) => {
    if (!column.component.includes('Basic') && !column._visible) delete formdata[column.field];
  });

  if (form.value.script) {
    let formScriptResult = null;
    try {
      const fn = new Function('data', form.value.script);
      formScriptResult = fn(formdata);
    } catch (error) {
      formScriptResult = error.message;
    }
    if (formScriptResult) {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: formScriptResult,
        },
      });
      return;
    }
  }

  createData(formdata).then((res) => {
    if (res.code === 200) {
      data.value = res.data;
      document.getElementById('showResultModalBtn').click();
    } else {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: res.msg,
        },
      });
    }
  });
};
</script>
