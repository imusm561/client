<template>
  <div>
    <Breadcrumb :key="$route" :formInfo="formInfo" />
    <div class="card">
      <div v-if="form.id" class="card-body d-flex flex-column pt-0" style="height: fit-content">
        <div class="mt-2 mb-2">
          <div v-if="form.description" class="ck ck-content p-0" v-html="form.description" />
          <div class="d-flex justify-content-end gap-2">
            <div v-if="!form.html" class="quick-filter">
              <span
                class="mdi mdi-filter-outline text-muted cursor-pointer"
                :class="{ 'mdi-filter-plus ': quickFilter.includeHiddenColumns }"
                @click="handleChangeQuickFilterMode"
              ></span>
              <input
                type="text"
                class="form-control form-control-sm w-auto text-truncate"
                :class="{ 'border-danger': quickFilter.includeHiddenColumns }"
                :placeholder="$t('data.list.data.quickFilter')"
                :disabled="!ready.getRows"
                v-model.trim="quickFilter.quickFilterText"
                @input="handleInputQuickFilterText"
              />
            </div>
            <div
              v-if="
                $store.state.user.data?.permissions?.[$route.params.tid]?.batch &&
                selectedRows.length &&
                (!form.flow || form.flow?.length === 0)
              "
            >
              <button type="button" class="btn btn-sm btn-warning" data-bs-toggle="dropdown">
                {{ $tc('data.list.header.batchUpdate', { count: selectedRows.length }) }}
              </button>
              <div class="dropdown-menu">
                <span
                  class="dropdown-item cursor-pointer"
                  @click="
                    batch.column = columns.find((column) => column.component === 'BasicDataState');
                    batch.value = null;
                    batch.syntax_error = null;
                  "
                  data-bs-toggle="modal"
                  data-bs-target="#batchUpdateModal"
                >
                  {{ $t('data.column.BasicDataState') }}
                </span>
                <span
                  class="dropdown-item cursor-pointer"
                  @click="
                    batch.column = columns.find((column) => column.component === 'BasicAclView');
                    batch.value = null;
                    batch.syntax_error = null;
                  "
                  data-bs-toggle="modal"
                  data-bs-target="#batchUpdateModal"
                >
                  {{ $t('data.column.BasicAclView') }}
                </span>
                <span
                  class="dropdown-item cursor-pointer"
                  @click="
                    batch.column = columns.find((column) => column.component === 'BasicAclEdit');
                    batch.value = null;
                    batch.syntax_error = null;
                  "
                  data-bs-toggle="modal"
                  data-bs-target="#batchUpdateModal"
                >
                  {{ $t('data.column.BasicAclEdit') }}
                </span>
                <div v-if="batch.columns.length" class="dropdown-divider"></div>
                <span
                  class="dropdown-item cursor-pointer"
                  @click="
                    batch.column = column;
                    batch.value = null;
                    batch.syntax_error = null;
                  "
                  data-bs-toggle="modal"
                  data-bs-target="#batchUpdateModal"
                  v-for="(column, index) in batch.columns"
                  :key="index"
                >
                  {{ column.name }}
                </span>
                <div v-if="form.batchActions.length" class="dropdown-divider"></div>
                <span
                  class="dropdown-item cursor-pointer"
                  v-for="(item, index) in form.batchActions"
                  :key="index"
                  @click="handleSubmitBatchUpdate(item.action)"
                >
                  {{ item.title }}
                </span>
                <div class="dropdown-divider"></div>
                <span class="dropdown-item cursor-pointer" @click="handleDeselectAllRows">
                  {{ $tc('data.list.header.deselect', { count: selectedRows.length }) }}
                </span>
              </div>
            </div>
            <button
              v-if="$store.state.user.data?.permissions?.[$route.params.tid]?.create"
              type="button"
              class="btn btn-sm btn-primary"
              @click="$router.push({ name: 'edit', params: { tid: $route.params.tid, rid: 0 } })"
            >
              <!-- <i class="mdi mdi-plus"></i> -->
              {{ $t('data.list.data.create') }}
            </button>
          </div>
        </div>
        <div v-if="form.html" class="d-flex flex-column">
          <iframe :id="`iframe_${form.id}`" class="iframe-height"></iframe>
          <Pagination
            class="p-2 pb-0"
            :total="pagination.totalCount"
            :page-num="pagination.pageNum"
            :page-size="pagination.pageSize"
            @changed="handlePaginationChange"
          />
        </div>
        <AgGridVue
          v-else
          :key="$route.params.tid"
          class="ag-height"
          :class="
            $store.state.sys.theme === 'dark'
              ? `ag-theme-${theme.data}-dark`
              : `ag-theme-${theme.data}`
          "
          :columnDefs="columnDefs"
          multiSortKey="ctrl"
          :animateRows="true"
          rowModelType="serverSide"
          :localeText="localeText"
          :serverSideDatasource="serverSideDatasource"
          :serverSideSortAllLevels="true"
          rowGroupPanelShow="always"
          :getContextMenuItems="getContextMenuItems"
          rowSelection="multiple"
          :getRowClass="getRowClass"
          :getRowId="getRowId"
          :enableRangeSelection="true"
          :suppressRowClickSelection="true"
          :isRowSelectable="isRowSelectable"
          @selectionChanged="onSelectionChanged"
          :enableCharts="true"
          :sideBar="sideBar"
          :pagination="true"
          :paginateChildRows="true"
          :paginationPageSizeSelector="[100, 200, 500, 1000, 2000, 3000, 5000, 10000]"
          :paginationPageSize="pagination.pageSize"
          :cacheBlockSize="pagination.pageSize"
          :serverSideInfiniteScroll="true"
          :statusBar="statusBar"
          :defaultColDef="defaultColDef"
          @grid-ready="onGridReady"
          :overlayLoadingTemplate="overlayLoadingTemplate"
          @columnVisible="handleColumnChanged"
          @columnPinned="handleColumnChanged"
          @columnResized="handleColumnChanged"
          @columnMoved="handleColumnChanged"
          @sortChanged="handleColumnChanged"
          @columnRowGroupChanged="handleColumnChanged"
          @paginationChanged="handlePaginationChanged"
        ></AgGridVue>
      </div>

      <input
        id="data-list-file-input"
        class="d-none"
        type="file"
        @click="
          (e) => {
            e.target.value = '';
          }
        "
        @change="handleFileInput"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />

      <div
        class="modal fade"
        id="batchUpdateModal"
        data-bs-focus="false"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content" v-if="batch.column">
            <div class="modal-header p-2 bg-light">
              <h5 class="modal-title text-truncate">
                {{ $t('data.list.batchUpdateModal.title') }}
                {{
                  selectedRows
                    .map((row) => {
                      return row.id;
                    })
                    .toString()
                }}
              </h5>
              <button
                type="button"
                class="btn-close"
                id="hideBatchUpdateModalModalBtn"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div class="modal-body p-3">
              <Form v-slot="{ errors }" @submit="handleSubmitBatchUpdate()">
                <component
                  :is="batch.column.component"
                  type="EDIT"
                  :column="batch.column"
                  v-model="batch.value"
                  :required="batch.column._required"
                  :error="errors[batch.column.field]"
                  @search="handleSelecterSearch"
                  @selected="($event) => (batch.column.cfg.selected = $event)"
                  @syntaxError="
                    ($event) => {
                      batch.syntax_error = $event;
                    }
                  "
                  @refresh="setColumnConfiguration($event)"
                ></component>
                <button
                  type="submit"
                  class="btn btn-sm btn-success mt-3 float-end"
                  :disabled="Object.keys(errors).length || batch.syntax_error"
                >
                  <i class="mdi mdi-content-save-outline" />
                  {{ $t('data.list.batchUpdateModal.footer.update') }}
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref, reactive, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { nanoid } from 'nanoid';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import { AG_GRID_LOCALE_EN_US } from '@utils/i18n/ag-gird/en-us.js';
import { AG_GRID_LOCALE_ZH_CN } from '@utils/i18n/ag-gird/zh-cn.js';

