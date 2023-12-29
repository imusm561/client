<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card">
      <div class="card-header border-0 p-2 pb-0">
        <span class="float-end">
          <i
            class="mdi mdi-format-list-text fs-16 cursor-pointer text-muted pe-2"
            @click="$router.push({ name: 'list', params: { tid: $route.params.tid } })"
          ></i>
          <i
            v-if="$route.params.rid != 0"
            class="mdi mdi-view-grid-outline fs-16 cursor-pointer text-muted pe-2"
            @click="
              $router.push({
                name: 'view',
                params: { tid: $route.params.tid, rid: $route.params.rid },
              })
            "
          ></i>
          <i
            v-if="tabs.length > 1"
            class="mdi fs-16 cursor-pointer text-muted pe-2"
            :class="ribbon_mode ? 'mdi-tab' : 'mdi-ribbon'"
            @click="handleToggleRibbonMode"
          ></i>
          <i
            class="mdi mdi-refresh fs-16 cursor-pointer text-muted pe-2"
            @click="handleRefetchDataEdit"
          ></i>
        </span>
      </div>
      <div class="card-body pt-0">
        <VueSelect
          v-model="data.id"
          class="mt-2"
          :reduce="(item) => item.id"
          label="title"
          @search="fetchDataTitle"
          :options="titles"
          :clearable="false"
          @option:selected="handleSelectDataTitle"
        >
          <template v-slot:no-options="{ search, searching }">
            <template v-if="searching">
              <span v-html="$t('components.vs.search', { search })"></span>
            </template>
            <em v-else style="opacity: 0.5">{{ $t('components.vs.searchRecord') }}</em>
          </template>
        </VueSelect>
        <Form :id="`zz_${form.id}`" v-slot="{ errors }" @submit="handleSubmitFormData()">
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
            <div class="row p-3">
              <h5 key="data_state" class="fs-14 mb-0 col-12 mb-2 mt-2">
                <label class="form-label">{{ $t('data.column.BasicDataState') }}</label>
                <VueSelect
                  v-model="data.data_state"
                  :placeholder="$t('data.column.BasicDataState')"
                  :reduce="(item) => item.value"
                  label="title"
                  :options="[
                    { title: $t('data.column.BasicDataState.published'), value: 'published' },
                    { title: $t('data.column.BasicDataState.deleted'), value: 'deleted' },
                    { title: $t('data.column.BasicDataState.drafted'), value: 'drafted' },
                    { title: $t('data.column.BasicDataState.archived'), value: 'archived' },
                  ]"
                  :clearable="false"
                  :disabled="data.data_state === 'approving'"
                  :selectable="
                    (option) =>
                      form.flow?.length
                        ? data.id === 0
                          ? option.value === 'drafted'
                          : init_data.data_state != 'published'
                          ? option.value != 'published'
                          : option.value
                        : true
                  "
                >
                  <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                      <span v-html="$t('components.vs.search', { search })"></span>
                    </template>
                    <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                  </template>
                </VueSelect>
              </h5>
              <h5 key="acl_view" class="fs-14 mb-0 col-sm-6 mb-2 mt-2">
                <label class="form-label">{{ $t('data.column.BasicAclView') }}</label>
                <UserSelector
                  :key="`data_${form.id}_${data.id}_acl_view`"
                  v-model="data.acl_view"
                  :placeholder="$t('data.column.BasicAclView')"
                  :class="[errors.acl_view && 'is-invalid']"
                />
                <Field
                  name="acl_view"
                  v-model="data.acl_view"
                  :rules="
                    !!form.flow?.length
                      ? `required|users:${form.flow
                          .map((item) => {
                            return item.users.map((user) => {
                              return user.username;
                            });
                          })
                          .flat()
                          .join(';')}`
                      : ''
                  "
                  class="d-none"
                />
                <span class="invalid-feedback">{{ errors.acl_view }}</span>
              </h5>
              <h5 key="acl_edit" class="fs-14 mb-0 col-sm-6 mb-2 mt-2">
                <label class="form-label">{{ $t('data.column.BasicAclEdit') }}</label>
                <UserSelector
                  :key="`data_${form.id}_${data.id}_acl_edit`"
                  v-model="data.acl_edit"
                  :disabled="!!form.flow?.length"
                  :placeholder="$t('data.column.BasicAclEdit')"
                />
              </h5>
            </div>
            <div class="p-3 border-top border-top-dashed border-0 d-flex justify-content-end gap-2">
              <div
                v-if="
                  (!flow && !form.flow?.length) ||
                  (flow && init_data.data_state === 'drafted') ||
                  data.id === 0
                "
              >
                <div v-if="form.flow?.length && data.data_state === 'drafted'" class="btn-group">
                  <button
                    type="submit"
                    class="btn btn-sm btn-primary"
                    :disabled="
                      Object.keys(errors).length ||
                      columns.filter((column) => column.cfg.syntax_error).length != 0 ||
                      columns.filter((column) => column.cfg.is_uploading).length != 0
                    "
                  >
                    <i class="mdi mdi-share-variant-outline" />
                    {{ $t('data.edit.submit') }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                  ></button>
                  <div class="dropdown-menu dropdown-menu-md p-0">
                    <ul class="list-group list-group-flush">
                      <li
                        class="list-group-item p-2 d-flex gap-2 align-items-center"
                        v-for="(node, index) in form.flow"
                        :key="index"
                      >
                        <span>
                          #{{ index + 1 }} {{ node.title }} [{{
                            node.logic === 1
                              ? $t('data.view.flow.logic.and')
                              : $t('data.view.flow.logic.or')
                          }}]
                        </span>
                        <Avatar :data="resolveFlowUsers(node.users)" size="xxs" />
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  v-else
                  type="submit"
                  class="btn btn-sm btn-success"
                  :disabled="
                    Object.keys(errors).length ||
                    columns.filter((column) => column.cfg.syntax_error).length != 0 ||
                    columns.filter((column) => column.cfg.is_uploading).length != 0
                  "
                >
                  <i class="mdi mdi-content-save-outline" />
                  {{ $t('data.edit.save') }}
                </button>
              </div>
              <div
                class="btn btn-sm btn-info"
                @click="
                  () => {
                    handleCancelEdit((confirm) => {
                      if (confirm) $router.go(-1);
                    });
                  }
                "
              >
                <i class="mdi mdi-keyboard-return" />
                {{ $t('data.edit.back') }}
              </div>
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
                  <div class="row p-3 border-top border-top-dashed">
                    <h5 key="data_state" class="fs-14 mb-0 col-12 mb-2 mt-2">
                      <label class="form-label">{{ $t('data.column.BasicDataState') }}</label>
                      <VueSelect
                        v-model="data.data_state"
                        :placeholder="$t('data.column.BasicDataState')"
                        :reduce="(item) => item.value"
                        label="title"
                        :options="[
                          { title: $t('data.column.BasicDataState.published'), value: 'published' },
                          { title: $t('data.column.BasicDataState.deleted'), value: 'deleted' },
                          { title: $t('data.column.BasicDataState.drafted'), value: 'drafted' },
                          { title: $t('data.column.BasicDataState.archived'), value: 'archived' },
                        ]"
                        :clearable="false"
                        :disabled="data.data_state === 'approving'"
                        :selectable="
                          (option) =>
                            form.flow?.length
                              ? data.id === 0
                                ? option.value === 'drafted'
                                : init_data.data_state != 'published'
                                ? option.value != 'published'
                                : option.value
                              : true
                        "
                      >
                        <template v-slot:no-options="{ search, searching }">
                          <template v-if="searching">
                            <span v-html="$t('components.vs.search', { search })"></span>
                          </template>
                          <em v-else style="opacity: 0.5">
                            {{ $t('components.vs.searchOption') }}
                          </em>
                        </template>
                      </VueSelect>
                    </h5>
                    <h5 key="acl_view" class="fs-14 mb-0 col-sm-6 mb-2 mt-2">
                      <label class="form-label">{{ $t('data.column.BasicAclView') }}</label>
                      <UserSelector
                        :key="`data_${form.id}_${data.id}_acl_view`"
                        v-model="data.acl_view"
                        :placeholder="$t('data.column.BasicAclView')"
                        :class="[errors.acl_view && 'is-invalid']"
                      />
                      <Field
                        name="acl_view"
                        v-model="data.acl_view"
                        :rules="
                          !!form.flow?.length
                            ? `required|users:${form.flow
                                .map((item) => {
                                  return item.users.map((user) => {
                                    return user.username;
                                  });
                                })
                                .flat()
                                .join(';')}`
                            : ''
                        "
                        class="d-none"
                      />
                      <span class="invalid-feedback">{{ errors.acl_view }}</span>
                    </h5>
                    <h5 key="acl_edit" class="fs-14 mb-0 col-sm-6 mb-2 mt-2">
                      <label class="form-label">{{ $t('data.column.BasicAclEdit') }}</label>
                      <UserSelector
                        :key="`data_${form.id}_${data.id}_acl_edit`"
                        v-model="data.acl_edit"
                        :disabled="!!form.flow?.length"
                        :placeholder="$t('data.column.BasicAclEdit')"
                      />
                    </h5>
                  </div>
                  <div
                    class="p-3 border-top border-top-dashed border-0 d-flex justify-content-end gap-2"
                  >
                    <div
                      v-if="
                        data.id === 0 ||
                        form.flow === null ||
                        form.flow.length === 0 ||
                        init_data.data_state === 'drafted'
                      "
                    >
                      <div
                        v-if="form.flow?.length && data.data_state === 'drafted'"
                        class="btn-group"
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
                          <i class="mdi mdi-share-variant-outline" />
                          {{ $t('data.edit.submit') }}
                        </button>
                        <button
                          type="button"
                          class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split"
                          data-bs-toggle="dropdown"
                        ></button>
                        <div class="dropdown-menu dropdown-menu-md p-0">
                          <ul class="list-group list-group-flush">
                            <li
                              class="list-group-item p-2 d-flex gap-2 align-items-center"
                              v-for="(node, index) in form.flow"
                              :key="index"
                            >
                              <span>
                                #{{ index + 1 }} {{ node.title }} [{{
                                  node.logic === 1
                                    ? $t('data.view.flow.logic.and')
                                    : $t('data.view.flow.logic.or')
                                }}]
                              </span>
                              <Avatar :data="resolveFlowUsers(node.users)" size="xxs" />
                            </li>
                          </ul>
                        </div>
                      </div>
                      <button
                        v-else
                        type="submit"
                        class="btn btn-sm btn-success"
                        :disabled="
                          Object.keys(errors).length ||
                          columns.filter((column) => column.cfg.syntax_error).length != 0 ||
                          columns.filter((column) => column.cfg.is_uploading).length != 0
                        "
                      >
                        <i class="mdi mdi-content-save-outline" />
                        {{ $t('data.edit.save') }}
                      </button>
                    </div>
                    <div
                      class="btn btn-sm btn-info"
                      @click="
                        () => {
                          handleCancelEdit((confirm) => {
                            if (confirm) $router.go(-1);
                          });
                        }
                      "
                    >
                      <i class="mdi mdi-keyboard-return" />
                      {{ $t('data.edit.back') }}
                    </div>
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
        data-bs-target="#result"
      ></button>
      <div class="modal fade" id="result" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <p class="ck ck-content" v-html="result.msg"></p>
              <hr />
              <div class="d-flex justify-content-end gap-2">
                <button
                  class="btn btn-sm btn-info"
                  data-bs-dismiss="modal"
                  @click="$router.replace({ name: 'list', params: { tid: form.id } })"
                >
                  {{ $t('data.edit.result.listData') }}
                </button>
                <button
                  class="btn btn-sm btn-success"
                  data-bs-dismiss="modal"
                  @click="$router.replace({ name: 'view', params: { tid: form.id, rid: data.id } })"
                >
                  {{ $t('data.edit.result.viewData') }}
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  data-bs-dismiss="modal"
                  @click="
                    () => {
                      data.id = 0;
                      data.data_state = form.flow?.length ? 'drafted' : 'published';
                    }
                  "
                >
                  {{ $t('data.edit.result.createNewData') }}
                </button>
                <button
                  v-if="data.data_state != 'approving'"
                  class="btn btn-sm btn-danger"
                  data-bs-dismiss="modal"
                >
                  {{ $t('data.edit.result.editData') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      id="showConfirmCancelEditModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      href="#confirmCancelEditModal"
    ></button>
    <div
      class="modal fade"
      id="confirmCancelEditModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('data.edit.confirmCancelEditModal.confirm') }}</h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">
                  {{ $t('data.edit.confirmCancelEditModal.tips') }}
                </p>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-success"
                data-bs-dismiss="modal"
                @click="cancel_edit_confirm = false"
              >
                {{ $t('data.edit.confirmCancelEditModal.cancel') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-info"
                data-bs-dismiss="modal"
                @click="
                  handleStagedUpdate(() => {
                    cancel_edit_confirm = true;
                  })
                "
              >
                {{ $t('data.edit.confirmCancelEditModal.staged') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="cancel_edit_confirm = true"
              >
                {{ $t('data.edit.confirmCancelEditModal.back') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      id="showUpdateConflictsModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#updateConflictsModal"
    ></button>
    <div id="updateConflictsModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              id="hideUpdateConflictsModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('data.edit.updateConflictsModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">
                  {{
                    $t('data.edit.updateConflictsModal.tips', {
                      user: getUserInfo(update_conflicts).fullname,
                    })
                  }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-danger" @click="handleSubmitFormData(true)">
                {{ $t('data.edit.updateConflictsModal.forceUpdate') }}
              </button>
              <button type="button" class="btn w-sm btn-success" @click="handleStagedUpdate()">
                {{ $t('data.edit.updateConflictsModal.staged') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      id="showUseStageDataConfirmModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#useStagedDataConfirmModal"
    ></button>
    <div id="useStagedDataConfirmModal" class="modal fade zoomIn">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              id="hideUseStagedDataConfirmModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $t('data.edit.useStagedDataConfirmModal.title', {
                      user: getUserInfo(update_conflicts).fullname,
                    })
                  }}
                </h4>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-success"
                data-bs-dismiss="modal"
                @click="handleApplyStagedData"
              >
                {{ $t('data.edit.useStagedDataConfirmModal.apply') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-primary"
                data-bs-dismiss="modal"
                @click="handleDiscardStagedData"
              >
                {{ $t('data.edit.useStagedDataConfirmModal.discard') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@layouts/breadcrumb';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import store from '@store';
import {
  useRouter,
  replaceVariables,
  getDataByFormula,
  getRulesByFormula,
  deepCompare,
  getUserLeaders,
  generateFlowByCurrentUser,
  getUserInfo,
  encryptData,
  decryptData,
  hashData,
} from '@utils';
import { getDataEdit, getDataTitle, createData, checkData, forceData, updateData } from '@api/data';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import i18n from '@utils/i18n';
import UserSelector from '@components/UserSelector';
import Avatar from '@components/Avatar';

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
export default {
  components: {
    Breadcrumb,
    UserSelector,
    Avatar,

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
  setup() {
    const { route, router } = useRouter();
    const toast = useToast();
    const moment = window.moment;

    const form = ref({});
    const columns = ref([]);
    const flow = ref({});
    const ribbon_mode = ref(false);
    const tabs = ref([]);
    const current_tab = ref(0);
    const alias = ref({});
    const data = ref({ id: 0 });
    const init_data = ref({ id: 0 });
    const titles = ref([{ id: 0, title: i18n.global.t('data.edit.create') }]);

    const formData = computed(() => {
      return JSON.parse(JSON.stringify(data.value));
    });

    const initialized = ref(false);
    onMounted(() => {
      watch(
        () => route.value.params,
        (newVal = {}, oldVal = {}) => {
          if (
            route.value.name === 'edit' &&
            ((Number(newVal.rid) === 0 &&
              !(
                store.state.user.data?.tags?.includes('ALL') ||
                store.state.user.data?.permissions?.[newVal.tid]?.create
              )) ||
              (Number(newVal.rid) !== 0 &&
                !(
                  store.state.user.data?.tags?.includes('ALL') ||
                  store.state.user.data?.permissions?.[newVal.tid]?.all ||
                  store.state.user.data?.permissions?.[newVal.tid]?.edit
                )))
          ) {
            router.replace({ name: 'permissionDenied' });
            return;
          }
          if (
            route.value.name === 'edit' &&
            (newVal.tid !== oldVal.tid || newVal.rid !== oldVal.rid)
          ) {
            if (Number(init_data.value.id))
              forceData({
                tid: newVal.tid,
                rid: Number(init_data.value.id),
                user: null,
              });
            fetchDataEdit(newVal.tid, newVal.rid);
          }
        },
        { immediate: true, deep: true },
      );

      watch(
        () => formData.value,
        (newVal, oldVal) => {
          if (initialized.value) {
            const changes = deepCompare(newVal || {}, oldVal || {});
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
                    (typeof column.cfg?.min === 'string' &&
                      column.cfg?.min?.includes(`data.${field}`)) ||
                    (typeof column.cfg?.max === 'string' &&
                      column.cfg?.max?.includes(`data.${field}`)),
                )
                .map(async (column) => {
                  if (
                    column.visible?.includes(`data.${field}`) ||
                    column.required?.includes(`data.${field}`) ||
                    column.editable?.includes(`data.${field}`)
                  )
                    await setColumnRules(column);
                  else await setColumnConfiguration(column);
                });
            }
          }
        },
        { immediate: true, deep: true },
      );
    });

    onUnmounted(() => {
      if (Number(init_data.value.id))
        forceData({ tid: form.value.id, rid: Number(init_data.value.id), user: null });
    });

    const fetchDataEdit = async (tid, rid) => {
      const { code, data: res, msg } = await getDataEdit({ tid, rid });
      if (code === 200) {
        initialized.value = false;
        form.value = res.form;
        columns.value = res.columns;
        alias.value = res.alias;
        data.value = res.data;
        flow.value = res.flow;
        init_data.value = JSON.parse(JSON.stringify(res.data));
        await setFormConfiguration();
        await setFormColumns();
        fetchDataTitle();
        current_tab.value = current_tab.value || 0;
        initialized.value = true;
        const staged = localStorage.getItem(
          `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
            `data_edit_${form.value.id}_${data.value.id}_${store.state.user.data.username}_staged`,
          )}`,
        );
        if (staged) document.getElementById('showUseStageDataConfirmModalBtn').click();
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

    const handleToggleRibbonMode = () => {
      ribbon_mode.value = !ribbon_mode.value;
    };

    const handleRefetchDataEdit = () => {
      fetchDataEdit(form.value.id, data.value.id);
    };

    const fetchDataTitle = (search = '', loading) => {
      if (loading) loading(true);
      const params = {
        tid: form.value.id,
        rid: data.value.id,
      };
      if (search.length) params.search = search;
      getDataTitle(params).then(({ code, data, msg }) => {
        if (code === 200) {
          titles.value = [
            ...(store.state.user.data.tags.includes('ALL') ||
            store.state.user.data.permissions?.[form.value.id]?.create ||
            false
              ? [{ id: 0, title: i18n.global.t('data.edit.create') }]
              : []),
            ...data,
          ];
          if (loading) loading(false);
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

    const setFormConfiguration = () => {
      if (form.value.script) form.value.script = replaceVariables(form.value.script, alias.value);
      form.value.flow = form.value.flow.length ? generateFlowByCurrentUser(form.value.flow) : null;
      if (form.value.style) {
        const style = document.createElement('style');
        style.innerHTML = form.value.style;
        document.querySelector('head').appendChild(style);
      }
    };

    const resolveFlowUsers = computed(() => {
      return (users) => {
        return store.state.org.users.filter((user) =>
          users
            .map((user) => {
              return user.username;
            })
            .includes(user.username),
        );
      };
    });

    const setFormColumns = async () => {
      const BasicColumns = columns.value.filter((column) => column.component.includes('Basic'));
      const FormColumns = columns.value.filter((column) => !column.component.includes('Basic'));
      const HasTabs = FormColumns.find((column) => column.component === 'LayoutTab') ? true : false;

      if (Number(data.value.id) === 0) {
        BasicColumns.forEach((column) => {
          if (column.field === 'acl_view') {
            data.value.acl_view = Array.from(
              new Set([
                ...(form.value.acl_view.length
                  ? form.value.acl_view
                  : getUserLeaders(store.state.user.data)),
                ...(form.value.flow?.length
                  ? form.value.flow
                      .map((item) => {
                        return item.users.map((user) => {
                          return user.username;
                        });
                      })
                      .flat()
                  : []),
              ]),
            );
          }
          if (column.field === 'acl_edit') {
            data.value.acl_edit = form.value.flow?.length
              ? [store.state.user.data.username]
              : form.value.acl_edit.length
              ? form.value.acl_edit
              : [store.state.user.data.username];
          }
          if (column.field === 'data_state' && form.value.flow?.length)
            data.value.data_state = 'drafted';
        });

        // for await (let column of BasicColumns) {
        //   if (column.field === 'acl_view') {
        //     data.value.acl_view = Array.from(
        //       new Set([
        //         ...(form.value.acl_view.length
        //           ? form.value.acl_view
        //           : getUserLeaders(store.state.user.data)),
        //         ...(form.value.flow?.length
        //           ? form.value.flow
        //               .map((item) => {
        //                 return item.users.map((user) => {
        //                   return user.username;
        //                 });
        //               })
        //               .flat()
        //           : []),
        //       ]),
        //     );
        //   }
        //   if (column.field === 'acl_edit') {
        //     data.value.acl_edit = form.value.flow?.length
        //       ? [store.state.user.data.username]
        //       : form.value.acl_edit.length
        //       ? form.value.acl_edit
        //       : [store.state.user.data.username];
        //   }
        //   if (column.field === 'data_state' && form.value.flow?.length)
        //     data.value.data_state = 'drafted';
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

      // for (let tab of tabs.value) {
      //   for await (let column of tab.children) {
      //     column.key = hashData(JSON.stringify(column));
      //     await replaceColumnVariables(column);
      //     await setColumnConfiguration(column);
      //     await setColumnRules(column);
      //   }
      //   tab.columns = tab.children;
      // }

      tabs.value.forEach((tab) => {
        tab.children.forEach(async (column) => {
          column._visible = true;
          column._required = false;
          column._editable = true;
          column.key = hashData(JSON.stringify(column));
          await replaceColumnVariables(column);
          await setColumnConfiguration(column);
          await setColumnRules(column);
        });
        tab.columns = tab.children;
      });
    };

    const replaceColumnVariables = (column) => {
      if (column.visible) column.visible = replaceVariables(column.visible, alias.value);
      if (column.required) column.required = replaceVariables(column.required, alias.value);
      if (column.editable) column.editable = replaceVariables(column.editable, alias.value);
      if (column.default) column.__default = replaceVariables(column.default, alias.value);
      if (column.cfg?.source)
        column.cfg.__source = replaceVariables(column.cfg.source, alias.value);
      if (column.cfg?.prefix) column.cfg.prefix = replaceVariables(column.cfg.prefix, alias.value);
      if (column.cfg?.href) column.cfg.href = replaceVariables(column.cfg.href, alias.value);
      if (typeof column.cfg?.min === 'string')
        column.cfg.min = replaceVariables(column.cfg.min, alias.value);
      if (typeof column.cfg?.max === 'string')
        column.cfg.max = replaceVariables(column.cfg.max, alias.value);
    };

    const setColumnConfiguration = async (column) => {
      if (Number(data.value.id) === 0 || initialized.value) {
        if (column.default) {
          const val = await getDataByFormula(data.value, column.__default);
          const res =
            column.component === 'SelectTags'
              ? val.split(',')
              : column.component === 'SelectDatetime'
              ? moment(
                  column.cfg.dateFormat.includes('Y-m-d')
                    ? val
                    : `${moment().format('YYYY-MM-DD')} ${val}`,
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

        if (column.alias && route.value.query[column.alias])
          data.value[column.field] = route.value.query[column.alias];
      }

      if (column.cfg?.source) {
        column.cfg.search = [];
        column.cfg.options = await getDataByFormula(data.value, column.cfg.__source, {
          value: !initialized.value ? data.value[column.field] : null,
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
              : column.cfg.options.find((option) => option.value == data.value[column.field])
                  ?.value || null;
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

    const setColumnRules = async (column) => {
      const { visible, required, editable } = await getRulesByFormula(data.value, column);
      if (
        column._visible != visible ||
        column._required != required ||
        column._editable != editable
      )
        column.key = hashData(JSON.stringify(column));

      // column._visible = visible;
      column._required = required;
      column._editable = editable;

      if (column._visible != visible) {
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

    const handleSelectDataTitle = (e) => {
      // data.value.id = init_data.value.id;
      // const changes = deepCompare(data.value, init_data.value);
      // if (Object.keys(changes).length) {
      //   toast({
      //     component: ToastificationContent,
      //     props: {
      //       variant: 'danger',
      //       icon: 'mdi-alert',
      //       text: `Column${Object.keys(changes).length > 1 ? 's' : ''} ${Object.keys(changes).join(', ')} ${Object.keys(changes).length > 1 ? 'have' : 'has'} been changed.`,
      //     },
      //   });
      // } else
      router.push({ name: 'edit', params: { tid: form.value.id, rid: e.id } });
    };

    const handleSelecterSearch = async ({ search, loading, column }) => {
      loading(true);
      column.cfg.search = await getDataByFormula(data.value, column.cfg.__source, { search });
      loading(false);
    };

    const update_conflicts = ref(null);
    const result = ref({});
    const handleSubmitFormData = (force = false) => {
      const formdata = JSON.parse(JSON.stringify(data.value));
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

      if (formdata.id === 0) {
        formdata.tid = form.value.id;
        formdata.flow = form.value.flow;
        createData(formdata).then((res) => {
          if (res.code === 200) {
            result.value = res;
            data.value = res.data;
            init_data.value = JSON.parse(JSON.stringify(res.data));
            titles.value.splice(1, 0, { id: res.data.id, title: res.data.title });
            forceData({ tid: form.value.id, rid: data.value.id });
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
      } else {
        const changes = deepCompare(formdata, init_data.value);
        if (Object.keys(changes).length) {
          changes.tid = form.value.id;
          changes.id = formdata.id;
          changes.data_state = formdata.data_state;
          changes.flow = form.value.flow;
          checkData({ tid: form.value.id, rid: formdata.id }).then(
            ({ code, data: editing, msg }) => {
              if (code === 200) {
                if (editing === null || editing === store.state.user.data.username || force) {
                  updateData(changes).then((res) => {
                    document.getElementById('hideUpdateConflictsModalBtn').click();
                    forceData({ tid: changes.tid, rid: changes.id });
                    if (res.code === 200) {
                      result.value = res;
                      data.value = res.data;
                      init_data.value = JSON.parse(JSON.stringify(res.data));
                      document.getElementById('showResultModalBtn').click();
                      handleDiscardStagedData();
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
                } else {
                  update_conflicts.value = editing;
                  document.getElementById('showUpdateConflictsModalBtn').click();
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
            },
          );
        }
      }
    };

    const handleStagedUpdate = (callback) => {
      localStorage.setItem(
        `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
          `data_edit_${form.value.id}_${data.value.id}_${store.state.user.data.username}_staged`,
        )}`,
        encryptData(JSON.stringify(data.value)),
      );
      document.getElementById('hideUpdateConflictsModalBtn').click();
      callback && callback();
    };

    const handleApplyStagedData = () => {
      const staged = localStorage.getItem(
        `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
          `data_edit_${form.value.id}_${data.value.id}_${store.state.user.data.username}_staged`,
        )}`,
      );
      try {
        data.value = JSON.parse(decryptData(staged));
      } catch (error) {
        // console.error(error);
      }
      localStorage.removeItem(
        `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
          `data_edit_${form.value.id}_${data.value.id}_${store.state.user.data.username}_staged`,
        )}`,
      );
    };

    const handleDiscardStagedData = () => {
      localStorage.removeItem(
        `${process.env.BASE_URL.replace(/\//g, '_')}${hashData(
          `data_edit_${form.value.id}_${data.value.id}_${store.state.user.data.username}_staged`,
        )}`,
      );
    };

    const cancel_edit_confirm = ref(null);
    const handleCancelEdit = (callback) => {
      cancel_edit_confirm.value = null;
      const changes = deepCompare(data.value, init_data.value);
      if (Object.keys(changes).length === 0) {
        callback(true);
      } else {
        document.getElementById('showConfirmCancelEditModalBtn').click();
        let interval;
        interval = setInterval(() => {
          if (cancel_edit_confirm.value != null) {
            callback(cancel_edit_confirm.value);
            clearInterval(interval);
          }
        }, 100);
      }
    };

    return {
      form,
      columns,
      data,
      init_data,
      flow,

      ribbon_mode,
      tabs,
      current_tab,
      titles,

      fetchDataEdit,
      handleToggleRibbonMode,
      handleRefetchDataEdit,
      fetchDataTitle,
      handleSelectDataTitle,
      handleSelecterSearch,

      setColumnConfiguration,

      resolveFlowUsers,

      handleSubmitFormData,
      result,

      update_conflicts,
      getUserInfo,

      handleStagedUpdate,
      handleApplyStagedData,
      handleDiscardStagedData,

      cancel_edit_confirm,
      handleCancelEdit,
    };
  },
};
</script>
