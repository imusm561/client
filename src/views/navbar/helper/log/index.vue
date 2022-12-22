<template>
  <div>
    <Breadcrumb :key="$route" />

    <div class="card">
      <div class="card-body d-block d-md-none">
        <VueSelect v-model="search_user" :placeholder="$t('layout.navbar.helper.log.filter.user')" :reduce="(item) => item.username" label="fullname" :options="$store.state.org.users">
          <template #option="data">
            <div class="d-flex align-items-center">
              <Avatar class="me-2" :data="data" size="xxs" />
              <span class="ml-50 align-middle">{{ data.fullname }}</span>
            </div>
          </template>

          <template #selected-option="data">
            <div class="d-flex align-items-center">
              <Avatar class="me-2" :data="data" size="xxs" />
              <span class="ml-50 align-middle">{{ data.fullname }}</span>
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
          <VueSelect v-model="search_user" :placeholder="$t('layout.navbar.helper.log.filter.user')" :reduce="(item) => item.username" label="fullname" :options="$store.state.org.users">
            <template #option="data">
              <div class="d-flex align-items-center">
                <Avatar class="me-2" :data="data" size="xxs" />
                <span class="ml-50 align-middle">{{ data.fullname }}</span>
              </div>
            </template>

            <template #selected-option="data">
              <div class="d-flex align-items-center">
                <Avatar class="me-2" :data="data" size="xxs" />
                <span class="ml-50 align-middle">{{ data.fullname }}</span>
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
          <VueSelect v-model="search_url" :placeholder="$t('layout.navbar.helper.log.filter.url')" :reduce="(item) => item.url" label="url" :options="urls">
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
                <th class="text-capitalize" style="white-space: nowrap">id</th>
                <th class="text-capitalize" style="white-space: nowrap">{{ $t('layout.navbar.helper.log.user') }}</th>
                <th class="text-capitalize" style="white-space: nowrap">{{ $t('layout.navbar.helper.log.createdAt') }}</th>
                <th class="text-capitalize" style="white-space: nowrap">{{ $t('layout.navbar.helper.log.device') }}</th>
                <th class="text-capitalize" style="white-space: nowrap">{{ $t('layout.navbar.helper.log.os') }}</th>
                <th class="text-capitalize" style="white-space: nowrap">{{ $t('layout.navbar.helper.log.browser') }}</th>
                <th class="text-capitalize" style="white-space: nowrap">{{ $t('layout.navbar.helper.log.data') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td style="white-space: nowrap">#{{ log.id }}</td>
                <td style="white-space: nowrap">
                  <div class="d-flex gap-2 align-items-center">
                    <div>
                      <Avatar :data="getUserInfo(log.created_by)" />
                    </div>
                    <div>
                      <div>{{ getUserInfo(log.created_by)?.fullname || log.created_by }}</div>
                      <small>{{ log.created_by }}</small>
                    </div>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex gap-2 align-items-center">
                    <i class="fs-32 mb-n2 mt-n2 mdi mdi-calendar-clock text-primary" />
                    <div>
                      <div>{{ $moment(log.created_at).format('ll') }}</div>
                      <small>{{ $moment(log.created_at).format('LTS') }}</small>
                    </div>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex gap-2 align-items-center">
                    <i class="fs-32 mb-n2 mt-n2 mdi" :class="resolveDeviceIcon(uaParser(log.agent).device.type || 'desktop')" />
                    <div>
                      <div class="text-capitalize">{{ uaParser(log.agent).device.type || 'desktop' }}</div>
                      <small>{{ uaParser(log.agent).device.vendor }} {{ uaParser(log.agent).device.model }} {{ uaParser(log.agent).cpu.architecture }}</small>
                    </div>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex gap-2 align-items-center">
                    <i class="fs-32 mb-n2 mt-n2 mdi" :class="reslovOsIcon(uaParser(log.agent).os.name)" />
                    <div>
                      <div class="text-capitalize">{{ uaParser(log.agent).os.name }}</div>
                      <small>{{ uaParser(log.agent).os.version }}</small>
                    </div>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex gap-2 align-items-center">
                    <i class="fs-32 mb-n2 mt-n2 mdi" :class="resolveBrowserIcon(uaParser(log.agent).browser.name)" />
                    <div>
                      <div>{{ uaParser(log.agent).browser.name }}</div>
                      <small>v{{ uaParser(log.agent).browser.version }}</small>
                    </div>
                  </div>
                </td>
                <td style="white-space: nowrap">
                  <div class="d-flex gap-2 align-items-center">
                    <i class="fs-32 mb-n2 mt-n2 mdi" :class="log.method === 'POST' ? 'text-warning mdi-file-upload' : 'text-info mdi-file-download'" />
                    <div>
                      <div class="cursor-pointer text-secondary text-decoration-underline" @click="handleViewLogData(log)">{{ log.url }}</div>
                      <small>
                        <span
                          class="badge text-uppercase"
                          :class="{
                            'badge-soft-warning': log.method === 'POST',
                            'badge-soft-info': log.method === 'GET',
                          }"
                        >
                          {{ log.method }}
                        </span>
                        {{ log.ip.replace('::ffff:', '') }}
                      </small>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pb-2 pt-4">
          <Pagination :total="pagination.totalCount" :page-num="pagination.pageNum" :page-size="pagination.pageSize" @changed="handlePaginationChange" />
        </div>
      </div>
      <Empty :text="$t('components.log.empty')" v-else />
    </div>

    <button id="showLogDataOffcanvasBtn" class="d-none" data-bs-toggle="offcanvas" data-bs-target="#logDataOffcanvas" />
    <div class="offcanvas form offcanvas-end w-50" id="logDataOffcanvas">
      <div class="offcanvas-body p-0 overflow-hidden">
        <i class="cursor-pointer d-md-none fs-36 mdi mdi-exit-to-app position-absolute" style="z-index: 1; right: 10px; bottom: 0" data-bs-dismiss="offcanvas" />
        <MonacoEditor
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

<script>
import Breadcrumb from '@/layouts/breadcrumb';
import Pagination from '@components/Pagination';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
import MonacoEditor from '@components/MonacoEditor';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { getSysUrl, getSysLog } from '@api/sys';
import { useSocket, getUserInfo } from '@utils';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import uaParser from 'ua-parser-js';

export default {
  components: {
    Breadcrumb,
    Pagination,
    Avatar,
    Empty,
    MonacoEditor,
  },
  setup() {
    const toast = useToast();
    const socket = useSocket();

    const urls = ref([]);
    const logs = ref([]);

    const search_user = ref(null);
    const search_url = ref(null);

    const pagination = ref({
      pageNum: 1,
      pageSize: 200,
      totalCount: 0,
    });

    const handlePaginationChange = ({ pageNum, pageSize }) => {
      pagination.value.pageNum = pageNum;
      pagination.value.pageSize = pageSize;
      fetchLogs();
    };

    onMounted(() => {
      fetchLogs();
      watch(
        () => search_user.value,
        (newVal, oldVal) => {
          if (oldVal !== undefined) {
            pagination.value.pageNum = 1;
            fetchLogs();
          }
        },
        { immediate: true },
      );

      watch(
        () => search_url.value,
        (newVal, oldVal) => {
          if (oldVal !== undefined) {
            pagination.value.pageNum = 1;
            fetchLogs();
          }
        },
        { immediate: true },
      );

      socket.on('refetchLogs', () => {
        pagination.value.pageNum = 1;
        fetchLogs();
      });
    });

    onUnmounted(() => {
      socket.removeListener('refetchLogs');
    });

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
      getSysLog({ pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize, user: search_user.value || '', url: search_url.value || '' }).then(({ code, data, msg }) => {
        if (code === 200) {
          logs.value = data.rows;
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

    return {
      urls,
      logs,

      search_user,
      search_url,

      pagination,
      handlePaginationChange,

      getUserInfo,
      uaParser,
      resolveBrowserIcon,
      reslovOsIcon,
      resolveDeviceIcon,
      current_log,
      handleViewLogData,
    };
  },
};
</script>