import {
  replaceHtml,
  getUserInfo,
  copyToClipboard,
  replaceVariables,
  getRulesByFormula,
  getDataByFormula,
  generateFlowByCurrentUser,
  debounce,
} from '@utils';
import i18n from '@utils/i18n';
import dayjs from '@utils/dayjs';
import { socket } from '@utils/socket';

import Breadcrumb from '@layouts/breadcrumb';
import Pagination from '@components/Pagination';

import CustomizationToolPanle from './panels/CustomizationToolPanle.vue';
import IdRenderer from './renderers/IdRenderer.vue';
import DataStateRenderer from './renderers/DataStateRenderer.vue';
import UserRenderer from './renderers/UserRenderer.vue';
import ColorRenderer from './renderers/ColorRenderer.vue';
import DateTimeRenderer from './renderers/DateTimeRenderer.vue';
import UuidRenderer from './renderers/UuidRenderer.vue';
import SelectRenderer from './renderers/SelectRenderer.vue';
import SwitchRenderer from './renderers/SwitchRenderer.vue';
import PositionRenderer from './renderers/PositionRenderer.vue';
import FileRenderer from './renderers/FileRenderer.vue';
import DateTimeFilter from './filters/DateTimeFilter.vue';
import DataStateFilter from './filters/DataStateFilter.vue';
import UserFilter from './filters/UserFilter.vue';
import SwitchFilter from './filters/SwitchFilter.vue';
import SelectFilter from './filters/SelectFilter.vue';
import BasicDataStateEditor from './editors/BasicDataStateEditor';
import BasicAclViewEditor from './editors/BasicAclViewEditor';
import BasicAclEditEditor from './editors/BasicAclEditEditor';
import InputTextEditor from './editors/InputTextEditor';
import InputNumberEditor from './editors/InputNumberEditor';
import InputMaskaEditor from './editors/InputMaskaEditor';
import InputTextareaEditor from './editors/InputTextareaEditor';
import SelectSingleEditor from './editors/SelectSingleEditor';
import SelectMultipleEditor from './editors/SelectMultipleEditor';
import SelectTagsEditor from './editors/SelectTagsEditor';
import SelectDatetimeEditor from './editors/SelectDatetimeEditor';
import SelectPositionEditor from './editors/SelectPositionEditor';
import SelectSwitchEditor from './editors/SelectSwitchEditor';

import BasicDataState from '@components/Column/Basic/DataState/index.vue';
import BasicAclView from '@components/Column/Basic/AclView/index.vue';
import BasicAclEdit from '@components/Column/Basic/AclEdit/index.vue';

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
import store from '@store';

import {
  getDataForm,
  getDataList,
  getDataSets,
  getDataTemplate,
  importData,
  checkData,
  updateData,
} from '@api/data';
import {
  getCustomTheme,
  createCustomTheme,
  updateCustomTheme,
  getCustomColumn,
  createCustomColumn,
  updateCustomColumn,
  getCustomPagination,
  createCustomPagination,
  updateCustomPagination,
} from '@api/custom';

if (store.state.sys.cfg?.agGridLicense)
  LicenseManager.setLicenseKey(store.state.sys.cfg.agGridLicense);

