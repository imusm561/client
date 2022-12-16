<template>
  <div id="logs">
    <div v-if="logs.length">
      <div data-simplebar style="height: 40vh; overflow-x: hidden" @scroll="foo">
        <div class="timeline p-3">
          <div class="item pb-3 d-flex" v-for="log in logs" :key="log.id">
            <div class="flex-shrink-0">
              <Avatar :data="getUserInfo(log.created_by)" size="xs" />
            </div>
            <div class="flex-grow-1 ms-3">
              <span>
                <span class="d-block fw-medium">
                  {{ getUserInfo(log.created_by)?.fullname || log.created_by }}
                  <i
                    v-if="log.created_by != $store.state.user.data.username"
                    class="mdi mdi-chat-processing-outline text-muted cursor-pointer"
                    @click="$router.push({ name: 'chat', query: { contact: log.created_by } })"
                  />
                </span>
                <span class="d-block fs-12 text-muted">
                  {{ $moment(log.created_at).format('llll') }}
                  <span class="badge bg-soft-info text-info align-middle ms-2">{{ $moment(log.created_at).fromNow() }}</span>
                </span>
              </span>
              <code class="text-decoration-underline text-primary cursor-pointer" @click="handleViewLogData(log)">{{ log_types[log.type] }}</code>
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
    <Empty text="No Logs" v-else />
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
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { getUserInfo } from '@utils';
import Empty from '@components/Empty';
import Avatar from '@components/Avatar';
import MonacoEditor from '@components/MonacoEditor';
import { getLogs } from '@api/com/log';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import i18n from '@utils/i18n';
export default defineComponent({
  props: {
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
  },
  components: {
    Empty,
    Avatar,
    MonacoEditor,
  },
  setup(props) {
    const toast = useToast();
    const logs = ref([]);
    const loading = ref({ enable: true, show: false });

    const fetchLogs = () => {
      return new Promise((resolve) => {
        loading.value.show = true;

        const params = { tid: props.tid, rid: props.rid, limit: props.limit };
        if (logs.value.length) params.lid = logs.value[logs.value.length - 1].id;

        getLogs(params).then(({ code, data, msg }) => {
          if (code === 200) {
            logs.value = [...logs.value, ...data];
            loading.value.show = false;
            if (data.length != props.limit) loading.value.enable = false;
            resolve();
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
      });
    };

    onMounted(() => {
      fetchLogs().then(() => {
        setTimeout(() => {
          const logsList = document.getElementById('logs')?.querySelector('.simplebar-content-wrapper');
          if (logsList) {
            logsList.addEventListener('scroll', () => {
              if (logsList.scrollHeight - (logsList.scrollTop + logsList.offsetHeight) < 2 && loading.value.enable && !loading.value.show) {
                fetchLogs();
              }
            });
          }
        }, 10);
      });
    });

    onUnmounted(() => {
      const logsList = document.getElementById('logs')?.querySelector('.simplebar-content-wrapper');
      if (logsList) logsList.removeEventListener('scroll', () => {});
    });

    const current_log = ref({});
    const handleViewLogData = (log) => {
      current_log.value = log;
      document.getElementById('showLogDataOffcanvasBtn').click();
    };

    return {
      getUserInfo,
      loading,
      log_types: {
        10: i18n.global.t('components.log.type.createForm'),
        11: i18n.global.t('components.log.type.updateForm'),
        12: i18n.global.t('components.log.type.backupForm'),
        13: i18n.global.t('components.log.type.truncateForm'),
        20: i18n.global.t('components.log.type.createColumns'),
        21: i18n.global.t('components.log.type.updateColumns'),
        30: i18n.global.t('components.log.type.createData'),
        31: i18n.global.t('components.log.type.importData'),
        32: i18n.global.t('components.log.type.viewData'),
        33: i18n.global.t('components.log.type.updateData'),
        34: i18n.global.t('components.log.type.batchUpdate'),
        35: i18n.global.t('components.log.type.deleteData'),
      },
      logs,
      current_log,
      handleViewLogData,
    };
  },
});
</script>
