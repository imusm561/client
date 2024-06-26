<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="row">
      <div class="col-12">
        <div
          v-if="$store.state.user.data.weak"
          class="alert alert-danger alert-solid alert-label-icon d-flex align-items-center"
        >
          <i class="mdi mdi-alert-outline text-light me-2 fs-16 label-icon"></i>
          <div class="flex-grow-1 text-truncate">
            <span v-html="$t('home.changePassword')"></span>
          </div>
          <div class="flex-shrink-0">
            <router-link
              to="/user/setting?tab=change_password"
              class="text-reset text-decoration-underline"
            >
              <b>{{ $t('home.changePassword.change') }}</b>
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-body p-0">
            <div
              class="alert alert-info rounded-top alert-solid alert-label-icon border-0 rounded-0 m-0 d-flex align-items-center"
            >
              <i class="mdi mdi-clock-outline label-icon"></i>
              <div class="flex-grow-1 text-truncate">
                {{ dayjs().format('LLLL') }}
              </div>
            </div>
            <div class="row p-3 gap-3">
              <div class="col-md-12 col-lg-6">
                <div class="d-flex">
                  <Avatar :data="$store.state.user.data" size="md" />
                  <div class="ps-3">
                    <h3 class="mb-1 fw-bold">
                      {{ $t('home.hello') }}, {{ $store.state.user.data.fullname }}!
                    </h3>
                    <div class="mb-1 fs-14 fw-medium">
                      {{
                        $store.state.org.depts.find(
                          (dept) => dept.id === $store.state.user.data.dept,
                        )?.name
                      }}
                      | {{ $store.state.user.data.post }}
                    </div>
                    <p class="text-muted mb-0">{{ $t('home.message') }}</p>
                  </div>
                </div>
              </div>
              <div class="col">
                <calendar-heatmap
                  :values="activities"
                  :end-date="dayjs().format('YYYY-MM-DD')"
                  :max="100"
                  :tooltip-unit="$t('home.heatmap.tooltipUnit')"
                  :no-data-text="false"
                  :range-color="heatmapRangeColor"
                  :locale="{
                    months: [
                      $t('home.heatmap.locale.months.jan'),
                      $t('home.heatmap.locale.months.feb'),
                      $t('home.heatmap.locale.months.mar'),
                      $t('home.heatmap.locale.months.apr'),
                      $t('home.heatmap.locale.months.may'),
                      $t('home.heatmap.locale.months.jun'),
                      $t('home.heatmap.locale.months.jul'),
                      $t('home.heatmap.locale.months.aug'),
                      $t('home.heatmap.locale.months.sep'),
                      $t('home.heatmap.locale.months.oct'),
                      $t('home.heatmap.locale.months.nov'),
                      $t('home.heatmap.locale.months.dec'),
                    ],
                    days: [
                      $t('home.heatmap.locale.days.sun'),
                      $t('home.heatmap.locale.days.mon'),
                      $t('home.heatmap.locale.days.tue'),
                      $t('home.heatmap.locale.days.wed'),
                      $t('home.heatmap.locale.days.thu'),
                      $t('home.heatmap.locale.days.fri'),
                      $t('home.heatmap.locale.days.sat'),
                    ],
                    on: $t('home.heatmap.locale.on'),
                    less: $t('home.heatmap.locale.less'),
                    more: $t('home.heatmap.locale.more'),
                  }"
                >
                  <template #legend>
                    <div></div>
                  </template>
                </calendar-heatmap>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row gap-0">
          <div class="col-sm-3" v-for="item in types" :key="item.type">
            <div class="card card-animate">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <p class="fw-medium text-muted mb-0 text-capitalize">{{ $t(item.title) }}</p>
                    <h2 class="mt-4 ff-secondary fw-semibold">
                      {{ analytics[item.type].count || 0 }}
                    </h2>
                    <p class="mb-0 text-muted">
                      <span
                        class="badge badge-soft-info mb-0"
                        :class="
                          analytics[item.type].growth === 0
                            ? 'text-info'
                            : analytics[item.type].growth > 0
                            ? 'text-success'
                            : 'text-danger'
                        "
                      >
                        <i
                          class="mdi align-middle"
                          :class="
                            analytics[item.type].growth === 0
                              ? ''
                              : analytics[item.type].growth > 0
                              ? 'mdi-arrow-up'
                              : 'mdi-arrow-down'
                          "
                        ></i>
                        {{ analytics[item.type].growth }} %
                      </span>
                      {{ $t('home.analytics.vs') }}
                    </p>
                  </div>
                  <div>
                    <div class="avatar-sm flex-shrink-0">
                      <span
                        class="avatar-title bg-primary rounded-circle fs-2"
                        :class="`bg-${item.variant}`"
                      >
                        <i class="mdi" :class="item.icon" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header">
                <h4 class="card-title mb-0">{{ $t('home.task') }}</h4>
              </div>
              <div v-if="tasks.length" class="card-body p-0 table-responsive">
                <table
                  class="table table-hover table-borderless table-hover table-striped align-middle table-nowrap mb-0"
                >
                  <thead class="bg-light text-muted">
                    <tr>
                      <th>{{ $t('home.task.title') }}</th>
                      <th>{{ $t('home.task.users') }}</th>
                      <th>{{ $t('home.task.status') }}</th>
                      <th>{{ $t('home.task.progress') }}</th>
                      <th>{{ $t('home.task.dueDate') }}</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(task, index) of tasks.slice(0, 9)"
                      :key="index"
                      :class="resolveTaskVariant(task)"
                    >
                      <td
                        class="fw-medium text-truncate"
                        style="min-width: 100px; max-width: 200px"
                      >
                        {{ task.title }}
                      </td>
                      <td style="min-width: 120px">
                        <Avatar
                          :data="
                            task.users.map((username) => {
                              return getUserInfo(username);
                            })
                          "
                          size="xxs"
                        />
                      </td>
                      <td>
                        <span :class="`badge bg-${resolveTaskStatus(task).variant} text-uppercase`">
                          {{ resolveTaskStatus(task).title }}
                        </span>
                      </td>
                      <td style="min-width: 120px">
                        <div class="d-flex align-items-center">
                          <div class="progress progress-sm flex-grow-1 bg-soft-primary me-1">
                            <div
                              class="progress-bar bg-primary rounded"
                              :style="{ width: `${task.progress}%` }"
                            ></div>
                          </div>
                          <div class="fs-13 text-muted text-end" style="width: 30px !important">
                            {{ task.progress }}%
                          </div>
                        </div>
                      </td>
                      <td class="text-muted text-end">{{ dayjs(task.due_date).format('ll') }}</td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="tasks.length > 9" class="p-2 text-center">
                  <router-link to="/app/task" class="text-muted text-decoration-underline">
                    {{ $t('home.task.viewAllTasks') }}
                  </router-link>
                </div>
              </div>
              <Empty v-else :text="$t('home.task.empty')" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header">
                <h4 class="card-title mb-0">{{ $t('home.calendar.upcomingEvents') }}</h4>
              </div>
              <div v-if="events.length" class="card-body pt-0">
                <ul class="list-group list-group-flush border-dashed mb-2">
                  <li
                    class="list-group-item ps-0 pb-2 pt-2"
                    v-for="(event, index) of events.slice(0, 7)"
                    :key="index"
                  >
                    <div class="row align-items-center g-3">
                      <div class="col-auto">
                        <div class="avatar-sm p-1 py-1 h-auto bg-light rounded-3 shadow">
                          <div class="text-center mt-1">
                            <h5 class="mb-0">{{ dayjs(event.start).format('DD') }}</h5>
                            <div class="text-muted">{{ dayjs(event.start).format('ddd') }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="col text-truncate">
                        <h5 class="mt-0 mb-1">{{ event.title }}</h5>
                        <small class="text-muted mb-0" :title="event.description">
                          {{ event.description }}
                        </small>
                      </div>
                      <div class="col-sm-auto">
                        <Avatar
                          size="xxs"
                          :data="
                            event.users.map((username) => {
                              return getUserInfo(username);
                            })
                          "
                        ></Avatar>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-if="events.length > 7" class="p-2 text-center">
                  <router-link to="/app/calendar" class="text-muted text-decoration-underline">
                    {{ $t('home.calendar.viewAllEvents') }}
                  </router-link>
                </div>
              </div>
              <Empty v-else :text="$t('home.calendar.empty')" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { CalendarHeatmap } from 'vue3-calendar-heatmap';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import dayjs from '@utils/dayjs';
import store from '@store';
import Breadcrumb from '@layouts/breadcrumb';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
import { getUserHome } from '@api/user';
import { getUserInfo } from '@utils';
import useTask from '../app/task/useTask';

const toast = useToast();
const types = [
  {
    title: 'home.analytics.create',
    type: 'create',
    icon: 'mdi-creation',
    variant: 'primary',
  },
  {
    title: 'home.analytics.delete',
    type: 'delete',
    icon: 'mdi-delete-variant',
    variant: 'danger',
  },
  {
    title: 'home.analytics.update',
    type: 'update',
    icon: 'mdi-square-edit-outline',
    variant: 'warning',
  },
  {
    title: 'home.analytics.view',
    type: 'view',
    icon: 'mdi-eye-outline',
    variant: 'success',
  },
];

const { resolveTaskVariant } = useTask();

const resolveTaskStatus = computed(() => {
  return (task) => {
    const status = store.state.sys.cfg.task.statuses.find((status) => status.value === task.status);
    return status || store.state.sys.cfg.task.statuses[0];
  };
});

const heatmapRangeColor = computed(() => {
  return store.state.sys.theme === 'dark'
    ? ['#414653', '#516939', '#6c8b4b', '#86ab63', '#9fbc82', '#b6cda1']
    : ['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'];
});

const mergeActivities = (arr) => {
  const result = arr.reduce((obj, item) => {
    if (!obj[item.date]) {
      obj[item.date] = 0;
    }
    obj[item.date] += item.count;
    return obj;
  }, {});
  return Object.keys(result).map((date) => ({ date: date, count: result[date] }));
};

const activities = ref([]);
const analytics = ref({ create: {}, update: {}, view: {}, delete: {} });
const tasks = ref([]);
const events = ref([]);

onMounted(() => {
  getUserHome().then(({ code, data, msg }) => {
    if (code === 200) {
      activities.value = mergeActivities([...data.activities.st, ...data.activities.zz]);
      analytics.value = data.analytics;
      tasks.value = data.tasks;
      events.value = data.events;
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
</script>