// eslint-disable-next-line
defineOptions({
  components: {
    CustomizationToolPanle,
    agDateInput: DateTimeFilter,
    BasicDataStateEditor,
    BasicAclViewEditor,
    BasicAclEditEditor,
    InputTextEditor,
    InputNumberEditor,
    InputMaskaEditor,
    InputTextareaEditor,
    SelectSingleEditor,
    SelectMultipleEditor,
    SelectTagsEditor,
    SelectDatetimeEditor,
    SelectPositionEditor,
    SelectSwitchEditor,
    BasicDataState,
    BasicAclView,
    BasicAclEdit,
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
  },
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const form = ref({});
const alias = ref({});
const columns = ref([]);
const theme = ref({
  data: 'alpine',
});
const customs = ref(null);

const localeText = ref(
  store.state.sys.lang === 'zh-cn' ? AG_GRID_LOCALE_ZH_CN : AG_GRID_LOCALE_EN_US,
);

const pagination = ref({
  pageSize: 500,
});

const defaultColDef = ref({
  resizable: true,
  sortable: true,
  // menuTabs: [],
});
const columnDefs = ref([]);

const sideBar = {
  toolPanels: [
    {
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
      toolPanelParams: {
        suppressPivots: true,
        suppressPivotMode: true,
      },
      minWidth: 200,
      maxWidth: 300,
      width: 250,
    },
    {
      id: 'filters',
      labelDefault: 'Filters',
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel',
      minWidth: 200,
      maxWidth: 300,
      width: 250,
    },
    {
      id: 'customization',
      labelDefault: i18n.global.t('data.list.sideBar.toolPanels.customization'),
      labelKey: 'customization',
      iconKey: 'menu',
      toolPanel: 'CustomizationToolPanle',
      // toolPanelParams: {
      //   context: {
      //     tid: Number(route.params.tid),
      //   },
      // },
      minWidth: 200,
      maxWidth: 300,
      width: 250,
    },
  ],
};

const statusBar = ref({
  statusPanels: [
    { statusPanel: 'agSelectedRowCountComponent' },
    { statusPanel: 'agAggregationComponent' },
  ],
});

const ready = reactive({
  setCustom: false,
  getRows: false,
});

const refetchDataListHandler = (res) => {
  if (res.tid == route.params.tid) handleRefetchDataList();
};

onMounted(() => {
  socket.on('refetchDataList', refetchDataListHandler);
});

onUnmounted(() => {
  socket.off('refetchDataList', refetchDataListHandler);
});

const formInfo = ref({});
const fetchDataForm = async (callback) => {
  const { code, data, msg } = await getDataForm({ tid: Number(route.params.tid) });
  if (code === 200) {
    formInfo.value = data;
    form.value = data.form;
    alias.value = data.alias;
    columns.value = data.columns.filter((column) => !column.tags.includes('hideInDataList'));
    if (form.value.html) {
      nextTick(() => {
        const iframe = document.getElementById(`iframe_${form.value.id}`);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(form.value.html);
        iframe.contentWindow.document.close();
        iframe.onload = () => {
          handlePaginationChange({
            pageNum: 1,
            pageSize: 100,
          });
        };
      });
    } else {
      const { data: _theme } = await getCustomTheme({ tid: Number(route.params.tid) });
      theme.value = _theme || { data: 'alpine' };
      const { data: _customs } = await getCustomColumn({ tid: Number(route.params.tid) });
      customs.value = _customs;
      const { data: _pagination } = await getCustomPagination({
        tid: Number(route.params.tid),
      });
      pagination.value = _pagination
        ? { ..._pagination, ...{ pageSize: _pagination.data } }
        : { pageSize: 500 };
      setFormConfiguration();
      await setFormColumnDefs();
      const filter = {
        data_state: {
          filterType: 'set',
          values: ['published'], // 'drafted', 'approving'
        },
      };
      for (let key in route.query) {
        const column = columns.value.find((column) => column.alias === key || column.field === key);
        if (column) {
          if (
            ['InputTextarea', 'InputRichtext', 'InputCode', 'SelectPosition'].includes(
              column.component,
            )
          ) {
            filter[column.field] = {
              filterType: 'text',
              type: 'contains',
              filter: route.query[key],
            };
          } else if (
            [
              'BasicDataState',
              'BasicCreatedBy',
              'BasicUpdatedBy',
              'BasicAclView',
              'BasicAclEdit',
              'SelectSingle',
              'SelectMultiple',
              'SelectTags',
              'SelectSwitch',
              'SelectFile',
            ].includes(column.component)
          ) {
            filter[column.field] = {
              filterType: 'set',
              values: route.query[key].split(','),
            };
          } else if (['int', 'float', 'double', 'decimal'].includes(column.type)) {
            filter[column.field] = {
              filterType: 'number',
              type: route.query[key].includes(' to ') ? 'inRange' : 'equals',
              filter: route.query[key].split(' to ')[0],
              filterTo: route.query[key].split(' to ')[1],
            };
          } else if (['date', 'datetime'].includes(column.type)) {
            filter[column.field] = {
              filterType: 'date',
              type: route.query[key].includes(' to ') ? 'inRange' : 'equals',
              dateFrom: route.query[key].split(' to ')[0],
              dateTo: route.query[key].split(' to ')[1],
            };
          } else if (['time'].includes(column.type)) {
            filter[column.field] = {
              filterType: 'date',
              type: route.query[key].includes(' to ') ? 'inRange' : 'equals',
              dateFrom: dayjs().format('YYYY-MM-DD') + ' ' + route.query[key].split(' to ')[0],
              dateTo: dayjs().format('YYYY-MM-DD') + ' ' + route.query[key].split(' to ')[1],
            };
          } else {
            filter[column.field] = {
              filterType: 'text',
              type: 'equals',
              filter: route.query[key],
            };
          }
        }
      }
      gridApi.setFilterModel(filter);
      if (customs.value) {
        ready.setCustom = false;
        gridApi.moveColumns(
          customs.value.data.map((column) => column.colId),
          0,
        );
        setTimeout(() => {
          ready.setCustom = true;
        }, 1000);
      }
      callback && callback();
    }
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

const setFormConfiguration = () => {
  if (form.value.script) form.value.script = replaceVariables(form.value.script, alias.value);
  form.value.flow = form.value.flow?.length ? generateFlowByCurrentUser(form.value.flow) : null;
};

let gridApi = null;
const onGridReady = (params) => {
  gridApi = params.api;

  gridApi.getTheme = () => {
    return theme.value.data;
  };
  gridApi.setTheme = async (data) => {
    const tid = Number(route.params.tid);
    if (tid) {
      if (theme.value.id) {
        await updateCustomTheme({
          id: theme.value.id,
          tid,
          data,
        });
        theme.value.data = data;
      } else {
        const { data: _theme } = await createCustomTheme({
          tid,
          data,
        });
        theme.value = _theme;
      }
    }
    await setFormColumnDefs();
    ready.setCustom = false;
    if (customs.value) {
      gridApi.moveColumns(
        customs.value.data.map((column) => column.colId),
        0,
      );
    }
    setTimeout(() => {
      ready.setCustom = true;
    }, 1000);
    gridApi.refreshServerSide({ purge: true });
  };
};

let timer = null;
const handleColumnChanged = () => {
  if (!ready.setCustom) return;
  const tid = Number(route.params.tid);
  if (tid) {
    const data = gridApi.getColumnState();
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      if (customs.value) {
        await updateCustomColumn({
          id: customs.value.id,
          tid,
          data,
        });
        customs.value.data = data;
      } else {
        const { data: _customs } = await createCustomColumn({
          tid,
          data,
        });
        customs.value = _customs;
      }
    }, 500);
  }
};

const handlePaginationChanged = (params) => {
  const data = params.api.paginationGetPageSize();
  const tid = Number(route.params.tid);
  if (data && tid) {
    if (data != pagination.value.pageSize) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        if (pagination.value.id) {
          updateCustomPagination({
            id: pagination.value.id,
            tid,
            data,
          }).then(({ code, msg }) => {
            if (code === 200) {
              pagination.value.pageSize = data;
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
          });
        } else {
          createCustomPagination({
            tid,
            data,
          }).then(({ code, data, msg }) => {
            if (code === 200) {
              pagination.value = { ...data, ...{ pageSize: data.data } };
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
          });
        }
      }, 500);
    }
  }
};

const generateColumnDef = (column) => {
  const columnDef = {};
  const custom = customs.value
    ? customs.value.data.find((item) => item.colId === column.field) || null
    : null;

  // ============================================================================
  columnDef.field = column.field;
  columnDef.checkboxSelection = ['id'].includes(column.field)
    ? (params) => {
        return params.data.id;
      }
    : false;
  columnDef.valueFormatter = ['InputRichtext'].includes(column.component)
    ? (params) => {
        return replaceHtml(params.value);
      }
    : null;
  // ============================================================================

  // ============================================================================
  columnDef.hide = custom
    ? custom.hide
    : [
        'uuid',
        'data_state',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'acl_view',
        'acl_edit',
      ].includes(column.field);
  // ============================================================================

  // ============================================================================
  columnDef.editable = false;
  // columnDef.cellEditor = null;
  // columnDef.cellEditorParams = null;
  // columnDef.cellEditorPopup = false;
  // columnDef.cellEditorPopupPosition = 'over'; // over | under
  // ============================================================================

  // ============================================================================
  columnDef.onCellValueChanged = (params) => {
    if (form.value.script) {
      let formScriptResult = null;
      try {
        const fn = new Function('data', form.value.script);
        formScriptResult = fn(params.data);
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
        params.data[params.colDef.field] = params.oldValue;
        params.api.applyTransaction({ update: [params.data] });
        params.api.refreshCells();
        return;
      }
    }

    checkData({ tid: Number(route.params.tid), rid: params.data.id }).then(
      ({ code, data: editing, msg }) => {
        if (code === 200) {
          if (editing === null || editing === store.state.user.data.username) {
            updateData({
              tid: Number(route.params.tid),
              id: params.data.id,
              [params.column.colId]: params.newValue,
              flow: form.value.flow,
            }).then((res) => {
              if (res.code != 200) {
                params.data[params.colDef.field] = params.oldValue;
                params.api.applyTransaction({ update: [params.data] });
                params.api.refreshCells();
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
          } else {
            params.data[params.colDef.field] = params.oldValue;
            params.api.applyTransaction({ update: [params.data] });
            params.api.refreshCells();
            toast({
              component: ToastificationContent,
              props: {
                variant: 'danger',
                icon: 'mdi-alert',
                text: i18n.global.t('data.list.cellEdit.conflicts', {
                  user: getUserInfo(editing).fullname,
                }),
              },
            });
          }
        } else {
          params.data[params.colDef.field] = params.oldValue;
          params.api.applyTransaction({ update: [params.data] });
          params.api.refreshCells();
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: msg,
            },
          });
        }
      },
    );
  };
  // columnDef.onCellClicked = (params) => {
  //   console.log('onCellClicked', params);
  // };

  columnDef.onCellDoubleClicked = async (params) => {
    if (
      !form.value.flow?.length &&
      params.data.data_state != 'approving' &&
      !params.api
        .getEditingCells()
        .find(
          (cell) =>
            cell.rowIndex === params.rowIndex && cell.column.colId === params.column.getId(),
        ) &&
      (column?.tags?.includes('cellEdit') ||
        ['BasicDataState', 'BasicAclView', 'BasicAclEdit'].includes(column.component)) &&
      store.state.user.data?.permissions?.[route.params.tid]?.edit &&
      (params.data.created_by === store.state.user.data.username ||
        params.data.updated_by === store.state.user.data.username ||
        params.data.acl_edit.includes(store.state.user.data.username) ||
        (params.data.acl_edit.length === 0 &&
          params.data.acl_view.includes(store.state.user.data.username)) ||
        (params.data.acl_view.length === 0 && params.data.acl_edit.length === 0))
    ) {
      if (['InputRichtext', 'InputCode', 'SelectFile'].includes(column.component)) {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: 'data.list.cellEdit.error',
          },
        });
        return;
      }
      const _column = JSON.parse(JSON.stringify(column));
      const { visible, required, editable } = getRulesByFormula(params.data, _column);
      _column._visible = visible;
      _column._required = required;
      _column._editable = editable;

      if (_column._editable) {
        if (_column.cfg?.__source) {
          _column.cfg.options = await getDataByFormula(params.data, _column.cfg.__source, {
            value: params.data[_column.field],
          });
        }

        params.colDef.editable = true;
        params.colDef.cellEditor = ['InputTextarea'].includes(column.component)
          ? 'agLargeTextCellEditor'
          : `${column.component}Editor`;
        params.colDef.cellEditorPopup = [
          'BasicDataState',
          'BasicAclView',
          'BasicAclEdit',
          'InputTextarea',
          'SelectSingle',
          'SelectMultiple',
          'SelectTags',
        ].includes(column.component);

        params.colDef.cellEditorParams = {
          _form: form.value,
          _alias: alias.value,
          _column: _column,
        };
        params.api.startEditingCell({
          rowIndex: params.rowIndex,
          colKey: params.column.getId(),
        });
        params.colDef.editable = false;
      }
    }
  };
  // columnDef.onCellContextMenu = (params) => {
  //   console.log('onCellContextMenu', params);
  // };
  // ============================================================================

  // ============================================================================
  columnDef.filter = 'agTextColumnFilter';

  if (['data_state'].includes(column.field)) {
    columnDef.filter = 'agSetColumnFilter';
    columnDef.filterParams = {
      values: ['published', 'deleted', 'drafted', 'archived', 'approving'],
      cellRenderer: DataStateFilter,
    };
  }
  if (['created_by', 'updated_by', 'acl_view', 'acl_edit'].includes(column.field)) {
    columnDef.filter = 'agSetColumnFilter';
    columnDef.filterParams = {
      values: async (params) => {
        const { data } = await getDataSets({
          tid: Number(route.params.tid),
          field: column.field,
        });
        params.success(
          Array.from(
            new Set(
              data
                .map((item) => {
                  return Array.isArray(item[column.field]) && item[column.field].length === 0
                    ? null
                    : item[column.field];
                })
                .flat(),
            ),
          ),
        );
      },
      cellRenderer: UserFilter,
    };
  }

  if (['int', 'float', 'double', 'decimal'].includes(column.type)) {
    columnDef.filter = 'agNumberColumnFilter';
  }

  if (['datetime', 'date', 'time'].includes(column.type)) {
    columnDef.filter = 'agDateColumnFilter';
    columnDef.filterParams = {
      _form: form.value,
      _alias: alias.value,
      _column: column,
    };
  }

  if (['SelectSingle', 'SelectMultiple', 'SelectTags'].includes(column.component)) {
    columnDef.filter = 'agSetColumnFilter';
    columnDef.filterParams = {
      values: async (params) => {
        if (
          ['SelectSingle', 'SelectMultiple'].includes(column.component) &&
          column.cfg.options.length &&
          !column.cfg.__source
        ) {
          params.success(column.cfg.options);
        } else {
          const { data } = await getDataSets({
            tid: Number(route.params.tid),
            field: column.field,
          });
          params.success(
            Array.from(
              new Set(
                data
                  .map((item) => {
                    return Array.isArray(item[column.field]) && item[column.field].length === 0
                      ? null
                      : item[column.field];
                  })
                  .flat(),
              ),
            ),
          );
        }
      },
      cellRenderer: SelectFilter,
    };
  }

  if (['SelectSwitch'].includes(column.component)) {
    columnDef.filter = 'agSetColumnFilter';
    columnDef.filterParams = {
      values: [0, 1],
      cellRenderer: SwitchFilter,
    };
  }

  if (['SelectFile'].includes(column.component)) {
    columnDef.filter = 'agSetColumnFilter';
    columnDef.filterParams = {
      values: async (params) => {
        const { data } = await getDataSets({
          tid: Number(route.params.tid),
          field: column.field,
        });
        params.success(
          Array.from(
            new Set(
              data
                .map((item) => {
                  return Array.isArray(item[column.field]) && item[column.field].length === 0
                    ? null
                    : item[column.field].map((file) => {
                        return file.name;
                      });
                })
                .flat(),
            ),
          ),
        );
      },
    };
  }

  if (columnDef?.filterParams?.cellRenderer) {
    columnDef.filterParams.cellRendererParams = {
      _form: form.value,
      _alias: alias.value,
      _column: column,
    };
  }

  columnDef.floatingFilter = false;
  // ============================================================================

  // ============================================================================
  columnDef.headerName = column.name;
  if (
    [
      'BasicId',
      'BasicUuid',
      'BasicDataState',
      'BasicCreatedAt',
      'BasicCreatedBy',
      'BasicUpdatedAt',
      'BasicUpdatedBy',
      'BasicAclView',
      'BasicAclEdit',
    ].includes(column.component)
  )
    columnDef.headerName = i18n.global.t(`data.column.${column.component}`);
  // columnDef.headerTooltip = column.name;
  // columnDef.headerClass = 'text-primary';
  columnDef.menuTabs = ['generalMenuTab', 'filterMenuTab']; // 'columnsMenuTab'
  // ============================================================================

  // ============================================================================
  columnDef.pinned = custom ? custom.pinned : null;
  // ============================================================================

  // ============================================================================
  // columnDef.cellStyle = {color: 'red'};
  // columnDef.cellClass = 'fs-12';

  if (['id'].includes(column.field)) {
    columnDef.cellRenderer = IdRenderer;
  }
  if (['uuid'].includes(column.field)) {
    columnDef.cellRenderer = UuidRenderer;
  }

  if (['data_state'].includes(column.field)) {
    columnDef.cellRenderer = DataStateRenderer;
  }

  if (['created_by', 'updated_by', 'acl_view', 'acl_edit'].includes(column.field)) {
    columnDef.cellRenderer = UserRenderer;
  }

  if (['datetime', 'date', 'time'].includes(column.type)) {
    columnDef.cellRenderer = DateTimeRenderer;
  }

  if (['color'].includes(column.cfg.type)) {
    columnDef.cellRenderer = ColorRenderer;
  }

  if (['SelectSingle', 'SelectMultiple', 'SelectTags'].includes(column.component)) {
    columnDef.cellRenderer = SelectRenderer;
  }

  if (['SelectFile'].includes(column.component)) {
    columnDef.cellRenderer = FileRenderer;
  }

  if (['SelectSwitch'].includes(column.component)) {
    columnDef.cellRenderer = SwitchRenderer;
  }

  if (['SelectPosition'].includes(column.component)) {
    columnDef.cellRenderer = PositionRenderer;
  }

  if (columnDef.cellRenderer) {
    columnDef.cellRendererParams = {
      _form: form.value,
      _alias: alias.value,
      _column: column,
    };
  }
  // ============================================================================

  // ============================================================================
  columnDef.rowGroup = custom ? custom.rowGroup : false;
  columnDef.rowGroupIndex = custom ? custom.rowGroupIndex : null;
  columnDef.enableRowGroup = true;
  columnDef.enableValue = true;
  columnDef.aggFunc = custom ? custom.aggFunc : null;
  columnDef.allowedAggFuncs = ['avg', 'count', 'max', 'min', 'sum'];

  // ============================================================================

  // ============================================================================
  columnDef.sortable = true;
  columnDef.sort = custom
    ? custom.sort
    : ['id', 'updated_at'].includes(column.field)
    ? 'desc'
    : null;
  columnDef.sortIndex = custom
    ? custom.sortIndex
    : ['updated_at'].includes(column.field)
    ? 1
    : ['id'].includes(column.field)
    ? 2
    : null;
  // columnDef.unSortIcon = true

  // ============================================================================
  // ============================================================================

  columnDef.width = custom
    ? custom.width
    : ['id'].includes(column.field)
    ? 120
    : ['uuid'].includes(column.field)
    ? 350
    : ['data_state'].includes(column.field)
    ? 150
    : ['created_by', 'created_at', 'updated_by', 'updated_at', 'acl_view', 'acl_edit'].includes(
        column.field,
      )
    ? 200
    : 220;
  columnDef.minWidth = 100;
  columnDef.maxWidth = ['id'].includes(column.field)
    ? 200
    : ['uuid'].includes(column.field)
    ? 400
    : ['data_state'].includes(column.field)
    ? 200
    : ['created_by', 'created_at', 'updated_by', 'updated_at', 'acl_view', 'acl_edit'].includes(
        column.field,
      )
    ? 250
    : 880;
  columnDef.resizable = true;
  columnDef.flex = custom ? custom.flex : null;
  // ============================================================================

  return columnDef;
};

