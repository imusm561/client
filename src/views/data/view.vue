<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card ribbon-box">
      <span
        v-if="flow"
        class="ribbon-two ribbon-two-primary print-hidden"
        :class="
          flow.status === 1
            ? 'ribbon-two-success'
            : flow.status === -1
            ? 'ribbon-two-danger'
            : 'ribbon-two-secondary'
        "
      >
        <span
          id="showFlowDataOffcanvasBtn"
          class="cursor-pointer"
          data-bs-toggle="offcanvas"
          data-bs-target="#flowDataOffcanvas"
        >
          {{
            flow.status === 1
              ? $t('data.view.flow.status.approved')
              : flow.status === -1
              ? $t('data.view.flow.status.rejected')
              : $t('data.view.flow.status.approving')
          }}
        </span>
      </span>
      <div class="card-header border-0 p-2 pb-0 print-hidden">
        <span class="float-end">
          <i
            class="mdi mdi-format-list-text fs-16 cursor-pointer text-muted pe-2"
            @click="$router.push({ name: 'list', params: { tid: $route.params.tid } })"
          ></i>
          <i
            v-if="tabs.length > 1"
            class="mdi fs-16 cursor-pointer text-muted pe-2"
            :class="ribbon_mode ? 'mdi-tab' : 'mdi-ribbon'"
            @click="handleToggleRibbonMode"
          ></i>
          <i
            v-if="
              tabs.some((tab) =>
                tab.columns.some((column) => column.type && isEmpty(data[column.field])),
              )
            "
            class="mdi fs-16 cursor-pointer text-muted pe-2"
            :class="show_empty_value_columns ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'"
            @click="show_empty_value_columns = !show_empty_value_columns"
          ></i>
          <i
            class="mdi mdi-refresh fs-16 cursor-pointer text-muted pe-2"
            @click="handleRefetchDataView"
          ></i>
        </span>
      </div>
      <div class="card-body pt-0 pb-0">
        <VueSelect
          v-model="data.id"
          class="mt-2 print-hidden"
          :reduce="(item) => item.id"
          label="title"
          @search="fetchDataTitle"
          :options="titles"
          :clearable="false"
          @option:selected="
            ($event) =>
              $router.replace({
                name: $event.id === 0 ? 'edit' : 'view',
                params: { tid: $route.params.tid, rid: $event.id },
              })
          "
        >
          <template v-slot:no-options="{ search, searching }">
            <template v-if="searching">
              <span v-html="$t('components.vs.search', { search })"></span>
            </template>
            <em v-else style="opacity: 0.5">{{ $t('components.vs.searchRecord') }}</em>
          </template>
        </VueSelect>

        <div id="print">
          <div class="p-3 pb-0">
            <div class="row">
              <div class="col-sm-6">
                <h4>#{{ data.id }}</h4>
                <h6 class="d-flex align-items-center">
                  <span
                    class="text-muted me-1"
                    style="white-space: nowrap"
                    :title="
                      resolveUsers(data.acl_view)
                        .map((item) => {
                          return item.fullname;
                        })
                        .join(',')
                    "
                  >
                    {{ $t('data.column.BasicAclView') }}:&nbsp;
                  </span>
                  <Avatar
                    v-if="data.acl_view?.length"
                    :data="resolveUsers(data.acl_view)"
                    size="xxs"
                  />
                  <span v-else>-</span>
                </h6>
                <h6 class="d-flex align-items-center">
                  <span
                    class="text-muted me-1"
                    style="white-space: nowrap"
                    :title="
                      resolveUsers(data.acl_edit)
                        .map((item) => {
                          return item.fullname;
                        })
                        .join(',')
                    "
                  >
                    {{ $t('data.column.BasicAclEdit') }}:&nbsp;
                  </span>
                  <Avatar
                    v-if="data.acl_edit?.length"
                    :data="resolveUsers(data.acl_edit)"
                    size="xxs"
                  />
                  <span v-else>-</span>
                </h6>
              </div>
              <div class="col-sm-6">
                <h6 class="pb-1">
                  <span class="text-muted">{{ $t('data.column.BasicUuid') }}:&nbsp;</span>
                  <span class="text-uppercase">{{ data.uuid }}</span>
                </h6>
                <h6 class="pb-1">
                  <span class="text-muted">{{ $t('data.column.BasicDataState') }}:&nbsp;</span>
                  <span
                    class="text-uppercase badge"
                    :class="data.data_state === 'approving' ? 'bg-secondary' : 'bg-primary'"
                  >
                    {{ $t(`data.column.BasicDataState.${data.data_state}`) }}
                  </span>
                </h6>
                <h6 class="pb-1">
                  <span class="text-muted">{{ $t('data.column.BasicCreateInfo') }}:&nbsp;</span>
                  <span>
                    {{ getUserInfo(data.created_by).fullname }}@{{
                      moment(data.created_at).format('llll')
                    }}
                  </span>
                </h6>
                <h6 class="pb-1" v-if="data.updated_at && data.updated_by">
                  <span class="text-muted">{{ $t('data.column.BasicUpdateInfo') }}:&nbsp;</span>
                  <span>
                    {{ getUserInfo(data.updated_by).fullname }}@{{
                      moment(data.updated_at).format('llll')
                    }}
                  </span>
                </h6>
              </div>
            </div>
          </div>

          <div v-if="tabs.length > 1 && ribbon_mode">
            <div
              :id="tab.field"
              class="p-3 mt-2 border-top border-top-dashed ribbon-box right"
              v-for="tab in tabs.filter(
                (tab) =>
                  show_empty_value_columns ||
                  tab.columns.filter(
                    (column) => column._visible && !(column.type && isEmpty(data[column.field])),
                  ).length,
              )"
              :key="tab.id"
            >
              <div v-if="tab.name" class="ribbon ribbon-info round-shape">
                <i v-if="tab.cfg.icon" :class="`mdi ${tab.cfg.icon} me-1`"></i>
                {{ tab.name }}
              </div>
              <div class="row">
                <template v-for="column in tab.columns">
                  <div
                    :id="column.field"
                    :key="column.id"
                    v-if="
                      column._visible &&
                      (show_empty_value_columns || !(column.type && isEmpty(data[column.field])))
                    "
                    :class="`col-sm-${column.col} mb-2 mt-2`"
                  >
                    <p
                      class="mb-2 fw-semibold"
                      :class="
                        !(column.type && isEmpty(data[column.field])) ? 'text-muted' : 'text-danger'
                      "
                      v-if="column.type"
                      :title="resolveColumnTitle(column)"
                    >
                      {{ column.name }}
                    </p>
                    <h5 class="fs-14 mb-0">
                      <component
                        :is="column.component"
                        v-model="data[column.field]"
                        :column="column"
                        type="VIEW"
                      ></component>
                    </h5>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div v-else class="mt-2 border-top border-top-dashed">
            <div v-if="tabs[0] && tabs[0].id" class="row align-items-center mt-3">
              <div class="col">
                <ul class="nav nav-tabs nav-tabs-custom nav-primary">
                  <li
                    class="nav-item"
                    v-for="(tab, index) in tabs.filter(
                      (tab) =>
                        show_empty_value_columns ||
                        tab.columns.filter(
                          (column) =>
                            column._visible && !(column.type && isEmpty(data[column.field])),
                        ).length,
                    )"
                    :key="tab.id"
                  >
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
                v-for="(tab, index) in tabs.filter(
                  (tab) =>
                    show_empty_value_columns ||
                    tab.columns.filter(
                      (column) => column._visible && !(column.type && isEmpty(data[column.field])),
                    ).length,
                )"
                :key="tab.id"
              >
                <div class="row p-3">
                  <template v-for="column in tab.columns">
                    <div
                      :id="column.field"
                      :key="column.id"
                      v-if="
                        column._visible &&
                        (show_empty_value_columns || !(column.type && isEmpty(data[column.field])))
                      "
                      :class="`col-sm-${column.col} mb-2 mt-2`"
                    >
                      <p
                        class="mb-2 fw-semibold"
                        :class="
                          !(column.type && isEmpty(data[column.field]))
                            ? 'text-muted'
                            : 'text-danger'
                        "
                        v-if="column.type"
                        :title="resolveColumnTitle(column)"
                      >
                        {{ column.name }}
                      </p>
                      <h5 class="fs-14 mb-0">
                        <component
                          :is="column.component"
                          v-model="data[column.field]"
                          :column="column"
                          type="VIEW"
                        ></component>
                      </h5>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="p-3 pt-0 border-0 d-flex justify-content-end gap-2"
          v-if="
            data.id &&
            (form.flow === null || form.flow.length === 0 || data.data_state === 'drafted')
          "
        >
          <a
            v-if="
              $store.state.user.data?.permissions?.[$route.params.tid]?.edit &&
              (data.created_by === $store.state.user.data.username ||
                data.updated_by === $store.state.user.data.username ||
                data.acl_edit.includes($store.state.user.data.username) ||
                (data.acl_edit?.length === 0 &&
                  data.acl_view.includes($store.state.user.data.username)) ||
                (data.acl_view?.length === 0 && data.acl_edit?.length === 0))
            "
            class="btn btn-sm btn-primary print-hidden"
            @click="
              $router.push({ name: 'edit', params: { tid: $route.params.tid, rid: data.id } })
            "
          >
            <i class="mdi mdi-square-edit-outline align-bottom me-1"></i>
            {{ $t('data.view.edit') }}
          </a>
        </div>
      </div>
    </div>
    <div class="card print-hidden">
      <div class="card-header">
        <ul class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: !$route.query.tab || $route.query.tab === 'comment' }"
              data-bs-toggle="tab"
              href="#tab_comments"
            >
              {{ $t('data.view.comments') }}
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.query.tab === 'log' }"
              data-bs-toggle="tab"
              href="#tab_logs"
            >
              {{ $t('data.view.logs') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <div
            class="tab-pane"
            :class="{ active: !$route.query.tab || $route.query.tab === 'comment' }"
            id="tab_comments"
          >
            <Comment v-if="data.id" :key="$route.path" :source="$route.path" :data="data" />
          </div>
          <div class="tab-pane" :class="{ active: $route.query.tab === 'log' }" id="tab_logs">
            <Log
              v-if="data.id"
              :key="$route.path"
              type="data"
              :tid="Number($route.params.tid)"
              :rid="Number($route.params.rid)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="flow" id="flowDataOffcanvas" class="offcanvas offcanvas-start">
      <i
        id="hideFlowDataOffcanvasBtn"
        class="i-close mdi mdi-close-box fs-24 text-muted cursor-pointer"
        data-bs-dismiss="offcanvas"
      />
      <div class="offcanvas-body p-0 overflow-hidden">
        <div data-simplebar style="height: 100vh">
          <div class="timeline p-3">
            <div class="item pb-2 d-flex">
              <div class="flex-shrink-0">
                <Avatar :data="getUserInfo(flow.created_by)" size="xs" />
              </div>
              <div class="flex-grow-1 ms-2">
                <span>
                  <div class="fw-medium fs-10">
                    {{ getUserInfo(flow.created_by).fullname }}
                    <i
                      v-if="flow.created_by != $store.state.user.data.username"
                      class="mdi mdi-chat-processing-outline text-muted cursor-pointer"
                      @click="$router.push({ name: 'chat', query: { contact: flow.created_by } })"
                    />
                  </div>
                  <small class="text-muted">
                    {{ moment(flow.created_at).format('llll') }}
                    <span class="badge bg-soft-info text-info align-middle ms-2">
                      {{ moment(flow.created_at).fromNow() }}
                    </span>
                  </small>
                </span>
                <div class="mt-1">
                  <blockquote class="blockquote mb-0 pb-1 ps-2 pt-1">
                    {{ $t('data.view.flow.creation') }}
                    <small
                      v-if="
                        flow.status === 0 && flow.created_by === $store.state.user.data.username
                      "
                      class="ms-2 badge bg-soft-danger text-danger cursor-pointer"
                      data-bs-toggle="modal"
                      href="#confirmRevokeFlowModal"
                    >
                      {{ $t('data.view.flow.revoke') }}
                    </small>
                  </blockquote>
                </div>
              </div>
            </div>
            <div class="item pb-2 d-flex" v-for="(node, nidx) in flow.nodes" :key="nidx">
              <div class="flex-shrink-0 avatar-xs">
                <div
                  class="avatar-title text-dark rounded-circle"
                  :class="
                    flow.nodes.findIndex((node) =>
                      node.users
                        .map((item) => {
                          return item.username;
                        })
                        .some((u) => flow.handler.includes(u)),
                    ) === nidx
                      ? 'bg-secondary'
                      : (node.logic === 1 &&
                          node.users.every((item) => item.comment && item.pass)) ||
                        (node.logic === 0 && node.users.some((item) => item.comment && item.pass))
                      ? 'bg-success'
                      : node.users.find((item) => item.comment && !item.pass)
                      ? 'bg-danger'
                      : 'bg-light'
                  "
                >
                  #{{ nidx + 1 }}
                </div>
              </div>
              <div class="flex-grow-1 ms-2">
                <span>
                  <div class="fw-medium fs-10">{{ node.title }}</div>
                  <small class="text-muted">
                    {{
                      node.logic === 1
                        ? $t('data.view.flow.logic.and')
                        : $t('data.view.flow.logic.or')
                    }}
                  </small>
                </span>
                <div class="mt-2" v-for="(item, uidx) in node.users" :key="uidx">
                  <div
                    class="p-2 border rounded"
                    :class="{
                      'border-dashed': !item.comment,
                      'border-secondary': flow.handler.includes(item.username),
                      'border-primary':
                        flow.handler.includes(item.username) &&
                        item.username === $store.state.user.data.username,
                      'border-success': item.comment && item.pass,
                      'border-danger': item.comment && !item.pass,
                    }"
                  >
                    <div class="d-flex align-items-center">
                      <Avatar :data="getUserInfo(item.username)" size="xs" />
                      <div class="ms-1">
                        <div class="fw-medium text-dark">
                          {{ getUserInfo(item.username).fullname }}
                          <i
                            v-if="item.username != $store.state.user.data.username"
                            class="mdi mdi-chat-processing-outline text-muted cursor-pointer"
                            @click="
                              $router.push({ name: 'chat', query: { contact: item.username } })
                            "
                          />
                        </div>
                        <div class="fs-10 text-muted">
                          {{ item.datetime || getUserInfo(item.username)?.post }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        item.username === $store.state.user.data.username &&
                        flow.handler.includes(item.username)
                      "
                    >
                      <div>
                        <label class="mt-2">{{ $t('data.view.flow.comment') }}</label>
                        <textarea
                          class="form-control"
                          v-model="item.comment"
                          :placeholder="$t('data.view.flow.comment')"
                          rows="2"
                        ></textarea>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <div>
                          <input class="form-check-input" type="checkbox" v-model="item.pass" />
                          <label class="form-check-label ms-2" @click="item.pass = !item.pass">
                            {{ $t('data.view.flow.pass') }}
                          </label>
                        </div>
                        <button
                          type="button"
                          class="btn btn-sm"
                          :disabled="!item.comment"
                          :class="item.pass ? 'btn-secondary' : 'btn-danger'"
                          @click="
                            handleSubmitFlow({
                              id: flow.id,
                              node: nidx,
                              user: uidx,
                              pass: item.pass,
                              comment: item.comment,
                            })
                          "
                        >
                          {{
                            item.pass ? $t('data.view.flow.approve') : $t('data.view.flow.reject')
                          }}
                        </button>
                      </div>
                    </div>
                    <div v-else class="mt-1">
                      <blockquote v-if="item.comment" class="blockquote mb-0 pb-1 ps-2 pt-1">
                        {{ item.comment }}
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="confirmRevokeFlowModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('data.view.flow.confirmRevokeFlowModal.confirm') }}</h4>
                <p class="text-muted mx-4 mb-0 mb-2">
                  {{ $t('data.view.flow.confirmRevokeFlowModal.tips') }}
                </p>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('data.view.flow.confirmRevokeFlowModal.cancel') }}
              </button>
              <button
                type="button"
                class="btn w-sm btn-danger"
                data-bs-dismiss="modal"
                @click="handleSubmitFlow({ id: flow.id, revoke: true, t: new Date().getTime() })"
              >
                {{ $t('data.view.flow.confirmRevokeFlowModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';

import {
  getUserInfo,
  resolveColumnTitle,
  replaceVariables,
  getRulesByFormula,
  generateFlowByCurrentUser,
  getDataByFormula,
  isEmpty,
  hashData,
} from '@utils';
import i18n from '@utils/i18n';
import moment from '@utils/moment';
import { socket } from '@utils/socket';

import store from '@store';

import Breadcrumb from '@layouts/breadcrumb';
import Avatar from '@components/Avatar';
import Log from '@components/Log';
import Comment from '@components/Comment';

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

import { getDataView, getDataTitle, updateFlow } from '@api/data';

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

const form = ref([]);
const columns = ref([]);
const ribbon_mode = ref(true);
const tabs = ref([]);
const current_tab = ref(0);
const alias = ref({});
const show_empty_value_columns = ref(false);
const data = ref({});
const flow = ref(null);
const titles = ref([]);

const refetchDataViewHandler = (res) => {
  if (res.tid == route.params.tid && res.rid == route.params.rid) handleRefetchDataView();
};

onMounted(() => {
  socket.on('refetchDataView', refetchDataViewHandler);
});

onUnmounted(() => {
  socket.off('refetchDataView', refetchDataViewHandler);
});

const fetchDataView = async (tid, rid) => {
  const { code, data: res, msg } = await getDataView({ tid, rid });
  if (code === 200) {
    form.value = res.form;
    columns.value = res.columns;
    alias.value = res.alias;
    data.value = res.data;
    flow.value = res.flow;
    if (res.flow === null) {
      document.getElementById('hideFlowDataOffcanvasBtn')?.click();
    } else if (res.flow.handler && res.flow.handler.includes(store.state.user.data.username)) {
      setTimeout(() => {
        document.getElementById('showFlowDataOffcanvasBtn')?.click();
      }, 500);
    }
    setFormConfiguration();
    setFormColumns();
    fetchDataTitle();
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
  () => route.params,
  (newVal = {}, oldVal = {}) => {
    if (route.name === 'view' && (newVal.tid !== oldVal.tid || newVal.rid !== oldVal.rid)) {
      fetchDataView(newVal.tid, newVal.rid);
    }
  },
  { immediate: true, deep: true },
);

const setFormConfiguration = () => {
  if (form.value.script) form.value.script = replaceVariables(form.value.script, alias.value);
  form.value.flow = form.value.flow?.length ? generateFlowByCurrentUser(form.value.flow) : null;
};

const handleToggleRibbonMode = () => {
  ribbon_mode.value = !ribbon_mode.value;
};

const handleRefetchDataView = () => {
  fetchDataView(form.value.id, data.value.id);
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
        ...(store.state.user.data.permissions?.[form.value.id]?.create
          ? [{ id: 0, title: i18n.global.t('data.view.create') }]
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

const setFormColumns = () => {
  tabs.value = [];
  if (columns.value.filter((column) => column.component === 'LayoutTab').length === 0)
    tabs.value.push({ columns: [] });
  columns.value.forEach((column) => {
    if (column.component.includes('Basic')) {
      // Basic Columns: id, uuid, data_state, created_by, created_at, updated_by, updated_at, acl_view, acl_edit
    } else if (column.component === 'LayoutTab') {
      tabs.value.push({ ...column, ...{ columns: [] } });
    } else {
      setColumnValue(column);
      tabs.value[tabs.value.length - 1].columns.push(column);
    }
  });
};

const setColumnValue = async (column) => {
  if (column.cfg?.source) {
    column.cfg.__source = replaceVariables(column.cfg.source, alias.value);
    data.value[column.field] = await getDataByFormula(data.value, column.cfg.__source, {
      view: true,
      value: data.value[column.field],
    });
  }

  if (column.cfg?.href) {
    column.cfg.href = replaceVariables(column.cfg.href, alias.value);
    column.cfg.__href = await getDataByFormula(data.value, column.cfg.href);
  }

  if (column.visible) {
    column.visible = replaceVariables(column.visible, alias.value);
    const { visible } = getRulesByFormula(data.value, column);
    column._visible = visible;
  } else {
    column._visible = true;
  }
};

const resolveUsers = computed(() => {
  return (users) => {
    return Array.isArray(users)
      ? users.map((username) => {
          return (
            store.state.org.users.find((user) => user.username === username) || {
              username: username,
              fullname: username,
            }
          );
        })
      : [];
  };
});

const handleSubmitFlow = (data) => {
  data.hash = hashData(JSON.stringify(data));
  updateFlow(data).then((res) => {
    if (res.code === 200) {
      if (res.data === null) document.getElementById('hideFlowDataOffcanvasBtn')?.click();
      flow.value = res.data;
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

<style scoped>
#print {
  h6 {
    line-height: initial;
  }
}
</style>
