<template>
  <div>
    <Breadcrumb :key="$route" />

    <div class="card">
      <div class="card-body d-block d-md-none">
        <VueSelect
          v-model="search_user"
          :placeholder="$t('layout.navbar.helper.log.filter.user')"
          :reduce="(item) => item.username"
          label="fullname"
          :options="$store.state.org.users"
        >
          <template #option="data">
            <div class="d-flex align-items-center">
              <Avatar :data="data" size="xxs" />
              <span class="ml-50 align-middle ms-1">{{ data.fullname }}</span>
            </div>
          </template>

          <template #selected-option="data">
            <div class="d-flex align-items-center">
              <Avatar :data="data" size="xxs" />
              <span class="ml-50 align-middle ms-1">{{ data.fullname }}</span>
            </div>
          </template>

          <template v-slot:no-options="{ search, searching }">
            <template v-if="searching">
              <span v-html="$t('components.vs.search', { search })"></span>
            </template>
            <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUser') }}</em>
          </template>
        </VueSelect>
      </div>
      <div class="card-body justify-content-between d-none d-md-flex">
        <div class="w-25">
          <VueSelect
            v-model="search_user"
            :placeholder="$t('layout.navbar.helper.log.filter.user')"
            :reduce="(item) => item.username"
            label="fullname"
            :options="$store.state.org.users"
          >
            <template #option="data">
              <div class="d-flex align-items-center">
                <Avatar :data="data" size="xxs" />
                <span class="ml-50 align-middle ms-1">{{ data.fullname }}</span>
              </div>
            </template>

            <template #selected-option="data">
              <div class="d-flex align-items-center">
                <Avatar :data="data" size="xxs" />
                <span class="ml-50 align-middle ms-1">{{ data.fullname }}</span>
              </div>
            </template>

            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <span v-html="$t('components.vs.search', { search })"></span>
              </template>
              <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUser') }}</em>
            </template>
          </VueSelect>
        </div>
        <div class="w-25">
          <VueSelect
            v-model="search_url"
            :placeholder="$t('layout.navbar.helper.log.filter.url')"
            :reduce="(item) => item.url"
            label="url"
            :options="urls"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <span v-html="$t('components.vs.search', { search })"></span>
              </template>
              <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUrl') }}</em>
            </template>
          </VueSelect>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="logs.length" class="card-body pb-0">
        <div class="table-responsive table-card">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="text-capitalize" style="white-space: nowrap">ID</th>
                <th class="text-capitalize" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.log.user') }}
                </th>
                <th class="text-capitalize" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.log.createdAt') }}
                </th>
                <th class="text-capitalize" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.log.device') }}
                </th>
                <th class="text-capitalize" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.log.os') }}
                </th>
                <th class="text-capitalize" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.log.browser') }}
                </th>
                <th class="text-capitalize" style="white-space: nowrap">
                  {{ $t('layout.navbar.helper.log.data') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td style="white-space: nowrap">#{{ log.id }}</td>
                <td style="white-space: nowrap">
                  <div class="d-flex align-items-center">
                    <Avatar :data="getUserInfo(log.created_by)" />
                    <span class="d-flex flex-column ms-1">
                      <span class="fs-14">{{ getUserInfo(log.created_by).fullname }}</span>
                      <span class="fs-10 text-muted">{{ getUserInfo(log.created_by).post }}</span>
                    </span>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex align-items-center">
                    <i class="fs-32 mb-n2 mt-n2 mdi mdi-calendar-clock text-primary" />
                    <span class="d-flex flex-column ms-1">
                      <span class="fs-14">{{ moment(log.created_at).format('ll') }}</span>
                      <span class="fs-10">
                        {{ moment(log.created_at).format('LTS') }}
                      </span>
                    </span>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex align-items-center">
                    <i
                      class="fs-32 mb-n2 mt-n2 mdi"
                      :class="resolveDeviceIcon(uaParser(log.agent).device.type || 'desktop')"
                    />
                    <span class="d-flex flex-column ms-1">
                      <span class="fs-14 text-capitalize">
                        {{ uaParser(log.agent).device.type || 'desktop' }}
                      </span>
                      <span class="fs-10">
                        {{ uaParser(log.agent).device.vendor }}
                        {{ uaParser(log.agent).device.model }}
                        {{ uaParser(log.agent).cpu.architecture }}
                      </span>
                    </span>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex align-items-center">
                    <i
                      class="fs-32 mb-n2 mt-n2 mdi"
                      :class="reslovOsIcon(uaParser(log.agent).os.name)"
                    />
                    <span class="d-flex flex-column ms-1">
                      <span class="fs-14 text-capitalize">
                        {{ uaParser(log.agent).os.name }}
                      </span>
                      <span class="fs-10">
                        {{ uaParser(log.agent).os.version }}
                      </span>
                    </span>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex align-items-center">
                    <i
                      class="fs-32 mb-n2 mt-n2 mdi"
                      :class="resolveBrowserIcon(uaParser(log.agent).browser.name)"
                    />
                    <span class="d-flex flex-column ms-1">
                      <span class="fs-14">
                        {{ uaParser(log.agent).browser.name }}
                      </span>
                      <span class="fs-10">
                        {{ uaParser(log.agent).browser.version }}
                      </span>
                    </span>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex align-items-center">
                    <i
                      class="fs-32 mb-n2 mt-n2 mdi"
                      :class="
                        log.method === 'POST'
                          ? 'text-warning mdi-file-upload'
                          : 'text-info mdi-file-download'
                      "
                    />
                    <span class="d-flex flex-column ms-1">
                      <span
                        class="fs-14 cursor-pointer text-secondary text-decoration-underline"
                        @click="handleViewLogData(log)"
                      >
                        {{ log.url }}
                      </span>
                      <span class="fs-10">
                        <span
                          class="badge text-uppercase"
                          :class="{
                            'badge-soft-warning': log.method === 'POST',
                            'badge-soft-info': log.method === 'GET',
                          }"
                        >
                          {{ log.method }}
                        </span>
                        {{ log?.ip?.replace('::ffff:', '') }}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pb-2 pt-4">
          <Pagination
            :total="pagination.totalCount"
            :page-num="pagination.pageNum"
            :page-size="pagination.pageSize"
            @changed="handlePaginationChange"
          />
        </div>
      </div>
      <Empty :text="$t('components.log.empty')" v-else />
    </div>

    <button
      id="showLogDataOffcanvasBtn"
      class="d-none"
      data-bs-toggle="offcanvas"
      data-bs-target="#logDataOffcanvas"
    />
    <div class="offcanvas offcanvas-end w-resp" id="logDataOffcanvas">
      <div class="offcanvas-body p-0 overflow-hidden">
        <i
          class="i-close mdi mdi-close-box fs-24 text-muted cursor-pointer"
          data-bs-dismiss="offcanvas"
        />
        <MonacoEditor
          :key="current_log.id"
          v-model="current_log.data"
          language="json"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import uaParser from 'ua-parser-js';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getUserInfo } from '@utils';