const replaceColumnVariables = (column) => {
  if (column.visible) column.visible = replaceVariables(column.visible, alias.value);
  if (column.required) column.required = replaceVariables(column.required, alias.value);
  if (column.editable) column.editable = replaceVariables(column.editable, alias.value);
  if (column.default) column.__default = replaceVariables(column.default, alias.value);
  if (column.cfg?.source) column.cfg.__source = replaceVariables(column.cfg.source, alias.value);
  if (typeof column.cfg?.min === 'string')
    column.cfg.min = replaceVariables(column.cfg.min, alias.value);
  if (typeof column.cfg?.max === 'string')
    column.cfg.max = replaceVariables(column.cfg.max, alias.value);
};

const setColumnConfiguration = async (column) => {
  if (column.cfg?.source) {
    column.cfg.search = [];
    if (!column.cfg.__source?.includes('data.'))
      column.cfg.options = await getDataByFormula({}, column.cfg.__source, { value: null });
  }

  if (typeof column.cfg?.min === 'string' && !column.cfg.min.includes('data.')) {
    const minDate = await getDataByFormula({}, column.cfg.min);
    if (isNaN(minDate) && !isNaN(Date.parse(minDate))) column.cfg.minDate = minDate;
  }
  if (typeof column.cfg?.max === 'string' && !column.cfg.max.includes('data.')) {
    const maxDate = await getDataByFormula({}, column.cfg.max);
    if (isNaN(maxDate) && !isNaN(Date.parse(maxDate))) column.cfg.maxDate = maxDate;
  }
};

