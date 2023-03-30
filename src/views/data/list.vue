<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card">
      <div class="card-header border-0 p-2 pb-0">
        <span class="float-end">
          <i
            class="mdi mdi-table-eye fs-16 cursor-pointer text-muted pe-2"
            data-bs-toggle="modal"
            data-bs-target="#formInfoModal"
          ></i>
          <i
            class="mdi mdi-refresh fs-16 cursor-pointer text-muted pe-2"
            @click="handleRefetchDataList"
          ></i>
        </span>
      </div>
      <div class="card-body d-flex flex-column pt-0" style="height: fit-content">
        <div class="mb-2">
          <div v-if="form.description" class="ck ck-content p-0" v-html="form.description" />
          <div class="d-flex justify-content-end gap-2">
            <div
              v-if="
                ($store.state.user.data?.tags?.includes('ALL') ||
                  $store.state.user.data?.permissions?.[$route.params.tid]?.batch) &&
                selectedRows.length > 1 &&
                (!form.flow || form.flow?.length === 0) &&
                selectedRows.every((row) => !['archived', 'approving'].includes(row.data_state))
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
                <div class="dropdown-divider"></div>
                <span class="dropdown-item cursor-pointer" @click="handleDeselectAllRows()">
                  {{ $tc('data.list.header.deselect', { count: selectedRows.length }) }}
                </span>
              </div>
            </div>
            <button
              v-if="
                $store.state.user.data?.tags?.includes('ALL') ||
                $store.state.user.data?.permissions?.[$route.params.tid]?.create
              "
              type="button"
              class="btn btn-sm btn-primary"
              @click="$router.push({ name: 'edit', params: { tid: $route.params.tid, rid: 0 } })"
            >
              <i class="mdi mdi-plus"></i>
              {{ $t('data.list.data.create') }}
            </button>
          </div>
        </div>
        <AgGridVue
          :key="$route.params.tid"
          class="ag-height"
          :class="$store.state.sys.theme === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
          :columnDefs="columnDefs"
          multiSortKey="ctrl"
          :animateRows="true"
          rowModelType="serverSide"
          :localeText="localeText"
          :serverSideDatasource="serverSideDatasource"
          :serverSideSortAllLevels="true"
          :serverSideFilterAllLevels="true"
          :serverSideSortOnServer="true"
          :serverSideFilterOnServer="true"
          rowGroupPanelShow="always"
          :getContextMenuItems="getContextMenuItems"
          rowSelection="multiple"
          :getRowClass="getRowClass"
          :enableRangeSelection="true"
          :suppressRowClickSelection="true"
          @selectionChanged="onSelectionChanged"
          :enableCharts="true"
          :sideBar="sideBar"
          :pagination="true"
          :paginationPageSize="500"
          :cacheBlockSize="500"
          :serverSideInfiniteScroll="true"
          :statusBar="statusBar"
          :defaultColDef="defaultColDef"
          @grid-ready="onGridReady"
          :getRowId="getRowId"
          @columnVisible="handleColumnChange"
          @columnPinned="handleColumnChange"
          @columnResized="handleColumnChange"
          @columnMoved="handleColumnChange"
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
              <Form v-slot="{ errors }" @submit="handleSubmitBatchUpdate">
                <component
                  :is="batch.column.component"
                  type="EDIT"
                  :column="batch.column"
                  v-model="batch.value"
                  :required="batch.column._required"
                  :error="errors[batch.column.field]"
                  @search="handleSelecterSearch"
                  @selected="($event) => (batch.column.cfg.selected = $event)"
                  @syntax-error="
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

      <div class="modal fade" id="formInfoModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header p-2 bg-light">
              <h5 class="modal-title">#{{ form.id }} {{ form.title }}</h5>
              <button
                type="button"
                class="btn-close"
                id="hideFormInfoModalBtn"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div class="modal-body p-0">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span class="fw-medium">{{ $t('data.list.formInfoModal.creation') }}</span>
                  <span class="badge bg-primary">
                    {{ getUserInfo(form.created_by).fullname }} @
                    {{ $moment(form.created_at).format('llll') }}
                  </span>
                </li>
                <li
                  v-if="form.updated_by"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span class="fw-medium">{{ $t('data.list.formInfoModal.lastUpdate') }}</span>
                  <span class="badge bg-secondary">
                    {{ getUserInfo(form.updated_by).fullname }} @
                    {{ $moment(form.updated_at).format('llll') }}
                  </span>
                </li>
                <li
                  v-if="form.flow?.length"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span class="fw-medium">{{ $t('data.list.formInfoModal.approval') }}</span>
                  <span>
                    <span v-for="(flow, index) in form.flow" :key="index">
                      <span class="badge bg-info">{{ flow.title }}</span>
                      <span v-if="index < form.flow.length - 1">&nbsp;>>&nbsp;</span>
                    </span>
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span class="fw-medium">{{ $t('data.list.formInfoModal.totalRecords') }}</span>
                  <span>
                    <span v-for="(val, key) in records" :key="key">
                      <span class="badge ms-2" :class="resolveDataStateVariant(key)">
                        {{ $t(`data.column.BasicDataState.${key}`) }}: {{ val }}
                      </span>
                    </span>
                  </span>
                </li>
              </ul>
              <div class="card mb-0 border-top">
                <div class="card-header">
                  <ul class="nav nav-tabs-custom rounded card-header-tabs nav-justified">
                    <li class="nav-item">
                      <a class="nav-link p-2 active" data-bs-toggle="tab" href="#tab_columns">
                        {{ $t('data.list.formInfoModal.tab.columns') }}
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link p-2" data-bs-toggle="tab" href="#tab_logs">
                        {{ $t('data.list.formInfoModal.tab.logs') }}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="card-body p-0">
                  <div class="tab-content">
                    <div class="tab-pane active" id="tab_columns">
                      <div
                        v-if="
                          columns.filter(
                            (column) => column.type && !column.component.includes('Basic'),
                          ).length
                        "
                        data-simplebar
                        class="p-0"
                        style="max-height: 40vh"
                      >
                        <table
                          class="table table-hover table-striped table-bordered table-nowrap align-middle mb-0"
                        >
                          <thead class="table-light">
                            <tr>
                              <th class="text-capitalize">id</th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.component') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.name') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.alias') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.type') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.length') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.tags') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.default') }}
                              </th>
                              <th class="text-capitalize">
                                {{ $t('data.list.formInfoModal.tab.columns.source') }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="column in columns.filter(
                                (column) => column.type && !column.component.includes('Basic'),
                              )"
                              :key="column.id"
                            >
                              <td class="fw-medium text-primary">#{{ column.id }}</td>
                              <td class="fw-medium">
                                {{
                                  $t(
                                    `data.list.formInfoModal.tab.columns.component.${column.component}`,
                                  )
                                }}
                              </td>
                              <td
                                style="max-width: 200px"
                                class="text-truncate"
                                :title="column.name"
                              >
                                {{ column.name }}
                              </td>
                              <td>
                                <span class="badge bg-secondary">{{ column.alias }}</span>
                              </td>
                              <td>{{ column.type }}</td>
                              <td>{{ column.length }}</td>
                              <td>
                                <span
                                  class="badge bg-info me-1"
                                  v-for="tag in column.tags"
                                  :key="tag"
                                >
                                  {{ tag }}
                                </span>
                              </td>
                              <td>{{ column.default }}</td>
                              <td>{{ column.cfg?.source }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Empty v-else :text="$t('data.list.formInfoModal.tab.columns.empty')" />
                    </div>
                    <div class="tab-pane" id="tab_logs">
                      <Log :key="$route.path" :tid="Number($route.params.tid)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref, computed, nextTick } from 'vue';
import store from '@store';
import i18n from '@utils/i18n';
import {
  useRouter,
  replaceHtml,
  getUserInfo,
  copyToClipboard,
  replaceVariables,
  getRulesByFormula,
  getDataByFormula,
  generateFlowByCurrentUser,
} from '@utils';
import {
  getDataForm,
  getDataList,
  getDataSets,
  getDataTemplate,
  importData,
  checkData,
  updateData,
} from '@api/data';
import { getCustomColumns, createCustomColumns, updateCustomColumns } from '@api/custom';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import Breadcrumb from '@layouts/breadcrumb';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
if (store.state.sys.cfg?.ag_grid?.license)
  LicenseManager.setLicenseKey(store.state.sys.cfg.ag_grid.license);
import AG_GRID_LOCALE_EN_US from '@utils/i18n/ag-gird/en-us.json';
import AG_GRID_LOCALE_ZH_CN from '@utils/i18n/ag-gird/zh-cn.json';
import Empty from '@components/Empty';
import Log from '@components/Log';
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

export default {
  components: {
    Breadcrumb,
    AgGridVue,
    Empty,
    Log,
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
  setup() {
    const { route, router } = useRouter();
    const toast = useToast();
    const socket = window.socket;

    const form = ref({});
    const alias = ref({});
    const columns = ref([]);
    const customs = ref(null);
    const records = ref({});
    const resolveDataStateVariant = computed(() => {
      return (state) => {
        switch (state) {
          case 'published':
            return 'bg-primary';
          case 'deleted':
            return 'bg-danger';
          case 'drafted':
            return 'bg-info';
          case 'archived':
            return 'bg-success';
          case 'approving':
            return 'bg-secondary';
          default:
            return 'bg-warning';
        }
      };
    });

    const localeText = ref(
      store.state.sys.lang === 'zh-cn' ? AG_GRID_LOCALE_ZH_CN : AG_GRID_LOCALE_EN_US,
    );

    const defaultColDef = ref({
      resizable: true,
      sortable: true,
      // menuTabs: [],
    });
    const columnDefs = ref([]);

    const sideBar = ref({
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
          //     tid: Number(route.value.params.tid),
          //   },
          // },
          minWidth: 200,
          maxWidth: 300,
          width: 250,
        },
      ],
    });

    const statusBar = ref({
      statusPanels: [
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' },
      ],
    });

    onMounted(() => {
      watch(
        () => route.value.params.tid,
        (newVal, oldVal) => {
          if (newVal && newVal !== oldVal) {
            init.value = true;
            columnDefs.value = [];
            fetchDataForm();
            selectedRows.value = [];
          }
        },
        { immediate: true },
      );

      socket.on('refetchDataList', (res) => {
        if (res.tid == route.value.params.tid) handleRefetchDataList();
      });
    });

    onUnmounted(() => {
      socket.removeListener('refetchDataList');
    });

    const fetchDataForm = async (callback) => {
      const { code, data, msg } = await getDataForm({ tid: Number(route.value.params.tid) });
      if (code === 200) {
        form.value = data.form;
        alias.value = data.alias;
        columns.value = data.columns.filter((column) => !column.tags.includes('hideInDataList'));
        records.value = data.records;
        const res = await getCustomColumns({ tid: Number(route.value.params.tid) });
        customs.value = res.data;
        await setFormConfiguration();
        await setFormColumnDefs();
        nextTick(() => {
          if (customs.value)
            customs.value.data.forEach((custom, index) => {
              gridColumnApi.moveColumn(custom.field, index);
            });
        });
        gridApi.setFilterModel({
          data_state: {
            filterType: 'set',
            values: ['published'], // 'drafted', 'approving'
          },
        });
        callback && callback();
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
      form.value.flow = form.value.flow.length ? generateFlowByCurrentUser(form.value.flow) : null;
    };

    let gridApi = null;
    let gridColumnApi = null;
    const onGridReady = (params) => {
      gridApi = params.api;
      gridColumnApi = params.columnApi;
    };

    let timer = null;
    const handleColumnChange = () => {
      const tid = Number(route.value.params.tid);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const columnState = gridColumnApi.getColumnState();
        if (customs.value) {
          updateCustomColumns({
            id: customs.value.id,
            tid,
            data: columnState.map((column) => {
              return {
                field: column.colId,
                hide: column.hide,
                width: column.width,
                pinned: column.pinned,
              };
            }),
          }).then(({ code, msg }) => {
            if (code != 200) {
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
          createCustomColumns({
            tid,
            data: columnState.map((column) => {
              return {
                field: column.colId,
                hide: column.hide,
                width: column.width,
                pinned: column.pinned,
              };
            }),
          }).then(({ code, data, msg }) => {
            if (code === 200) {
              customs.value = data;
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
    };

    const generateColumnDef = (column) => {
      const columnDef = {};
      const custom = customs.value
        ? customs.value.data.find((item) => item.field === column.field) || null
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

        checkData({ tid: Number(route.value.params.tid), rid: params.data.id }).then(
          ({ code, data: editing, msg }) => {
            if (code === 200) {
              if (editing === null || editing === store.state.user.data.username) {
                updateData({
                  tid: Number(route.value.params.tid),
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
          (store.state.user.data?.tags?.includes('ALL') ||
            store.state.user.data?.permissions?.[route.value.params.tid]?.all ||
            params.data.created_by === store.state.user.data.username ||
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
                text: i18n.global.t('data.list.cellEdit.error'),
              },
            });
            return;
          }
          const _column = JSON.parse(JSON.stringify(column));
          const { visible, required, editable } = await getRulesByFormula(params.data, _column);
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
              tid: Number(route.value.params.tid),
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

      if (['int', 'double', 'float'].includes(column.type)) {
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
                tid: Number(route.value.params.tid),
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
              tid: Number(route.value.params.tid),
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

      if (['color'].includes(column.type)) {
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
      columnDef.rowGroup = false;
      columnDef.enableRowGroup = true;
      columnDef.enableValue = true;
      columnDef.allowedAggFuncs = ['avg', 'count', 'max', 'min', 'sum'];

      // ============================================================================

      // ============================================================================
      columnDef.sortable = true;
      columnDef.sort = ['id', 'updated_at'].includes(column.field) ? 'desc' : null;
      columnDef.sortIndex = ['updated_at'].includes(column.field)
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
      // columnDef.flex = 1
      // ============================================================================

      return columnDef;
    };

    const replaceColumnVariables = (column) => {
      if (column.visible) column.visible = replaceVariables(column.visible, alias.value);
      if (column.required) column.required = replaceVariables(column.required, alias.value);
      if (column.editable) column.editable = replaceVariables(column.editable, alias.value);
      if (column.default) column.__default = replaceVariables(column.default, alias.value);
      if (column.cfg?.source)
        column.cfg.__source = replaceVariables(column.cfg.source, alias.value);
      if (column.cfg?.min) column.cfg.min = replaceVariables(column.cfg.min, alias.value);
      if (column.cfg?.max) column.cfg.max = replaceVariables(column.cfg.max, alias.value);
    };

    const setColumnConfiguration = async (column) => {
      if (column.cfg?.source) {
        column.cfg.search = [];
        if (!column.cfg.__source?.includes('data.'))
          column.cfg.options = await getDataByFormula({}, column.cfg.__source, { value: null });
      }

      if (column.cfg?.min && !column.cfg.min?.includes('data.')) {
        const minDate = await getDataByFormula({}, column.cfg.min);
        if (isNaN(minDate) && !isNaN(Date.parse(minDate))) column.cfg.minDate = minDate;
      }
      if (column.cfg?.max && !column.cfg.max?.includes('data.')) {
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
        const { visible, required, editable } = await getRulesByFormula({}, column);
        column._visible = visible;
        column._required = required;
        column._editable = editable;
      }
    };

    const handleSelecterSearch = async ({ search, loading, column }) => {
      loading(true);
      column.cfg.search = await getDataByFormula({}, column.cfg.__source, { search });
      loading(false);
    };

    const batch = ref({
      columns: [],
      column: null,
      value: null,
      syntax_error: null,
    });

    const handleSubmitBatchUpdate = () => {
      const tid = Number(route.value.params.tid);
      const ids = selectedRows.value.map((row) => {
        return row.id;
      });
      checkData({ tid, ids }).then(({ code, data: editing, msg }) => {
        if (code === 200) {
          if (editing.length === 0) {
            updateData({
              tid,
              ids,
              field: batch.value.column.field,
              value: batch.value.value,
            }).then(({ code, msg }) => {
              if (code === 200) {
                document.getElementById('hideBatchUpdateModalModalBtn').click();
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
      for (let index = 0; index < columns.value.length; index++) {
        const column = columns.value[index];
        await replaceColumnVariables(column);
        await setColumnConfiguration(column);
        await setColumnRules(column);

        batch.value.column = [];
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
          batch.value.columns.push(JSON.parse(JSON.stringify(column)));

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
      }
      columnDefs.value = defs;
    };

    const getRowId = (params) => {
      return params.data.id || params.data[Object.keys(params.data)[0]]; // Math.random().toString(36).slice(-6)
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

    const init = ref(true);

    const serverSideDatasource = {
      getRows(params) {
        if (init.value) {
          init.value = false;
          params.successCallback([], 0);
        } else {
          document.getElementById('handleSetCurrentFilter').click();
          getDataList({ ...{ tid: Number(route.value.params.tid) }, ...params.request })
            .then((res) => {
              params.successCallback(res.data.rows, res.data.count);
            })
            .catch(() => {
              params.failCallback();
            });
          // .catch((error) => {
          //   console.error(error);
          //   params.failCallback();
          // });
        }
      },
    };

    const handleRefetchDataList = () => {
      fetchDataForm(() => {
        gridApi.refreshServerSide({ purge: true });
      });
    };

    const getContextMenuItems = (params) => {
      const menu = [];
      if (params.node) {
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
          icon: '<i class="mdi mdi-eye-outline fs-14" style="margin-left: 2px;" />',
        });

        if (!form.value.flow?.length || params.node?.data?.data_state === 'drafted') {
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
            icon: '<i class="mdi mdi-square-edit-outline fs-14" style="margin-left: 2px;" />',
          });
        }

        if (typeof params.value === 'object') {
          menu.push({
            name: i18n.global.t('data.list.contextMenu.copy'),
            action: () => {
              copyToClipboard(JSON.stringify(params.value));
            },
            icon: '<i class="mdi mdi-code-json fs-14" style="margin-left: 2px;" />',
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

        if (
          store.state.user.data?.tags?.includes('ALL') ||
          store.state.user.data?.permissions?.[route.value.params.tid]?.export
        ) {
          const menu_export = {
            name: i18n.global.t('data.list.contextMenu.export'),
            subMenu: [
              {
                name: i18n.global.t('data.list.contextMenu.export.allRows'),
                action: () => {
                  gridApi.exportDataAsExcel({
                    exportedRows: 'all',
                  });
                },
                icon: '<i class="mdi mdi-format-list-bulleted-square fs-14" style="margin-left: 2px;" />',
              },
            ],
            icon: '<i class="mdi mdi-export fs-14" style="margin-left: 2px;" />',
          };

          if (selectedRows.value.length) {
            menu_export.subMenu.push({
              name: i18n.global.tc('data.list.contextMenu.export.selectedRows', {
                count: selectedRows.value.length,
              }),
              action: () => {
                gridApi.exportDataAsExcel({
                  onlySelected: true,
                });
              },
              icon: '<i class="mdi mdi-checkbox-marked-outline fs-14" style="margin-left: 2px;" />',
            });
          }
          menu.push(menu_export);
        }
      }

      if (
        !form.value.flow?.length &&
        (store.state.user.data?.tags?.includes('ALL') ||
          store.state.user.data?.permissions?.[route.value.params.tid]?.import)
      ) {
        const menu_import = {
          name: i18n.global.t('data.list.contextMenu.import'),
          subMenu: [
            {
              name: i18n.global.t('data.list.contextMenu.import.upload'),
              action: () => {
                document.getElementById('data-list-file-input').click();
              },
              icon: '<i class="mdi mdi-file-upload-outline fs-14" style="margin-left: 2px;" />',
            },
            {
              name: i18n.global.t('data.list.contextMenu.import.download'),
              action: () => {
                getDataTemplate({ tid: route.value.params.tid }).then((res) => {
                  const blob = new Blob([res]);
                  let href = window.URL.createObjectURL(blob);
                  let downloadElement = document.createElement('a');
                  downloadElement.style.display = 'none';
                  downloadElement.href = href;
                  downloadElement.download = `${form.value.id}_${
                    form.value.title
                  }_import_template_${store.state.user.data.username}_${new Date().getTime()}.xlsx`;
                  document.body.appendChild(downloadElement);
                  downloadElement.click();
                  document.body.removeChild(downloadElement);
                  window.URL.revokeObjectURL(href);
                });
              },
              icon: '<i class="mdi mdi-file-download-outline fs-14" style="margin-left: 2px;" />',
            },
          ],
          icon: '<i class="mdi mdi-import fs-14" style="margin-left: 2px;" />',
        };

        menu.push(menu_import);
      }

      return menu;
    };

    const selectedRows = ref([]);
    const onSelectionChanged = () => {
      selectedRows.value = gridApi.getSelectedRows();
    };
    const handleDeselectAllRows = () => {
      gridApi.deselectAll();
    };

    const handleFileInput = (e) => {
      const formData = new FormData();
      formData.append('file', e.target.files[0], e.target.files[0].name);
      formData.append('tid', form.value.id);
      importData(formData).then(({ code, msg, data }) => {
        if (code === 200) {
          gridApi.refreshServerSide({ purge: true });
          e.target.value = null;
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
      });
    };

    return {
      form,
      columns,
      records,
      resolveDataStateVariant,

      handleSelecterSearch,
      batch,
      handleSubmitBatchUpdate,

      localeText,

      defaultColDef,
      columnDefs,

      sideBar,
      statusBar,

      getRowClass,

      onGridReady,
      handleColumnChange,
      getRowId,
      serverSideDatasource,
      handleRefetchDataList,

      setColumnConfiguration,

      getContextMenuItems,
      onSelectionChanged,
      selectedRows,
      handleDeselectAllRows,

      handleFileInput,

      getUserInfo,
    };
  },
};
</script>
