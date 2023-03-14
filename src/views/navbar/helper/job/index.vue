<template>
  <div>
    <Breadcrumb :key="$route" />

    <div class="card">
      <div class="card-body d-md-none d-flex justify-content-between">
        <div class="search-box w-75">
          <input
            v-model="search_keyword"
            type="text"
            class="form-control search"
            :placeholder="$t('layout.navbar.helper.job.search')"
          />
          <i class="mdi mdi-magnify fs-16 search-icon"></i>
        </div>
        <button class="btn btn-primary ms-3 text-nowrap" @click="handleCreateJob">
          {{ $t('layout.navbar.helper.job.create') }}
        </button>
      </div>
      <div class="card-body d-none d-md-flex justify-content-between">
        <div class="w-25">
          <VueSelect
            v-model="search_status"
            multiple
            :close-on-select="false"
            :placeholder="$t('layout.navbar.helper.job.filter')"
            :reduce="(item) => item.value"
            label="text"
            :options="statusOptions"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <span v-html="$t('components.vs.search', { search })"></span>
              </template>
              <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
            </template>
          </VueSelect>
        </div>
        <div class="d-flex">
          <div class="search-box w-100">
            <input
              v-model="search_keyword"
              type="text"
              class="form-control search"
              :placeholder="$t('layout.navbar.helper.job.search')"
            />
            <i class="mdi mdi-magnify fs-16 search-icon"></i>
          </div>
          <button class="btn btn-primary ms-3 text-nowrap" @click="handleCreateJob">
            {{ $t('layout.navbar.helper.job.create') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="jobs.length" class="row">
      <div
        class="col-xl-3 col-md-4 col-sm-6"
        v-for="(job, index) in jobs.filter(
          (job) =>
            (job.title.toLowerCase().includes(search_keyword.toLowerCase()) ||
              job.rule.includes(search_keyword)) &&
            (search_status.length === 0 || search_status.includes(resolveJobStatus(job).value)),
        )"
        :key="index"
      >
        <div class="card card-height-100">
          <div class="card-body" :class="resolveJobStatus(job).card">
            <div class="d-flex flex-column h-100">
              <div class="d-flex mb-2">
                <h6
                  class="fs-15 mb-0 flex-grow-1 text-truncate cursor-pointer"
                  :title="`#${job.id}`"
                  @click="$router.push({ name: 'jobDetail', params: { id: job.id } })"
                >
                  {{ job.title }}
                </h6>
                <a class="text-muted cursor-pointer ms-2" @click="handleEditJob(job)">
                  <i class="mdi mdi-square-edit-outline text-info"></i>
                </a>
                <a class="text-muted cursor-pointer ms-2" @click="handleDelJob(job)">
                  <i class="mdi mdi-delete-outline text-danger"></i>
                </a>
              </div>
              <p class="text-muted text-truncate-five-lines">{{ replaceHtml(job.description) }}</p>
              <div class="mb-3">
                <div class="d-flex mb-1">
                  <div class="flex-grow-1">
                    <h6 class="text-muted mb-0">
                      <span class="text-secondary" :title="job.start">
                        {{ $moment(job.start).fromNow() }}
                      </span>
                    </h6>
                  </div>
                  <div class="flex-shrink-0">
                    <span class="text-secondary" :title="job.end">
                      {{ $moment(job.end).fromNow() }}
                    </span>
                  </div>
                </div>
                <div class="progress rounded-3 progress-sm">
                  <div
                    class="progress-bar bg-secondary"
                    :style="{
                      width: `${
                        (($moment().valueOf() - $moment(job.start).valueOf()) /
                          ($moment(job.end).valueOf() - $moment(job.start).valueOf())) *
                        100
                      }%`,
                    }"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <div v-if="job.tags?.length">
                <span
                  class="badge badge-soft-primary me-1"
                  v-for="(tag, index) in job.tags"
                  :key="`${tag}_${index}`"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <div class="card-footer border-top-dashed" :class="resolveJobStatus(job).card">
            <div class="d-flex">
              <div class="flex-grow-1">
                <span class="badge text-uppercase" :class="resolveJobStatus(job).badge">
                  {{ resolveJobStatus(job).text }}
                </span>
              </div>
              <div class="flex-shrink-0">
                <div class="text-primary">
                  {{ job.rule }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Empty :text="$t('layout.navbar.helper.job.empty')" v-else />
    <EditJobModal :current-job="current_job" @submit="fetchJobs()" />
    <DeleteJobModal :current-job="current_job" @confirm="fetchJobs()" />
  </div>
</template>

<script>
import Breadcrumb from '@/layouts/breadcrumb';
import EditJobModal from './components/EditJobModal';
import DeleteJobModal from './components/DeleteJobModal';
import Empty from '@components/Empty';
import { ref, onMounted, onUnmounted } from 'vue';
import { getJobs } from '@api/job';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import useJob from './useJob';
import { replaceHtml } from '@utils';

export default {
  components: {
    Breadcrumb,
    EditJobModal,
    DeleteJobModal,
    Empty,
  },
  setup() {
    const toast = useToast();
    const moment = window.moment;
    const socket = window.socket;

    onMounted(() => {
      fetchJobs();
      socket.on('refetchJobs', () => {
        fetchJobs();
      });
    });

    onUnmounted(() => {
      socket.removeListener('refetchJobs');
    });

    const jobs = ref([]);
    const fetchJobs = () => {
      getJobs().then(({ code, data, msg }) => {
        if (code === 200) {
          jobs.value = data;
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

    const { resolveJobStatus, statusOptions } = useJob();

    const search_keyword = ref('');
    const search_status = ref([]);

    const current_job = ref({});

    const handleCreateJob = () => {
      const job = {
        key: Math.random().toString(36).slice(-6),
        title: '',
        status: 1,
        rule: '0 0 * * * *',
        description: '',
        start: moment().format('YYYY-MM-DD HH:mm:ss'),
        end: moment().add(7, 'd').format('YYYY-MM-DD HH:mm:ss'),
        tags: [],
        config:
          '{\n  "executor": "axios",\n  "config": {\n    "url": "...",\n    "method": "GET"\n  }\n}',
      };
      current_job.value = job;
      current_job.value.duration = [
        moment(job.start).format('YYYY-MM-DD HH:mm:ss'),
        moment(job.end).format('YYYY-MM-DD HH:mm:ss'),
      ];
      setTimeout(() => {
        document.getElementById('showEditJobModalBtn').click();
      }, 10);
    };

    const handleEditJob = (job) => {
      current_job.value = JSON.parse(JSON.stringify(job));
      current_job.value.duration = [
        moment(job.start).format('YYYY-MM-DD HH:mm:ss'),
        moment(job.end).format('YYYY-MM-DD HH:mm:ss'),
      ];
      current_job.value.key = Math.random().toString(36).slice(-6);
      setTimeout(() => {
        document.getElementById('showEditJobModalBtn').click();
      }, 10);
    };

    const handleDelJob = (job) => {
      current_job.value = JSON.parse(JSON.stringify(job));
      document.getElementById('showDeleteJobModalBtn').click();
    };
    return {
      replaceHtml,

      jobs,
      fetchJobs,

      resolveJobStatus,
      statusOptions,

      search_keyword,
      search_status,

      current_job,
      handleCreateJob,
      handleEditJob,
      handleDelJob,
    };
  },
};
</script>