const setColumnRules = async (column) => {
  if (
    !column.visible?.includes('data.') &&
    !column.required?.includes('data.') &&
    !column.editable?.includes('data.')
  ) {
    const { visible, required, editable } = getRulesByFormula({}, column);
    // column._visible = visible;
    column._required = required;
    column._editable = editable;

    if (column._visible != visible) {
      column._visible = visible;
      if (column._visible) await setColumnConfiguration(column);
    }
  }
};

const handleSelecterSearch = async ({ search, loading, column }) => {
  loading(true);
  column.cfg.search = await getDataByFormula({}, column.cfg.__source, { search });
  loading(false);
};

const batch = reactive({
  columns: [],
  column: null,
  value: null,
  syntax_error: null,
});

const handleSubmitBatchUpdate = (action) => {
  const tid = Number(route.params.tid);
  const ids = selectedRows.value.map((row) => {
    return row.id;
  });
  checkData({ tid, ids }).then(({ code, data: editing, msg }) => {
    if (code === 200) {
      if (editing.length === 0) {
        updateData({
          tid,
          ids,
          ...(action ? { action } : { field: batch.column.field, value: batch.value }),
        }).then(({ code, msg }) => {
          if (code === 200) {
            if (action) {
              toast({
                component: ToastificationContent,
                props: {
                  variant: 'success',
                  icon: 'mdi-check-circle',
                  text: msg,
                },
              });
            } else document.getElementById('hideBatchUpdateModalModalBtn').click();
            handleDeselectAllRows();
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
        });
      } else {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: i18n.global.t('data.list.batchUpdate.conflicts', {
              count: editing.length,
              ids: editing.toString(),
            }),
          },
        });
      }
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
  });
};

