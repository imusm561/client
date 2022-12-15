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

      <div class="col-12">
        <div class="card">
          <div class="card-body p-0">
            <div class="alert alert-info rounded-top alert-solid alert-label-icon border-0 rounded-0 m-0 d-flex align-items-center">
              <i class="mdi mdi-clock-outline label-icon"></i>
              <div class="flex-grow-1 text-truncate">
                {{ $moment().format('LLLL') }}
              </div>
            </div>
            <div class="row p-3 gap-3">
              <div class="col-md-12 col-lg-6">
                <div class="d-flex">
                  <Avatar :data="$store.state.user.data" size="md" />
                  <div class="ps-3">
                    <h3 class="mb-1 fw-bold">{{ $t('dashboard.hello') }}, {{ $store.state.user.data.fullname }}!</h3>
                    <div class="mb-1 fs-14 fw-medium">{{ $store.state.org.depts.find((dept) => dept.id === $store.state.user.data.dept).name }} | {{ $store.state.user.data.post }}</div>
                    <p class="text-muted mb-0">{{ $t('dashboard.message') }}</p>
                  </div>
                </div>
              </div>
              <div class="col">
                <calendar-heatmap :values="data.activities" :end-date="$moment().format('YYYY-MM-DD')" :max="100" tooltip-unit="actions" :range-color="heatmapRangeColor" />
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
                    <p class="fw-medium text-muted mb-0 text-capitalize">{{ item.title }}</p>
                    <h2 class="mt-4 ff-secondary fw-semibold">
                      {{ data.analytics[item.type].count || 0 }}
                    </h2>
                    <p class="mb-0 text-muted">
                      <span class="badge badge-soft-info mb-0" :class="data.analytics[item.type].growth === 0 ? 'text-info' : data.analytics[item.type].growth > 0 ? 'text-success' : 'text-danger'">
                        <i class="mdi align-middle" :class="data.analytics[item.type].growth === 0 ? '' : data.analytics[item.type].growth > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"></i>
                        {{ data.analytics[item.type].growth }} %
                      </span>
                      {{ $t('dashboard.analytics.vs') }}
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

      <div class="col-lg-6">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header">
                <h4 class="card-title mb-0">{{ $t('dashboard.task') }}</h4>
              </div>
              <div v-if="tasks.length" class="card-body p-0 table-responsive">
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
                    <tr v-for="(task, index) of tasks.slice(0, 7)" :key="index">
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
                <div v-if="tasks.length > 7" class="p-2 text-center">
                  <router-link to="/app/task" class="text-muted text-decoration-underline">{{ $t('dashboard.task.viewAllTasks') }}</router-link>
                </div>
              </div>
              <Empty v-else :text="$t('dashboard.task.empty')" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="row h-100">
          <div class="col-12">
            <div class="card card-height-100">
              <div class="card-header">
                <h4 class="card-title mb-0">{{ $t('dashboard.calendar.upcomingEvents') }}</h4>
              </div>
              <div v-if="events.length" class="card-body pt-0">
                <ul class="list-group list-group-flush border-dashed">
                  <li class="list-group-item ps-0" v-for="(event, index) of events.slice(0, 5)" :key="index">
                    <div class="row align-items-center g-3">
                      <div class="col-auto">
                        <div class="avatar-sm p-1 py-1 h-auto bg-light rounded-3 shadow">
                          <div class="text-center mt-1">
                            <h5 class="mb-0">{{ $moment(event.start).format('DD') }}</h5>
                            <div class="text-muted">{{ $moment(event.start).format('ddd') }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="col text-truncate">
                        <h5 class="mt-0 mb-1">{{ event.title }}</h5>
                        <small class="text-muted mb-0" :title="event.description">{{ event.description }}</small>
                      </div>
                      <div class="col-sm-auto">
                        <Avatar size="xxs" :data="$store.state.org.users.filter((user) => event.users.includes(user.username))"></Avatar>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-if="events.length > 5" class="p-2 text-center">
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
</template>

<script>
import { onMounted, computed, reactive } from 'vue';
import store from '@store';
import Breadcrumb from '@/layouts/breadcrumb';
import { CalendarHeatmap } from 'vue3-calendar-heatmap';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
import { getUserDashboard } from '@api/user';
import { getUserInfo } from '@utils';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import i18n from '@utils/i18n';
export default {
  components: {
    Breadcrumb,
    CalendarHeatmap,
    Avatar,
    Empty,
  },
  setup() {
    const toast = useToast();
    const types = reactive([
      { title: i18n.global.t('dashboard.analytics.create'), type: 'create', icon: 'mdi-creation', variant: 'primary' },
      { title: i18n.global.t('dashboard.analytics.delete'), type: 'delete', icon: 'mdi-delete-variant', variant: 'danger' },
      { title: i18n.global.t('dashboard.analytics.update'), type: 'update', icon: 'mdi-square-edit-outline', variant: 'warning' },
      { title: i18n.global.t('dashboard.analytics.view'), type: 'view', icon: 'mdi-eye-outline', variant: 'success' },
    ]);

    const data = reactive({ analytics: { create: {}, update: {}, view: {}, delete: {} }, activities: [] });

    const heatmapRangeColor = computed(() => {
      return store.state.sys.theme === 'dark' ? ['#414653', '#516939', '#6c8b4b', '#86ab63', '#9fbc82', '#b6cda1'] : ['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'];
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

    onMounted(() => {
      getUserDashboard().then(({ code, data: { analytics, activities }, msg }) => {
        if (code === 200) {
          data.analytics = analytics;
          data.activities = mergeActivities([...activities.st, ...activities.zz]);
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

    const tasks = reactive(store.state.user.notices.task);
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

    const events = reactive(store.state.user.notices.calendar);

    return {
      types,
      data,
      heatmapRangeColor,
      tasks,
      resolveTaskVariant,
      getUserInfo,
      events,
    };
  },
};
</script>
