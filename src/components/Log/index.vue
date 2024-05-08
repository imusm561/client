<template>
  <div id="logs">
    <div v-if="logs.length">
      <div data-simplebar style="height: 40vh; overflow-x: hidden">
        <div class="timeline p-3">
          <div class="item pb-3 d-flex" v-for="log in logs" :key="log.id">
            <div class="flex-shrink-0">
              <Avatar :data="getUserInfo(log.created_by)" size="xs" />
            </div>
            <div class="flex-grow-1 ms-2">
              <span>
                <span class="d-block fw-medium">
                  {{ getUserInfo(log.created_by).fullname }}
                  <i
                    v-if="log.created_by != $store.state.user.data.username"
                    class="mdi mdi-chat-processing-outline text-muted cursor-pointer"
                    @click="$router.push({ name: 'chat', query: { contact: log.created_by } })"
                  />
                </span>
                <span class="d-block fs-12 text-muted">
                  {{ dayjs(log.created_at).format('llll') }}
                  <span class="badge bg-soft-info text-info align-middle ms-2">
                    {{ dayjs(log.created_at).fromNow() }}
                  </span>
                </span>
              </span>
              <span
                class="fs-12 text-decoration-underline text-primary cursor-pointer"
                @click="handleViewLogData(log)"
              >
                {{ $t(log_types[log.type]) }}
              </span>
            </div>
          </div>
          <div class="text-center" v-if="loading.enable && loading.show">
            <button class="btn text-info">
              <i class="mdi mdi-loading mdi-spin me-2"></i>
              {{ $t('components.log.loading') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Empty :text="$t('components.log.empty')" v-else />
    <button
      :id="`show${type}LogDataOffcanvasBtn`"
      class="d-none"
      data-bs-toggle="offcanvas"
      :data-bs-target="`#${type}logDataOffcanvas`"
    />
    <div class="offcanvas offcanvas-end w-resp" :id="`${type}logDataOffcanvas`">
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
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getUserInfo } from '@utils';
import dayjs from '@utils/dayjs';
import Empty from '@components/Empty';
import Avatar from '@components/Avatar';
import MonacoEditor from '@components/MonacoEditor';
import { getLogs } from '@api/com/log';
// eslint-disable-next-line
const props = defineProps({
  type: {
    type: String,
    default: () => '',
  },
  tid: {
    type: Number,
    default: () => 0,
    requried: true,
  },
  rid: {
    type: Number,
    default: () => 0,
    requried: true,
  },
  limit: {
    type: Number,
    default: () => 10,
  },
});

const log_types = {
  10: 'components.log.type.createForm',
  11: 'components.log.type.updateForm',
  12: 'components.log.type.backupForm',
  13: 'components.log.type.truncateForm',
  20: 'components.log.type.createColumns',
  21: 'components.log.type.updateColumns',
  30: 'components.log.type.createData',
  31: 'components.log.type.importData',
  32: 'components.log.type.viewData',
  33: 'components.log.type.updateData',
  34: 'components.log.type.batchUpdate',
  35: 'components.log.type.deleteData',
};

const toast = useToast();
const logs = ref([]);
const loading = reactive({ enable: true, show: false });

const fetchLogs = (callback) => {
  loading.show = true;

  const params = { tid: props.tid, rid: props.rid, limit: props.limit };
  if (logs.value.length) params.lid = logs.value[logs.value.length - 1].id;

  getLogs(params).then(({ code, data, msg }) => {
    if (code === 200) {
      logs.value = [...logs.value, ...data];
      loading.show = false;
      if (data.length != props.limit) loading.enable = false;
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
  });
};

const scrollHandler = () => {
  const logsList = document.getElementById('logs')?.querySelector('.simplebar-content-wrapper');
  if (
    logsList &&
    logsList.scrollHeight - (logsList.scrollTop + logsList.offsetHeight) < 2 &&
    loading.enable &&
    !loading.show
  ) {
    fetchLogs();
  }
};

onMounted(() => {
  fetchLogs(() => {
    setTimeout(() => {
      const logsList = document.getElementById('logs')?.querySelector('.simplebar-content-wrapper');
      if (logsList) logsList.addEventListener('scroll', scrollHandler);
    }, 100);
  });
});

onUnmounted(() => {
  const logsList = document.getElementById('logs')?.querySelector('.simplebar-content-wrapper');
  if (logsList) logsList.removeEventListener('scroll', scrollHandler);
});

const current_log = ref({});
const handleViewLogData = (log) => {
  current_log.value = log;
  document.getElementById(`show${props.type}LogDataOffcanvasBtn`).click();
};
</script>