const setFormColumnDefs = async () => {
  const hasTab = columns.value.some((column) => column.component === 'LayoutTab');
  const defs = hasTab
    ? [
        {
          headerName: i18n.global.t('data.column.Basic'),
          children: [],
          headerClass: 'text-primary mdi mdi-information-outline',
        },
      ]
    : [];

  batch.columns = [];
  batch.column = null;

  columns.value.forEach((column) => {
    replaceColumnVariables(column);
    setColumnConfiguration(column);
    setColumnRules(column);

    if (
      !column.component.includes('Basic') &&
      column.type &&
      column.tags?.includes('batchUpdate') &&
      !column.visible?.includes('data.') &&
      column._visible &&
      !column.required?.includes('data.') &&
      !column.editable?.includes('data.') &&
      column._editable &&
      !column.__default?.includes('data.') &&
      !column.cfg?.__source?.includes('data.')
    )
      batch.columns.push(JSON.parse(JSON.stringify(column)));

    if (column.component === 'LayoutTab') {
      defs.push({
        headerName: column.name,
        children: [],
        headerClass: `text-${column.cfg.style} mdi ${column.cfg.icon}`,
      });
    } else if (column.type) {
      if (hasTab) defs[defs.length - 1].children.push(generateColumnDef(column));
      else defs.push(generateColumnDef(column));
    }
  });

  columnDefs.value = defs;
};

