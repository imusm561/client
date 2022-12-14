<template>
  <div>
    <Breadcrumb :key="$route" />
    <div class="row">
      <div class="col-12">
        <div v-if="$store.state.user.data.is_initial_password" class="alert alert-danger alert-solid alert-label-icon d-flex align-items-center">
          <i class="mdi mdi-alert-outline text-light me-2 fs-16 label-icon"></i>
          <div class="flex-grow-1 text-truncate">
            <span v-html="$t('dashboard.changePassword')"></span>
          </div>
          <div class="flex-shrink-0">
            <router-link to="/user/setting?tab=change_password" class="text-reset text-decoration-underline">
              <b>{{ $t('dashboard.changePassword.change') }}</b>
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body p-0">
                <div class="alert alert-info rounded-top alert-solid alert-label-icon border-0 rounded-0 m-0 d-flex align-items-center">
                  <i class="mdi mdi-clock-outline label-icon"></i>
                  <div class="flex-grow-1 text-truncate">
                    {{ $moment().format('llll') }}
                  </div>
                </div>
                <div class="d-flex p-3">
                  <Avatar :data="$store.state.user.data" size="md" />
                  <div class="ps-3">
                    <h3 class="mb-1 fw-bold">{{ $t('dashboard.hello') }}, {{ $store.state.user.data.fullname }}!</h3>
                    <div class="mb-1 fs-14 fw-medium">{{ $store.state.org.depts.find((dept) => dept.id === $store.state.user.data.dept).name }} | {{ $store.state.user.data.post }}</div>
                    <p class="text-muted mb-0">{{ $t('dashboard.message') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row gap-0">
          <div class="col-sm-6" v-for="item in types" :key="item.type">
            <div class="card card-animate">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <p class="fw-medium text-muted mb-0 text-capitalize">{{ item.title }}</p>
                    <h2 class="mt-4 ff-secondary fw-semibold">
                      {{ analytics.realtime[item.type].count || 0 }}
                    </h2>
                    <p class="mb-0 text-muted">
                      <span
                        class="badge badge-soft-info mb-0"
                        :class="analytics.realtime[item.type].growth === 0 ? 'text-info' : analytics.realtime[item.type].growth > 0 ? 'text-success' : 'text-danger'"
                      >
                        <i class="mdi align-middle" :class="analytics.realtime[item.type].growth === 0 ? '' : analytics.realtime[item.type].growth > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"></i>
                        {{ analytics.realtime[item.type].growth }} %
                      </span>
                      {{ $t('dashboard.type.vs') }}
                    </p>
                  </div>
                  <div>
                    <div class="avatar-sm flex-shrink-0">
                      <span class="avatar-title bg-primary rounded-circle fs-2" :class="`bg-${item.variant}`">
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
      <div class="col-lg-7">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header border-0 align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">{{ $t('dashboard.analytics.title') }}</h4>
                <div>
                  <button type="button" class="btn btn-soft-primary btn-sm me-1" @click="handleRenderAnalyticsChart('7d')">{{ $t('dashboard.analytics.7d') }}</button>
                  <button type="button" class="btn btn-soft-secondary btn-sm me-1" @click="handleRenderAnalyticsChart('30d')">{{ $t('dashboard.analytics.30d') }}</button>
                </div>
              </div>

              <div class="card-header p-0 border-0 bg-soft-light">
                <div class="row g-0 text-center">
                  <div class="col-6 col-sm-3" v-for="item in AnalyticsChart.series" :key="item.name">
                    <div class="p-3 border border-dashed border-start-0">
                      <h5 class="mb-1" :class="`text-${types.find((type) => type.type === item.name)?.variant}`">
                        {{ item.data.reduce((accumulator, currentValue) => accumulator + currentValue) || 0 }}
                      </h5>
                      <p class="text-muted mb-0 text-capitalize">{{ types.find((type) => type.type === item.name)?.title }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body p-0 pb-2">
                <div>
                  <apexchart :key="AnalyticsChart.key" class="apex-charts" height="320" dir="ltr" :series="AnalyticsChart.series" :options="AnalyticsChart.options"></apexchart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 d-none d-md-block">
        <div class="card card-height-100">
          <apexchart id="activeChart" :key="ActiveChart.key" class="apex-charts" height="350" dir="ltr" :series="ActiveChart.series" :options="ActiveChart.options"></apexchart>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header">
                <h4 class="card-title flex-grow-1 mb-0">{{ $t('dashboard.task') }}</h4>
              </div>
              <div v-if="tasks.length" class="card-body">
                <div class="table-responsive table-card">
                  <table class="table table-hover table-borderless table-hover table-striped align-middle table-nowrap">
                    <thead class="bg-light text-muted">
                      <tr>
                        <th>{{ $t('dashboard.task.title') }}</th>
                        <th>{{ $t('dashboard.task.creator') }}</th>
                        <th>{{ $t('dashboard.task.progress') }}</th>
                        <th>{{ $t('dashboard.task.users') }}</th>
                        <th>{{ $t('dashboard.task.status') }}</th>
                        <th>{{ $t('dashboard.task.dueDate') }}</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(task, index) of tasks.slice(0, 10)" :key="index">
                        <td class="fw-medium text-truncate" style="max-width: 100px">{{ task.title }}</td>
                        <td>
                          <Avatar :data="getUserInfo(task.created_by)" size="xxs" />
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="flex-shrink-0 me-1 text-muted fs-13">{{ task.progress }}%</div>
                            <div class="progress progress-sm flex-grow-1 bg-soft-primary" :style="{ width: `${task.progress}%` }">
                              <div class="progress-bar bg-primary rounded" role="progressbar" :style="{ width: `${task.progress}%` }"></div>
                            </div>
                          </div>
                        </td>
                        <td>
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
                          <span :class="`badge bg-${resolveTaskVariant(task.status)} text-uppercase`">{{ $t(`dashboard.task.status.${task.status}`) }}</span>
                        </td>
                        <td class="text-muted">{{ $moment(task.due_date).format('ll') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="tasks.length >= 10" class="mt-3 text-center">
                  <router-link to="/app/task" class="text-muted text-decoration-underline">{{ $t('dashboard.task.viewAllTasks') }}</router-link>
                </div>
              </div>
              <Empty v-else :text="$t('dashboard.task.empty')" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header border-0">
                <h4 class="card-title mb-0">{{ $t('dashboard.calendar.upcomingEvents') }}</h4>
              </div>
              <div class="card-body pt-0">
                <div class="upcoming-scheduled">
                  <FlatPickr
                    v-model="date"
                    :config="{
                      inline: true,
                      disable: [
                        (date) => {
                          return !(date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate());
                        },
                      ],
                    }"
                  />
                </div>

                <h6 class="text-uppercase fw-semibold mt-4 mb-3 text-muted">{{ $t('dashboard.calendar.events') }}:</h6>
                <div v-if="events.length">
                  <div class="mini-stats-wid d-flex align-items-center mt-3" v-for="(event, index) of events.slice(0, 3)" :key="index">
                    <div class="flex-shrink-0 avatar-sm">
                      <span class="mini-stat-icon avatar-title rounded-circle text-success bg-soft-success fs-4">{{ index + 1 }}</span>
                    </div>
                    <div class="flex-grow-1 ms-3 mw-75">
                      <h6 class="mb-1 text-truncate" :title="event.title">{{ event.title }}</h6>
                      <p class="text-muted mb-0 text-truncate" :title="event.description">{{ event.description }}</p>
                    </div>
                  </div>

                  <div v-if="events.length >= 3" class="mt-3 text-center">
                    <router-link to="/app/calendar" class="text-muted text-decoration-underline">{{ $t('dashboard.calendar.viewAllEvents') }}</router-link>
                  </div>
                </div>

                <Empty v-else :text="$t('dashboard.calendar.empty')" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, reactive, watch } from 'vue';
import Breadcrumb from '@/layouts/breadcrumb';
import store from '@store';
import Avatar from '@components/Avatar';
import FlatPickr from '@components/FlatPickr';
import Empty from '@components/Empty';
import { getUserDashboard } from '@api/user';
import { getChartColorsArray, getUserInfo, getYearWeeks } from '@utils';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import i18n from '@utils/i18n';
export default {
  components: {
    Breadcrumb,
    Avatar,
    FlatPickr,
    Empty,
  },
  setup() {
    const toast = useToast();

    const types = reactive([
      { title: i18n.global.t('dashboard.type.create'), type: 'create', icon: 'mdi-creation', variant: 'primary' },
      { title: i18n.global.t('dashboard.type.delete'), type: 'delete', icon: 'mdi-delete-variant', variant: 'danger' },
      { title: i18n.global.t('dashboard.type.update'), type: 'update', icon: 'mdi-square-edit-outline', variant: 'warning' },
      { title: i18n.global.t('dashboard.type.view'), type: 'view', icon: 'mdi-eye-outline', variant: 'success' },
    ]);
    const analytics = reactive({ realtime: { create: {}, update: {}, view: {}, delete: {} }, '7d': [], '30d': [], zzcount: [], stcount: [] });
    const AnalyticsChart = reactive({
      key: null,
      series: [],
      options: {
        chart: {
          height: 374,
          type: 'line',
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: 'smooth',
          dashArray: [0, 2, 0, 0],
          width: [0, 2, 0, 2],
        },
        fill: {
          opacity: [1, 0.5, 1, 1],
        },
        xaxis: {
          type: 'datetime',
          categories: [],
          labels: {
            datetimeUTC: false,
          },
        },
        yaxis: [
          {
            axisBorder: {
              show: true,
            },
            tooltip: {
              enabled: true,
            },
          },
        ],
        legend: {
          show: false,
          horizontalAlign: 'center',
          offsetX: 0,
          offsetY: 5,
          itemMargin: {
            horizontal: 20,
            vertical: 0,
          },
        },
        colors: getChartColorsArray(
          `["--${process.env.VUE_APP_VARIABLE_PREFIX}-primary", "--${process.env.VUE_APP_VARIABLE_PREFIX}-danger", "--${process.env.VUE_APP_VARIABLE_PREFIX}-warning", "--${process.env.VUE_APP_VARIABLE_PREFIX}-success"]`,
        ),
      },
    });
    const ActiveChart = reactive({
      key: null,
      series: [
        {
          name: i18n.global.t('dashboard.week.sat'),
          day: 6,
          data: [],
        },
        {
          name: i18n.global.t('dashboard.week.fri'),
          day: 5,
          data: [],
        },
        {
          name: i18n.global.t('dashboard.week.thur'),
          day: 4,
          data: [],
        },
        {
          name: i18n.global.t('dashboard.week.wed'),
          day: 3,
          data: [],
        },
        {
          name: i18n.global.t('dashboard.week.tues'),
          day: 2,
          data: [],
        },
        {
          name: i18n.global.t('dashboard.week.mon'),
          day: 1,
          data: [],
        },
        {
          name: i18n.global.t('dashboard.week.sun'),
          day: 0,
          data: [],
        },
      ],
      options: {
        chart: {
          height: 450,
          type: 'heatmap',
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: getChartColorsArray(`["--${process.env.VUE_APP_VARIABLE_PREFIX}-primary"]`),
        tooltip: {
          y: {
            formatter: function (v, o) {
              return `${v - 5} [${weeks[o.dataPointIndex + 1][6 - o.seriesIndex]}]`;
            },
          },
        },
      },
    });

    onMounted(() => {
      getUserDashboard().then(({ code, data, msg }) => {
        if (code === 200) {
          analytics.realtime = data.realtime;
          analytics['7d'] = data['7d'];
          analytics['30d'] = data['30d'];
          analytics.zzcount = data.zzcount;
          analytics.stcount = data.stcount;
          handleRenderAnalyticsChart('7d');
          handleRenderActiveChart();
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

    const handleRenderAnalyticsChart = (interval) => {
      AnalyticsChart.series = analytics[interval].series;
      AnalyticsChart.options.xaxis.categories = analytics[interval].categories;
      AnalyticsChart.key = Math.random().toString(36).slice(-6);
    };

    const weeks = getYearWeeks();
    const generateData = (day) => {
      const series = [];
      for (let i = 1; i <= Object.keys(weeks).length; i++) {
        const date = weeks[i][day];
        series.push({
          x: `w${i}`,
          y: (analytics.zzcount.find((item) => item.date === date)?.count || 0) + (analytics.stcount.find((item) => item.date === date)?.count || 0) + 5,
        });
      }
      return series;
    };

    const handleRenderActiveChart = () => {
      ActiveChart.series.forEach((item) => {
        item.data = generateData(item.day);
      });
      ActiveChart.key = Math.random().toString(36).slice(-6);
    };

    watch(
      () => {
        return store.state.sys.theme;
      },
      () => {
        handleRenderActiveChart();
      },
      { immediate: true, deep: true },
    );

    const tasks = reactive(store.state.user.notices.task);
    const events = reactive(store.state.user.notices.calendar);
    const resolveTaskVariant = computed(() => {
      return (status) => {
        switch (status) {
          case 'todo':
            return 'secondary';
          case 'urgent':
            return 'warning';
          case 'inprogress':
            return 'primary';
          case 'review':
            return 'info';
          case 'completed':
            return 'success';
          default:
            return 'secondary';
        }
      };
    });

    return {
      types,
      analytics,
      AnalyticsChart,
      handleRenderAnalyticsChart,
      ActiveChart,
      tasks,
      events,
      date: null,
      getUserInfo,
      resolveTaskVariant,
    };
  },
};
</script>