import moment from '@utils/moment';
import { socket } from '@utils/socket';

import Breadcrumb from '@layouts/breadcrumb';
import Pagination from '@components/Pagination';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
import MonacoEditor from '@components/MonacoEditor';

import { getSysUrl, getSysLog } from '@api/sys';

const toast = useToast();

const urls = ref([]);
const logs = ref([]);

const search_user = ref(null);
const search_url = ref(null);

const pagination = reactive({
  pageNum: 1,
  pageSize: 200,
  totalCount: 0,
});

const handlePaginationChange = ({ pageNum, pageSize }) => {
  pagination.pageNum = pageNum;
  pagination.pageSize = pageSize;
  fetchLogs();
};

const refetchLogsHandler = () => {
  pagination.pageNum = 1;
  fetchLogs();
};

onMounted(() => {
  fetchLogs();
  socket.on('refetchLogs', refetchLogsHandler);
});

onUnmounted(() => {
  socket.off('refetchLogs', refetchLogsHandler);
});

watch(
  () => search_user.value,
  (newVal, oldVal) => {
    if (oldVal !== undefined) {
      pagination.pageNum = 1;
      fetchLogs();
    }
  },
  { immediate: true },
);

watch(
  () => search_url.value,
  (newVal, oldVal) => {
    if (oldVal !== undefined) {
      pagination.pageNum = 1;
      fetchLogs();
    }
  },
  { immediate: true },
);

const fetchLogs = () => {
  getSysUrl().then(({ code, data, msg }) => {
    if (code === 200) {
      urls.value = data;
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
  getSysLog({
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    user: search_user.value || '',
    url: search_url.value || '',
  }).then(({ code, data, msg }) => {
    if (code === 200) {
      logs.value = data.rows;
      pagination.totalCount = data.count;
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

const resolveBrowserIcon = computed(() => {
  return (browser) => {
    if (browser.toLowerCase().includes('chrome')) return 'mdi-google-chrome';
    else if (browser.toLowerCase().includes('edge')) return 'mdi-microsoft-edge';
    else if (browser.toLowerCase().includes('safari')) return 'mdi-apple-safari';
    else if (browser.toLowerCase().includes('firefox')) return 'mdi-firefox';
    else if (browser.toLowerCase().includes('ie')) return 'mdi-microsoft-internet-explorer';
    else if (browser.toLowerCase().includes('opera')) return 'mdi-opera';
    else return 'mdi-web';
  };
});

const reslovOsIcon = computed(() => {
  return (os) => {
    if (os.toLowerCase().includes('android')) return 'mdi-android';
    else if (os.toLowerCase().includes('debian')) return 'mdi-debian';
    else if (os.toLowerCase().includes('ios')) return 'mdi-apple-ios';
    else if (os.toLowerCase().includes('linux')) return 'mdi-linux';
    else if (os.toLowerCase().includes('mint')) return 'mdi-linux-mint';
    else if (os.toLowerCase().includes('mac')) return 'mdi-apple';
    else if (os.toLowerCase().includes('nintendo')) return 'mdi-nintendo-switch';
    else if (os.toLowerCase().includes('playstation')) return 'mdi-sony-playstation';
    else if (os.toLowerCase().includes('ubuntu')) return 'mdi-ubuntu';
    else if (os.toLowerCase().includes('centos')) return 'mdi-centos';
    else if (os.toLowerCase().includes('windows')) return 'mdi-microsoft-windows';
    else return 'mdi-microsoft-windows';
  };
});

const resolveDeviceIcon = computed(() => {
  return (type) => {
    if (type.toLowerCase().includes('mobile')) return 'mdi-cellphone';
    else if (type.toLowerCase().includes('safari')) return 'mdi-tablet';
    else return 'mdi-desktop-mac';
  };
});

const current_log = ref({});
const handleViewLogData = (log) => {
  current_log.value = log;
  document.getElementById('showLogDataOffcanvasBtn').click();
};
</script>