const getRowClass = (params) => {
  switch (params?.data?.data_state) {
    case 'published':
      return null;
    case 'deleted':
      return 'bg-danger bg-opacity-50';
    case 'drafted':
      return 'bg-info bg-opacity-50';
    case 'archived':
      return 'bg-success bg-opacity-50';
    case 'approving':
      return 'bg-warning bg-opacity-50';
    default:
      return null;
  }
};

const getRowId = ({ data, level, parentKeys = [] }) => {
  // return params.data.id || nanoid();
  if (data.id) return data.id;
  else if (level === 0) return data[Object.keys(data)[0]];
  else return parentKeys.join('-') + '-' + data[Object.keys(data)[0]];
};

const quickFilter = reactive({
  quickFilterText: null,
  includeHiddenColumns: false,
});

const handleInputQuickFilterText = debounce(() => {
  gridApi.refreshServerSide();
}, 500);

const handleChangeQuickFilterMode = () => {
  quickFilter.includeHiddenColumns = !quickFilter.includeHiddenColumns;
  if (quickFilter.quickFilterText) gridApi.refreshServerSide();
};

const serverSideDatasource = {
  getRows(params) {
    quickFilter.quickFilterText = quickFilter.quickFilterText || null;
    params.request.quickFilter = quickFilter;
    if (ready.getRows || Object.keys(params.request.filterModel).length) {
      ready.getRows = true;
      document.getElementById('handleSetCurrentFilter').click();
      getDataList({ ...{ tid: Number(route.params.tid) }, ...params.request })
        .then((res) => {
          params.success({
            rowData: res.data.rows || [],
            rowCount: res.data.count || 0,
          });
        })
        .catch(() => {
          params.fail();
        });
    } else {
      params.success({
        rowData: [],
        rowCount: 0,
      });
    }
  },
};

const overlayLoadingTemplate = ref(
  `<span class='ag-overlay-loading-center'>${i18n.global.t('data.list.loading')}</span>`,
);

const handleRefetchDataList = () => {
  overlayLoadingTemplate.value = `<span class='ag-overlay-loading-center'>${i18n.global.t(
    'data.list.loading',
  )}</span>`;
  gridApi.showLoadingOverlay();
  fetchDataForm(() => {
    gridApi.refreshServerSide({ purge: true });
    nextTick(() => gridApi.hideOverlay());
  });
};

