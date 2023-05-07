<template>
  <div class="row d-none d-md-block">
    <div class="col-12">
      <div class="page-title-box d-sm-flex align-items-center justify-content-between">
        <h4 class="mb-sm-0">{{ $t(title) }}</h4>
        <div class="page-title-right">
          <ol class="breadcrumb m-0 justify-content-end">
            <li class="breadcrumb-item text-truncate" style="max-width: 200px">
              <a class="cursor-pointer" @click="$router.push('/')">
                <i class="mdi mdi-home me-1"></i>
                <span :title="$t('layout.breadcrumb.home')">
                  {{ $t('layout.breadcrumb.home') }}
                </span>
              </a>
            </li>
            <li
              class="breadcrumb-item text-truncate"
              style="max-width: 200px"
              v-for="(item, index) in items"
              :key="index"
            >
              <a :class="{ active: index === items.length - 1 }" :title="$t(item.title)">
                <i v-if="item.icon" :class="`mdi ${item.icon} me-1`"></i>
                <span
                  v-if="['list', 'view', 'edit'].includes($route.name)"
                  class="cursor-pointer"
                  data-bs-toggle="modal"
                  data-bs-target="#formInfoModal"
                >
                  {{ $t(item.title) }}
                </span>
                <span v-else>
                  {{ $t(item.title) }}
                </span>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <div v-if="['list', 'view', 'edit'].includes($route.name)" class="modal fade" id="formInfoModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header p-2 bg-light">
          <h5 class="modal-title">#{{ form.id }} {{ form.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-0">
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span class="fw-medium">{{ $t('layout.breadcrumb.formInfoModal.creation') }}</span>
              <span class="badge bg-primary">
                {{ getUserInfo(form.created_by).fullname }} @
                {{ $moment(form.created_at).format('llll') }}
              </span>
            </li>
            <li
              v-if="form.updated_by"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span class="fw-medium">{{ $t('layout.breadcrumb.formInfoModal.lastUpdate') }}</span>
              <span class="badge bg-secondary">
                {{ getUserInfo(form.updated_by).fullname }} @
                {{ $moment(form.updated_at).format('llll') }}
              </span>
            </li>
            <li
              v-if="form.flow?.length"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span class="fw-medium">{{ $t('layout.breadcrumb.formInfoModal.approval') }}</span>
              <span>
                <span v-for="(flow, index) in form.flow" :key="index">
                  <span class="badge bg-info">{{ flow.title }}</span>
                  <span v-if="index < form.flow.length - 1">&nbsp;>>&nbsp;</span>
                </span>
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span class="fw-medium">
                {{ $t('layout.breadcrumb.formInfoModal.totalRecords') }}
              </span>
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
                  <a class="nav-link p-2 active" data-bs-toggle="tab" href="#tab_form_columns">
                    {{ $t('layout.breadcrumb.formInfoModal.tab.columns') }}
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link p-2" data-bs-toggle="tab" href="#tab_form_logs">
                    {{ $t('layout.breadcrumb.formInfoModal.tab.logs') }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="card-body p-0">
              <div class="tab-content">
                <div class="tab-pane active" id="tab_form_columns">
                  <div
                    v-if="
                      columns.filter((column) => column.type && !column.component.includes('Basic'))
                        .length
                    "
                    data-simplebar
                    class="p-0"
                    style="height: 40vh"
                  >
                    <table
                      class="table table-hover table-striped table-bordered table-nowrap align-middle mb-0"
                    >
                      <thead class="table-light">
                        <tr>
                          <th class="text-capitalize">id</th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.component') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.name') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.alias') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.type') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.length') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.tags') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.default') }}
                          </th>
                          <th class="text-capitalize">
                            {{ $t('layout.breadcrumb.formInfoModal.tab.columns.source') }}
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
                                `layout.breadcrumb.formInfoModal.tab.columns.component.${column.component}`,
                              )
                            }}
                          </td>
                          <td style="max-width: 200px" class="text-truncate" :title="column.name">
                            {{ column.name }}
                          </td>
                          <td>
                            <span class="badge bg-secondary">{{ column.alias }}</span>
                          </td>
                          <td>{{ column.type }}</td>
                          <td>{{ column.length }}</td>
                          <td>
                            <span class="badge bg-info me-1" v-for="tag in column.tags" :key="tag">
                              {{ tag }}
                            </span>
                          </td>
                          <td>{{ column.default }}</td>
                          <td>{{ column.cfg?.source }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Empty v-else :text="$t('layout.breadcrumb.formInfoModal.tab.columns.empty')" />
                </div>
                <div class="tab-pane" id="tab_form_logs">
                  <Log :key="$route.path" type="form" :tid="Number($route.params.tid)" />
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
import { ref, computed } from 'vue';
import {
  useRouter,
  getListPath,
  getParentsById,
  getUserInfo,
  generateFlowByCurrentUser,
} from '@utils';
import store from '@store';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getDataForm } from '@api/data';
import Empty from '@components/Empty';
import Log from '@components/Log';
export default {
  components: {
    Empty,
    Log,
  },
  setup() {
    const title = ref('');
    const items = ref([]);
    const { route } = useRouter();
    const path = getListPath(route.value.path);
    const page = store.state.user.forms.find((item) => item.route && item.route.path == path);
    if (page) {
      title.value = page.title;
      items.value = getParentsById(store.state.user.forms, page.id);
    } else {
      title.value = route.value?.meta?.title || '';
      items.value = route.value?.meta?.items || [];
    }

    const toast = useToast();
    const form = ref({});
    const columns = ref([]);
    const records = ref({});

    const fetchDataForm = async () => {
      const { code, data, msg } = await getDataForm({ tid: Number(route.value.params.tid) });
      if (code === 200) {
        form.value = data.form;
        form.value.flow = form.value.flow.length
          ? generateFlowByCurrentUser(form.value.flow)
          : null;
        columns.value = data.columns;
        records.value = data.records;
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

    if (['list', 'view', 'edit'].includes(route.value.name)) fetchDataForm();

    return {
      title,
      items,
      form,
      columns,
      records,
      getUserInfo,
      resolveDataStateVariant,
    };
  },
};
</script>
