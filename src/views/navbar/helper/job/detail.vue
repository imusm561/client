<template>
  <div v-if="job.id">
    <Breadcrumb :key="$route" />
    <div class="row">
      <div class="col-xl-7">
        <div class="card card-height-100">
          <div class="card-body">
            <div class="align-items-center d-flex justify-content-between">
              <h5>{{ $t('layout.navbar.helper.job.detail.header') }}</h5>
              <div>
                <button
                  class="btn btn-sm p-0 ms-2"
                  :disabled="isJobExecuting"
                  @click="handleExecuteJob"
                >
                  <i
                    class="fs-16 mdi text-warning"
                    :class="isJobExecuting ? 'mdi-spin mdi-loading' : 'mdi-motion-play-outline'"
                  ></i>
                </button>
                <button class="btn btn-sm p-0 ms-2" @click="handleEditJob">
                  <i class="fs-16 mdi mdi-square-edit-outline text-info"></i>
                </button>
                <button class="btn btn-sm p-0 ms-2" @click="handleDelJob">
                  <i class="fs-16 mdi mdi-trash-can-outline text-danger"></i>
                </button>
              </div>
            </div>
            <div class="pt-2 border-top border-top">
              <div class="row">
                <div class="col-lg-5">
                  <dl class="row mb-1">
                    <dt class="col-sm-4 text-uppercase">id</dt>
                    <dd class="col-sm-8 mb-3">#{{ job.id }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.title') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ job.title }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.rule') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ job.rule }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.start') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ job.start }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.end') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">{{ job.end }}</dd>
                    <dt class="col-sm-4 text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.status') }}
                    </dt>
                    <dd class="col-sm-8 mb-3">
                      <span class="badge text-uppercase badge-soft-primary">
                        {{ $t(resolveJobStatus(job).text) }}
                      </span>
                    </dd>
                  </dl>
                </div>
                <div class="col-lg-7">
                  <div class="text-muted">
                    <h6 class="mb-1 fw-semibold text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.description') }}
                    </h6>
                    <div class="ck ck-content" v-html="job.description"></div>
                  </div>
                </div>
                <div class="col-12 mt-0" v-if="job.tags.length">
                  <div class="pt-3 border-top border-top-dashed">
                    <h6 class="mb-1 fw-semibold text-uppercase">
                      {{ $t('layout.navbar.helper.job.detail.tags') }}
                    </h6>
                    <div class="hstack flex-wrap gap-2 fs-15">
                      <div
                        class="badge fw-medium badge-soft-info"
                        v-for="tag in job.tags"
                        :key="tag"
                      >
                        {{ tag }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-5">
        <div class="card card-height-100">
          <div class="card-body">
            <h5>{{ $t('layout.navbar.helper.job.detail.config') }}</h5>
            <MonacoEditor
              :key="job.id"
              v-model="job.config"
              :options="{
                readOnly: true,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: !$route.query.tab || $route.query.tab === 'log' }"
              data-bs-toggle="tab"
              href="#tab_log"
            >
              {{ $t('layout.navbar.helper.job.detail.logs') }}
              <small v-if="pagination.totalCount">({{ pagination.totalCount }})</small>
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.query.tab === 'comment' }"
              data-bs-toggle="tab"
              href="#tab_comment"
            >
              {{ $t('layout.navbar.helper.job.detail.comments') }}
              <small v-if="comments.length">({{ comments.length }})</small>
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <div
            class="tab-pane"
            :class="{ active: !$route.query.tab || $route.query.tab === 'log' }"
            id="tab_log"
          >
            <div v-if="logs.length">
              <apexchart
                :key="chart.key"
                height="300"
                :series="chart.series"
                :options="chart.options"
              ></apexchart>
              <div class="table-responsive" data-simplebar style="max-height: 40vh">
                <table class="table align-middle table-striped mb-0 table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="text-capitalize" style="white-space: nowrap">ID</th>
                      <th class="text-capitalize" style="white-space: nowrap">UUID</th>
                      <th class="text-capitalize" style="white-space: nowrap">
                        {{ $t('layout.navbar.helper.job.detail.logs.executor') }}
                      </th>
                      <th class="text-capitalize" style="white-space: nowrap">
                        {{ $t('layout.navbar.helper.job.detail.logs.executedAt') }}
                      </th>
                      <th class="text-capitalize" style="white-space: nowrap">
                        {{ $t('layout.navbar.helper.job.detail.logs.timeConsuming') }}
                      </th>
                      <th class="text-capitalize" style="white-space: nowrap">
                        {{ $t('layout.navbar.helper.job.detail.logs.data') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in logs" :key="log.id">
                      <td style="white-space: nowrap">#{{ log.id }}</td>
                      <td style="white-space: nowrap">{{ log.uuid }}</td>
                      <td style="white-space: nowrap">
                        {{ getUserInfo(log.created_by).fullname }}
                      </td>
                      <td style="white-space: nowrap">
                        {{ dayjs(log.created_at).format('llll') }}
                      </td>
                      <td style="white-space: nowrap">{{ log.cost }}</td>
                      <td style="white-space: nowrap">
                        <span class="cursor-pointer" @click="handleViewJobData(log)">
                          <i class="mdi mdi-code-braces fs-16 text-info"></i>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-2">
                <Pagination
                  :total="pagination.totalCount"
                  :page-num="pagination.pageNum"
                  :page-size="pagination.pageSize"
                  @changed="handlePaginationChange"
                />
              </div>
            </div>
            <Empty :text="$t('layout.navbar.helper.job.detail.logs.empty')" v-else />
          </div>
          <div
            class="tab-pane"
            :class="{ active: $route.query.tab === 'comment' }"
            id="tab_comment"
          >
            <Comment
              :key="$route.path"
              :source="$route.path"
              :data="job"
              @fetch="($event) => (comments = $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <button
      id="showJobDataOffcanvasBtn"
      class="d-none"
      data-bs-toggle="offcanvas"
      data-bs-target="#jobDataOffcanvas"
    />
    <div class="offcanvas offcanvas-end w-resp" id="jobDataOffcanvas">
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

    <EditJobModal :current-job="temp_job" @submit="fetchJobInfo()" />
    <DeleteJobModal :current-job="temp_job" @confirm="$router.replace({ name: 'job' })" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { nanoid } from 'nanoid';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';

import { getChartColorsArray, getUserInfo } from '@utils';
import dayjs from '@utils/dayjs';
import { socket } from '@utils/socket';

import useJob from './useJob';

import Breadcrumb from '@layouts/breadcrumb';
import Pagination from '@components/Pagination';
import Empty from '@components/Empty';
import Comment from '@components/Comment';
import MonacoEditor from '@components/MonacoEditor';
import EditJobModal from './components/EditJobModal.vue';
import DeleteJobModal from './components/DeleteJobModal.vue';

import { getJobDetail, getJobLog, executeJob } from '@api/job';

const route = useRoute();
const toast = useToast();

const job = ref({});

const fetchJobInfo = () => {
  getJobDetail({ id: route.params.id }).then(({ code, data, msg }) => {
    if (code === 200) {
      job.value = data;
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

const isJobExecuting = ref(false);
const handleExecuteJob = () => {
  isJobExecuting.value = true;
  executeJob({ id: job.value.id }).then(({ code, msg }) => {
    if (code === 200) {
      pagination.pageNum = 1;
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: 'layout.navbar.helper.job.execute',
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
    setTimeout(() => {
      isJobExecuting.value = false;
    }, 500);
  });
};
const { resolveJobStatus } = useJob();

const pagination = reactive({
  pageNum: 1,
  pageSize: 200,
  totalCount: 0,
});

const handlePaginationChange = ({ pageNum, pageSize }) => {
  pagination.pageNum = pageNum;
  pagination.pageSize = pageSize;
  fetchJobLog();
};

const logs = ref([]);

const fetchJobLog = () => {
  getJobLog({
    id: route.params.id,
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
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

const current_log = ref({});
const handleViewJobData = (log) => {
  current_log.value = log;
  document.getElementById('showJobDataOffcanvasBtn').click();
};

const { VUE_APP_VARIABLE_PREFIX } = process.env;

const chart = reactive({
  key: null,
  series: [
    {
      name: 'Cost',
      data: [],
    },
  ],
  options: {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
        autoSelected: 'zoom',
      },
    },
    colors: getChartColorsArray(`["--${VUE_APP_VARIABLE_PREFIX}-success"]`),
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      categories: [],
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      min: 0,
      max: 0,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `${val}ms`;
        },
      },
    },
  },
});

watch(
  () => logs.value,
  (val) => {
    if (val && val.length) {
      chart.series[0].data = val.map((log) => {
        return log.cost;
      });
      chart.options.xaxis.categories = val.map((log) => {
        return log.created_at;
      });
      chart.options.yaxis.max =
        val
          .map((log) => {
            return log.cost;
          })
          .reduce((max, item) => {
            return max > item ? max : item;
          }) + 100;
    } else {
      chart.series[0].data = [];
      chart.options.xaxis.categories = [];
      chart.options.yaxis.max = 100;
    }
    chart.key = nanoid();
  },
  { immediate: true, deep: true },
);

const refetchJobInfoHandler = () => {
  fetchJobInfo();
};

const refetchJobLogHandler = () => {
  fetchJobLog();
};

onMounted(() => {
  fetchJobInfo();
  fetchJobLog();
  socket.on('refetchJobInfo', refetchJobInfoHandler);
  socket.on('refetchJobLog', refetchJobLogHandler);
});

onUnmounted(() => {
  socket.off('refetchJobInfo', refetchJobInfoHandler);
  socket.off('refetchJobLog', refetchJobLogHandler);
});

const temp_job = ref({});
const handleEditJob = () => {
  temp_job.value = JSON.parse(JSON.stringify(job.value));
  temp_job.value.duration = [
    dayjs(job.value.start).format('YYYY-MM-DD HH:mm:ss'),
    dayjs(job.value.end).format('YYYY-MM-DD HH:mm:ss'),
  ];
  temp_job.value.key = nanoid();
  nextTick(() => document.getElementById('showEditJobModalBtn').click());
};

const handleDelJob = () => {
  temp_job.value = JSON.parse(JSON.stringify(job.value));
  document.getElementById('showDeleteJobModalBtn').click();
};

const comments = ref([]);
</script>