const getContextMenuItems = (params) => {
  const menu = [];
  if (params.node?.data?.id) {
    menu.push({
      name: i18n.global.t('data.list.contextMenu.view', {
        data: `${form.value.id}/${params.node?.data?.id}`,
      }),
      action: () => {
        const { href } = router.resolve({
          name: 'view',
          params: { tid: form.value.id, rid: params.node?.data?.id },
        });
        window.open(href, '_blank');
      },
      icon: '<i class="mdi mdi-eye-outline fs-14" style="margin-left: 1px;" />',
    });

    if (
      (!form.value.flow?.length || params.node?.data?.data_state === 'drafted') &&
      store.state.user.data?.permissions?.[route.params.tid]?.edit &&
      (params.node?.data?.created_by === store.state.user.data.username ||
        params.node?.data?.updated_by === store.state.user.data.username ||
        params.node?.data?.acl_edit.includes(store.state.user.data.username) ||
        (params.node?.data?.acl_edit.length === 0 &&
          params.node?.data?.acl_view.includes(store.state.user.data.username)) ||
        (params.node?.data?.acl_view.length === 0 && params.node?.data?.acl_edit.length === 0))
    ) {
      menu.push({
        name: i18n.global.t('data.list.contextMenu.edit', {
          data: `${form.value.id}/${params.node?.data?.id}`,
        }),
        action: () => {
          const { href } = router.resolve({
            name: 'edit',
            params: { tid: form.value.id, rid: params.node?.data?.id },
          });
          window.open(href, '_blank');
        },
        icon: '<i class="mdi mdi-square-edit-outline fs-14" style="margin-left: 1px;" />',
      });
    }
  }

  menu.push({
    name: i18n.global.t('data.list.contextMenu.refresh'),
    action: () => {
      handleRefetchDataList();
    },
    icon: '<i class="mdi mdi-refresh fs-14" style="margin-left: 1px;" />',
  });

  if (params.value && typeof params.value === 'object') {
    menu.push({
      name: i18n.global.t('data.list.contextMenu.copy'),
      action: () => {
        copyToClipboard(JSON.stringify(params.value));
      },
      icon: '<i class="mdi mdi-code-json fs-14" style="margin-left: 1px;" />',
    });
  }

  menu.push(
    'copy',
    'copyWithHeaders',
    'copyWithGroupHeaders',
    'paste',
    'separator',
    'chartRange',
    // 'export', // excelExport
  );

  if (store.state.user.data?.permissions?.[route.params.tid]?.export) {
    const menu_export = {
      name: i18n.global.t('data.list.contextMenu.export'),
      subMenu: [
        {
          name: i18n.global.t('data.list.contextMenu.export.allRows'),
          action: () => {
            gridApi.exportDataAsExcel({
              exportedRows: 'all',
              processCellCallback: (params) => {
                const column = columns.value.find((column) => column.field === params.column.colId);
                if (['SelectFile'].includes(column?.component)) return JSON.stringify(params.value);
                else if (
                  ['BasicAclView', 'BasicAclEdit', 'SelectMultiple', 'SelectTags'].includes(
                    column?.component,
                  )
                )
                  return params.value
                    .map((item) => {
                      return typeof item === 'string' ? item.replace(/,/g, '0x2C') : item;
                    })
                    .toString();
                else return params.value;
              },
            });
          },
          icon: '<i class="mdi mdi-format-list-bulleted-square fs-14" style="margin-left: 1px;" />',
        },
      ],
      icon: '<i class="mdi mdi-export fs-14" style="margin-left: 1px;" />',
    };

    if (selectedRows.value.length) {
      menu_export.subMenu.push({
        name: i18n.global.tc('data.list.contextMenu.export.selectedRows', {
          count: selectedRows.value.length,
        }),
        action: () => {
          gridApi.exportDataAsExcel({
            onlySelected: true,
            processCellCallback: (params) => {
              const column = columns.value.find((column) => column.field === params.column.colId);
              if (['SelectFile'].includes(column?.component)) return JSON.stringify(params.value);
              else if (
                ['BasicAclView', 'BasicAclEdit', 'SelectMultiple', 'SelectTags'].includes(
                  column?.component,
                )
              )
                return params.value
                  .map((item) => {
                    return typeof item === 'string' ? item.replace(/,/g, '0x2C') : item;
                  })
                  .toString();
              else return params.value;
            },
          });
        },
        icon: '<i class="mdi mdi-checkbox-marked-outline fs-14" style="margin-left: 1px;" />',
      });
    }
    menu.push(menu_export);
  }

  if (!form.value.flow?.length && store.state.user.data?.permissions?.[route.params.tid]?.import) {
    const menu_import = {
      name: i18n.global.t('data.list.contextMenu.import'),
      subMenu: [
        {
          name: i18n.global.t('data.list.contextMenu.import.upload'),
          action: () => {
            document.getElementById('data-list-file-input').click();
          },
          icon: '<i class="mdi mdi-file-upload-outline fs-14" style="margin-left: 1px;" />',
        },
        {
          name: i18n.global.t('data.list.contextMenu.import.download'),
          action: () => {
            getDataTemplate({ tid: route.params.tid }).then((res) => {
              const blob = new Blob([res]);
              let href = window.URL.createObjectURL(blob);
              let downloadElement = document.createElement('a');
              downloadElement.style.display = 'none';
              downloadElement.href = href;
              downloadElement.download = `${form.value.id}_${form.value.title}_import_template_${
                store.state.user.data.username
              }_${new Date().getTime()}.xlsx`;
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement);
              window.URL.revokeObjectURL(href);
            });
          },
          icon: '<i class="mdi mdi-file-download-outline fs-14" style="margin-left: 1px;" />',
        },
      ],
      icon: '<i class="mdi mdi-import fs-14" style="margin-left: 1px;" />',
    };

    menu.push(menu_import);
  }

  return menu;
};

const selectedRows = ref([]);
const isRowSelectable = (node) => {
  if (node.group) return false;
  return (
    !['archived', 'approving'].includes(node.data?.data_state) &&
    (node.data?.created_by === store.state.user.data.username ||
      node.data?.updated_by === store.state.user.data.username ||
      node.data?.acl_edit?.includes(store.state.user.data.username) ||
      (node.data?.acl_edit?.length === 0 &&
        node.data?.acl_view?.includes(store.state.user.data.username)) ||
      (node.data?.acl_view?.length === 0 && node.data?.acl_edit?.length === 0))
  );
};
const onSelectionChanged = () => {
  selectedRows.value = gridApi.getSelectedRows();
};
const handleDeselectAllRows = () => {
  gridApi.deselectAll();
};

const handleFileInput = (e) => {
  overlayLoadingTemplate.value = `<span class='ag-overlay-loading-center'>${i18n.global.t(
    'data.list.importing',
  )}</span>`;
  gridApi.showLoadingOverlay();
  const formData = new FormData();
  formData.append('file', e.target.files[0], e.target.files[0].name);
  formData.append('tid', form.value.id);
  toast({
    component: ToastificationContent,
    props: {
      variant: 'success',
      icon: 'mdi-check-circle',
      text: 'data.list.importing',
    },
  });
  importData(formData).then(({ code, msg, data }) => {
    toast.clear();
    e.target.value = null;
    if (code === 200) {
      gridApi.refreshServerSide({ purge: true });
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: i18n.global.tc('data.list.import.success', { count: data }),
        },
      });
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
    gridApi.hideOverlay();
  });
};

const handlePaginationChange = ({ pageNum, pageSize }) => {
  pagination.value.pageNum = pageNum;
  pagination.value.pageSize = pageSize;
  getDataListForHtml();
};

const getDataListForHtml = () => {
  getDataList({
    tid: Number(route.params.tid),
    pageNum: pagination.value.pageNum,
    pageSize: pagination.value.pageSize,
  }).then(({ code, data, msg }) => {
    if (code === 200) {
      const iframe = document.getElementById(`iframe_${form.value.id}`);
      const message = JSON.parse(
        JSON.stringify({
          form: form.value,
          alias: alias.value,
          columns: columns.value,
          list: data.rows,
        }),
      );
      iframe.contentWindow.postMessage(message);
      pagination.value.totalCount = data.count;
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
  });
};

watch(
  () => route.params,
  (newVal = {}, oldVal = {}) => {
    if (newVal.tid && newVal.tid !== oldVal.tid) {
      fetchDataForm();
      quickFilter.quickFilterText = null;
      quickFilter.includeHiddenColumns = false;
      ready.getRows = false;
      columnDefs.value = [];
      selectedRows.value = [];
    }
  },
  { immediate: true, deep: true },
);
</script>

<style lang="scss" scoped>
.quick-filter {
  display: contents;
  span {
    position: relative;
    left: 27px;
    top: 4px;
  }
  input {
    padding-left: 20px;
  }
}
</style>
