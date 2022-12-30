<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="card">
      <div class="card-header border-0 p-2 pb-0">
        <span class="float-end">
          <i class="mdi mdi-format-list-numbered fs-16 cursor-pointer text-muted pe-2" @click="$router.push({ name: 'list', params: { tid: $route.params.tid } })"></i>
          <i
            v-if="$route.params.rid != 0"
            class="mdi mdi-eye-outline fs-16 cursor-pointer text-muted pe-2"
            @click="$router.push({ name: 'view', params: { tid: $route.params.tid, rid: $route.params.rid } })"
          ></i>
          <i class="mdi mdi-refresh fs-16 cursor-pointer text-muted pe-2" @click="handleRefetchDataEdit"></i>
          <i v-if="tabs.length > 1" class="mdi fs-16 cursor-pointer text-muted pe-2" :class="no_tabs ? 'mdi-tab' : 'mdi-view-dashboard-outline'" @click="no_tabs = !no_tabs"></i>
        </span>
      </div>
      <div class="card-body pt-0">
        <VueSelect v-model="data.id" class="mt-2" :reduce="(item) => item.id" label="title" @search="fetchDataTitle" :options="titles" :clearable="false" @option:selected="handleSelectDataTitle">
          <template v-slot:no-options="{ search, searching }">
            <template v-if="searching">
              <span v-html="$t('components.vs.search', { search })"></span>
            </template>
            <em v-else style="opacity: 0.5">{{ $t('components.vs.searchRecord') }}</em>
          </template>
        </VueSelect>
        <Form :id="`zz_${form.id}`" v-slot="{ errors }" @submit="handleSubmitFormData">
          <div v-if="tabs.length > 1 && no_tabs">
            <div :id="tab.field" class="p-3 mt-2 border-bottom border-bottom-dashed ribbon-box right" v-for="(tab, index) in tabs" :key="index">
              <div v-if="tab.name" class="ribbon ribbon-primary round-shape">
                <i v-if="tab.cfg.icon" :class="`mdi ${tab.cfg.icon} me-2`"></i>
                {{ tab.name }}
              </div>
              <div class="row">
                <template v-for="column in tab.columns">
                  <h5 :id="column.field" :key="column.id" v-if="column._visible" class="fs-14 mb-2 mt-2" :class="`col-sm-${column.col}`">
                    <component
                      :is="column.component"
                      type="EDIT"
                      :column="column"
                      v-model="data[column.field]"
                      :required="column._required"
                      :editable="column._editable"
                      :error="errors[column.field]"
                      @search="handleSelecterSearch"
                      @selected="($event) => (column.cfg.selected = $event)"
                      @syntax-error="
                        ($event) => {
                          syntax_error = $event;
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
                  :disabled="data.data_state === 'approving'"
                  :selectable="(option) => (form.flow?.length ? (data.id === 0 ? option.value === 'drafted' : init_data.data_state != 'published' ? option.value != 'published' : option.value) : true)"
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
                <UsersSelector v-model="data.acl_view" :placeholder="$t('data.column.BasicAclView')" />
              </h5>
              <h5 key="acl_edit" class="fs-14 mb-0 col-sm-6 mb-2 mt-2">
                <label class="form-label">{{ $t('data.column.BasicAclEdit') }}</label>
                <UsersSelector v-model="data.acl_edit" :disabled="!!form.flow?.length" :placeholder="$t('data.column.BasicAclEdit')" />
              </h5>
            </div>
            <div class="p-3 border-top border-top-dashed border-0 d-flex justify-content-end gap-2">
              <div v-if="(!flow && !form.flow?.length) || (flow && init_data.data_state === 'drafted') || data.id === 0">
                <div v-if="form.flow?.length && data.data_state === 'drafted'" class="btn-group">
                  <button type="submit" class="btn btn-sm btn-primary" :disabled="Object.keys(errors).length || syntax_error">
                    <i class="mdi mdi-share-variant-outline" />
                    {{ $t('data.edit.submit') }}
                  </button>
                  <button type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                  <div class="dropdown-menu dropdown-menu-md p-0">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item p-2 d-flex gap-2 align-items-center" v-for="(node, index) in form.flow" :key="index">
                        <span>#{{ index }} {{ node.title }} [{{ node.logic === 1 ? 'And' : 'Or' }}]</span>
                        <Avatar :data="resolveFlowUsers(node.users)" size="xxs" />
                      </li>
                    </ul>
                  </div>
                </div>
                <button v-else type="submit" class="btn btn-sm btn-success" :disabled="Object.keys(errors).length || syntax_error">
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
                    <a :class="`nav-link text-${tab.cfg.style} ${index === current_tab && 'active'}`" data-bs-toggle="tab" :href="`#${tab.field}`" @click="current_tab = index">
                      <i v-if="tab.cfg.icon" :class="`mdi ${tab.cfg.icon}`"></i>
                      {{ tab.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="tab-content text-muted">
              <div class="tab-pane" :class="{ active: index === current_tab }" :id="tab.field" v-for="(tab, index) in tabs" :key="tab.id">
                <div class="row p-3">
                  <template v-for="column in tab.columns">
                    <h5 :id="column.field" :key="column.id" v-if="column._visible" class="fs-14 mb-2 mt-2" :class="`col-sm-${column.col}`">
                      <component
                        :is="column.component"
                        type="EDIT"
                        :column="column"
                        v-model="data[column.field]"
                        :required="column._required"
                        :editable="column._editable"
                        :error="errors[column.field]"
                        @search="handleSelecterSearch"
                        @selected="($event) => (column.cfg.selected = $event)"
                        @syntax-error="
                          ($event) => {
                            syntax_error = $event;
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
                        :disabled="data.data_state === 'approving'"
                        :selectable="
                          (option) => (form.flow?.length ? (data.id === 0 ? option.value === 'drafted' : init_data.data_state != 'published' ? option.value != 'published' : option.value) : true)
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
                      <UsersSelector v-model="data.acl_view" :placeholder="$t('data.column.BasicAclView')" />
                    </h5>
                    <h5 key="acl_edit" class="fs-14 mb-0 col-sm-6 mb-2 mt-2">
                      <label class="form-label">{{ $t('data.column.BasicAclEdit') }}</label>
                      <UsersSelector v-model="data.acl_edit" :disabled="!!form.flow?.length" :placeholder="$t('data.column.BasicAclEdit')" />
                    </h5>
                  </div>
                  <div class="p-3 border-top border-top-dashed border-0 d-flex justify-content-end gap-2">
                    <div v-if="(!flow && !form.flow?.length) || (flow && init_data.data_state === 'drafted') || data.id === 0">
                      <div v-if="form.flow?.length && data.data_state === 'drafted'" class="btn-group">
                        <button type="submit" class="btn btn-sm btn-primary" :disabled="Object.keys(errors).length || syntax_error">
                          <i class="mdi mdi-share-variant-outline" />
                          {{ $t('data.edit.submit') }}
                        </button>
                        <button type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                        <div class="dropdown-menu dropdown-menu-md p-0">
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item p-2 d-flex gap-2 align-items-center" v-for="(node, index) in form.flow" :key="index">
                              <span>#{{ index }} {{ node.title }} [{{ node.logic === 1 ? 'And' : 'Or' }}]</span>
                              <Avatar :data="resolveFlowUsers(node.users)" size="xxs" />
                            </li>
                          </ul>
                        </div>
                      </div>
                      <button v-else type="submit" class="btn btn-sm btn-success" :disabled="Object.keys(errors).length || syntax_error">
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
      <button id="showResultModalBtn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#result"></button>
      <div class="modal fade" id="result" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <p v-html="result.msg"></p>
              <hr />
              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-info" data-bs-dismiss="modal" @click="$router.replace({ name: 'list', params: { tid: form.id } })">{{ $t('data.edit.result.listData') }}</button>
                <button class="btn btn-sm btn-success" data-bs-dismiss="modal" @click="$router.replace({ name: 'view', params: { tid: form.id, rid: data.id } })">
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
                <button v-if="data.data_state != 'approving'" class="btn btn-sm btn-danger" data-bs-dismiss="modal">{{ $t('data.edit.result.editData') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button type="button" id="showConfirmCancelEditModalBtn" class="d-none" data-bs-toggle="modal" href="#confirmCancelEditModal"></button>
    <div class="modal fade" id="confirmCancelEditModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-focus="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('data.edit.confirmCancelEditModal.confirm') }}</h4>
                <p class="text-muted mx-4 mb-0 mb-2" style="white-space: nowrap">{{ $t('data.edit.confirmCancelEditModal.tips') }}</p>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal" @click="cancel_edit_confirm = false">{{ $t('data.edit.confirmCancelEditModal.cancel') }}</button>
              <button type="button" class="btn w-sm btn-danger" data-bs-dismiss="modal" @click="cancel_edit_confirm = true">{{ $t('data.edit.confirmCancelEditModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/layouts/breadcrumb';
import { computed, onMounted, ref, watch } from 'vue';
import store from '@store';
import { useRouter, replaceVariables, getDataByFormula, getRulesByFormula, deepCompare, getUserLeaders, generateFlowByCurrentUser } from '@utils';
import { getDataEdit, getDataTitle, createData, updateData } from '@api/data';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import i18n from '@utils/i18n';
import UsersSelector from '@components/UsersSelector';
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
    UsersSelector,
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

    const form = ref({});
    const columns = ref([]);
    const flow = ref({});
    const no_tabs = ref(false);
    const tabs = ref([]);
    const current_tab = ref(0);
    const alias = ref({});
    const data = ref({ id: 0 });
    const init_data = ref({ id: 0 });
    const titles = ref([{ id: 0, title: i18n.global.t('data.edit.create') }]);
    const syntax_error = ref(null);

    const formData = computed(() => {
      return JSON.parse(JSON.stringify(data.value));
    });

    const initialized = ref(false);
    onMounted(() => {
      watch(
        () => route.value.params.rid,
        (newVal, oldVal) => {
          if (
            (Number(newVal) === 0 && !(store.state.user.data?.tags?.includes('ALL') || store.state.user.data?.permissions?.[route.value.params.tid]?.create)) ||
            (Number(newVal) !== 0 && !(store.state.user.data?.tags?.includes('ALL') || store.state.user.data?.permissions?.[route.value.params.tid]?.modify))
          ) {
            router.replace({ name: 'permissionDenied' });
            return;
          }
          if (route.value.name === 'edit' && newVal !== oldVal) {
            fetchDataEdit(route.value.params.tid, newVal);
          }
        },
        { immediate: true },
      );

      // let timer = null;
      watch(
        () => formData.value,
        async (newVal, oldVal) => {
          if (initialized.value) {
            // if (timer) clearTimeout(timer);
            // timer = setTimeout(() => {
            const changes = deepCompare(newVal || {}, oldVal || {});
            for (let field in changes) {
              columns.value
                .filter(
                  (column) =>
                    column.default?.includes(`data.${field}`) ||
                    column.cfg?.source?.includes(`data.${field}`) ||
                    column.cfg?.prefix?.includes(`data.${field}`) ||
                    column.cfg?.href?.includes(`data.${field}`),
                )
                .forEach((column) => setColumnConfiguration(column));

              columns.value
                .filter((column) => column.visible?.includes(`data.${field}`) || column.required?.includes(`data.${field}`) || column.editable?.includes(`data.${field}`))
                .forEach((column) => setColumnRules(column));
            }
            // }, 300);
          }
        },
        { immediate: true, deep: true },
      );
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
            ...(store.state.user.data.tags.includes('ALL') || store.state.user.data.permissions?.[form.value.id]?.create || false ? [{ id: 0, title: i18n.global.t('data.edit.create') }] : []),
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
      tabs.value = [];
      if (columns.value.filter((column) => column.component === 'LayoutTab').length === 0) tabs.value.push({ columns: [] });
      for (let column of columns.value) {
        if (column.component.includes('Basic')) {
          // Basic Columns: id, uuid, data_state, created_by, created_at, updated_by, updated_at, acl_view, acl_edit
          if (Number(data.value.id) === 0) {
            if (column.field === 'acl_view') {
              data.value.acl_view = Array.from(
                new Set([
                  ...(form.value.acl_view.length ? form.value.acl_view : getUserLeaders(store.state.user.data)),
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
              data.value.acl_edit = form.value.flow?.length ? [store.state.user.data.username] : form.value.acl_edit.length ? form.value.acl_edit : [store.state.user.data.username];
            }
            if (column.field === 'data_state' && form.value.flow?.length) data.value.data_state = 'drafted';
          }
        } else if (column.component === 'LayoutTab') {
          tabs.value.push({ ...column, ...{ columns: [] } });
        } else {
          await setColumnConfiguration(column);
          await setColumnRules(column);
          tabs.value[tabs.value.length - 1].columns.push(column);
        }
      }
    };

    const setColumnConfiguration = async (column) => {
      if (column.default) {
        column.default = replaceVariables(column.default, alias.value);
        if (Number(data.value.id) === 0 || initialized.value) {
          const val = await getDataByFormula(data.value, column.default);
          if (val && typeof val === 'string' && val.includes('Error: ')) column.cfg.placeholder = val;
          else data.value[column.field] = val;
        }
      }

      if (column.cfg?.source) {
        column.cfg.search = [];
        column.cfg.source = replaceVariables(column.cfg.source, alias.value);
        column.cfg.options = await getDataByFormula(data.value, column.cfg.source, { value: !initialized.value ? data.value[column.field] : null });

        if (column.cfg.options.length) {
          data.value[column.field] =
            column.component == 'SelectMultiple'
              ? column.cfg.options
                  .filter((option) => data.value[column.field]?.includes(option.value))
                  .map((option) => {
                    return option.value;
                  })
              : column.cfg.options.find((option) => option.value == data.value[column.field])?.value || null;
        } else {
          data.value[column.field] = column.component == 'SelectMultiple' ? [] : null;
        }
      }

      if (column.cfg?.prefix) {
        column.cfg.prefix = replaceVariables(column.cfg.prefix, alias.value);
        column.cfg.__prefix = await getDataByFormula(data.value, column.cfg.prefix);
      }

      if (column.cfg?.href) {
        column.cfg.href = replaceVariables(column.cfg.href, alias.value);
        column.cfg.__href = await getDataByFormula(data.value, column.cfg.href);
      }
    };

    const setColumnRules = async (column) => {
      if (column.visible) column.visible = replaceVariables(column.visible, alias.value);
      if (column.required) column.required = replaceVariables(column.required, alias.value);
      if (column.editable) column.editable = replaceVariables(column.editable, alias.value);
      const { visible, required, editable } = await getRulesByFormula(data.value, column);
      column._visible = visible;
      column._required = required;
      column._editable = editable;
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
      column.cfg.search = await getDataByFormula(data.value, column.cfg.source, { search });
      loading(false);
    };

    const result = ref({});
    const handleSubmitFormData = () => {
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
          updateData(changes).then((res) => {
            if (res.code === 200) {
              result.value = res;
              data.value = res.data;
              init_data.value = JSON.parse(JSON.stringify(res.data));
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
        }
      }
    };

    const cancel_edit_confirm = ref(null);
    const handleCancelEdit = (callback) => {
      cancel_edit_confirm.value = null;
      const changes = deepCompare(data.value, init_data.value);
      if (Object.keys(changes).length === 0) {
        callback(true);
      } else {
        document.getElementById('showConfirmCancelEditModalBtn').click();
        const interval = setInterval(() => {
          if (cancel_edit_confirm.value != null) {
            callback(cancel_edit_confirm.value);
            clearInterval(interval);
          }
        }, 100);
      }
    };

    return {
      form,
      data,
      init_data,
      flow,
      syntax_error,

      no_tabs,
      tabs,
      current_tab,
      titles,

      fetchDataEdit,
      handleRefetchDataEdit,
      fetchDataTitle,
      handleSelectDataTitle,
      handleSelecterSearch,

      resolveFlowUsers,

      handleSubmitFormData,
      result,

      cancel_edit_confirm,
      handleCancelEdit,
    };
  },
};
</script>
