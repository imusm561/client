<template>
  <div class="calendar-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
    <div class="calendar-sidebar" id="menusidebar">
      <div class="p-3 d-flex flex-column">
        <div class="pb-3 border-bottom border-bottom-dashed">
          <button class="btn btn-primary w-100" @click="handleCreateEvent">
            <i class="mdi mdi-plus"></i>
            {{ $t('app.calendar.create') }}
          </button>
        </div>

        <div id="external-events" class="mt-3 pb-3 border-bottom border-bottom-dashed">
          <p class="text-muted text-truncate" :title="$t('app.calendar.dragTip')">
            {{ $t('app.calendar.dragTip') }}
          </p>
          <div
            v-for="category in categories"
            :key="category.value"
            :class="`external-event fc-event bg-soft-${category.variant} text-${category.variant}`"
            :data-category="category.value"
          >
            <i class="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>
            {{ category.title }}
          </div>
        </div>

        <div class="mt-3">
          <h5 class="text-center mb-1">{{ $t('app.calendar.upcomingEvents') }}</h5>
          <div data-simplebar class="upcoming-events">
            <div
              class="card cursor-pointer bg-light"
              :class="index === upcoming_events.length - 1 ? 'mb-0' : 'mb-3'"
              v-for="(event, index) in upcoming_events"
              :key="event.id"
              data-bs-toggle="modal"
              data-bs-target="#viewAndEditEventModal"
              @click="handleEventClick({ event })"
            >
              <div class="card-body p-2">
                <div class="d-flex mb-2">
                  <div :class="`flex-grow-1 text-${resolveEventVariant(event)}`">
                    <i class="mdi mdi-circle me-2"></i>
                    <span class="fw-medium">
                      {{ dayjs(event.start).format(event.all_day ? 'll' : 'llll') }}
                    </span>
                  </div>
                  <div class="flex-shrink-0">
                    <small class="badge badge-soft-primary ms-auto"></small>
                  </div>
                </div>
                <h6 class="card-title fs-16">{{ event.title }}</h6>
                <p class="text-muted text-truncate-two-lines mb-0">
                  {{ event.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="calendar-content">
      <div class="p-4 pb-0">
        <FullCalendar class="calendar" ref="calendar" :options="calendarOptions" />
      </div>
    </div>

    <button
      id="showViewAndEditEventModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#viewAndEditEventModal"
    />
    <div
      class="modal fade"
      id="viewAndEditEventModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-soft-info">
            <h5 class="modal-title">
              {{
                current_event.id
                  ? current_event.title
                  : $t('app.calendar.viewAndEditEventModal.newEvent')
              }}
            </h5>
            <button
              type="button"
              id="hideViewAndEditEventModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitEvent" :key="viewAndEditEventModalKey">
            <div class="modal-body p-0">
              <div
                v-if="editing"
                data-simplebar
                class="p-3"
                style="max-height: 80vh; overflow-x: hidden"
              >
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.title') }}
                    </label>
                    <Field
                      name="title"
                      v-model="current_event.title"
                      type="text"
                      :placeholder="$t('app.calendar.viewAndEditEventModal.form.title')"
                      :class="['form-control', errors.title && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ $te(errors.title) }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.category') }}
                    </label>
                    <VueSelect
                      v-model="current_event.category"
                      :placeholder="$t('app.calendar.viewAndEditEventModal.form.category')"
                      :class="errors.category && 'is-invalid'"
                      :reduce="(item) => item.value"
                      label="title"
                      :clearable="false"
                      :options="categories"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">
                          {{ $t('components.vs.searchCategory') }}
                        </em>
                      </template>
                    </VueSelect>
                    <Field
                      name="category"
                      v-model="current_event.category"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ $te(errors.category) }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.users') }}
                    </label>
                    <UserSelector
                      :key="`calendar_${current_event.id || current_event.key}`"
                      v-model="current_event.users"
                      :placeholder="$t('app.calendar.viewAndEditEventModal.form.users')"
                      :class="[errors.users && 'is-invalid']"
                    />
                    <Field
                      name="users"
                      v-model="current_event.users"
                      :rules="`required|users:${$store.state.user.data.username}`"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ $te(errors.users) }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.description') }}
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      v-model="current_event.description"
                      type="text"
                      :placeholder="$t('app.calendar.viewAndEditEventModal.form.description')"
                      :class="['form-control', errors.description && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ $te(errors.description) }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.date') }}
                    </label>
                    <FlatPickr
                      v-model="current_event.date"
                      @change="handleChangeDate"
                      :class="['form-control', errors.date && 'is-invalid']"
                      :placeholder="$t('app.calendar.viewAndEditEventModal.form.date')"
                      :config="{ mode: 'range' }"
                    ></FlatPickr>
                    <Field
                      name="date"
                      v-model="current_event.date"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ $te(errors.date) }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.allDay') }}
                    </label>
                    <div class="form-check form-switch form-switch-md">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :disabled="
                          dayjs(current_event.start).format('YYYY-MM-DD') !=
                          dayjs(current_event.end).format('YYYY-MM-DD')
                        "
                        v-model="current_event.all_day"
                      />
                    </div>
                  </div>
                  <div class="col-12" id="event-time" v-if="!current_event.all_day">
                    <div class="row">
                      <div class="col-6">
                        <label class="form-label">
                          {{ $t('app.calendar.viewAndEditEventModal.form.startTime') }}
                        </label>
                        <FlatPickr
                          v-model="current_event.start_time"
                          :class="['form-control', errors.start_time && 'is-invalid']"
                          :placeholder="$t('app.calendar.viewAndEditEventModal.form.startTime')"
                          :config="{ dateFormat: 'H:i:S' }"
                        ></FlatPickr>
                        <Field
                          name="start_time"
                          v-model="current_event.start_time"
                          rules="required"
                          class="d-none"
                        />
                        <span class="invalid-feedback">{{ $te(errors.start_time) }}</span>
                      </div>
                      <div class="col-6">
                        <label class="form-label">
                          {{ $t('app.calendar.viewAndEditEventModal.form.endTime') }}
                        </label>
                        <FlatPickr
                          v-model="current_event.end_time"
                          :class="['form-control', errors.end_time && 'is-invalid']"
                          :placeholder="$t('app.calendar.viewAndEditEventModal.form.endTime')"
                          :config="{ dateFormat: 'H:i:S' }"
                        ></FlatPickr>
                        <Field
                          name="end_time"
                          v-model="current_event.end_time"
                          rules="required|gt:@start_time"
                          class="d-none"
                        />
                        <span class="invalid-feedback">{{ $te(errors.end_time) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.calendar.viewAndEditEventModal.form.location') }}
                    </label>
                    <Amap
                      id="event-location"
                      v-model="current_event.location"
                      :placeholder="$t('app.calendar.viewAndEditEventModal.form.location')"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="event-details p-3">
                <div class="d-flex mb-2">
                  <div class="flex-grow-1 d-flex align-items-center">
                    <div class="flex-shrink-0 me-3">
                      <i class="mdi mdi-calendar text-muted fs-16"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6
                        v-if="
                          dayjs(current_event.start).format('YYYY-MM-DD') ==
                          dayjs(current_event.end).format('YYYY-MM-DD')
                        "
                        class="d-block fw-semibold mb-0"
                      >
                        {{ dayjs(current_event.start).format('YYYY-MM-DD') }}
                      </h6>
                      <h6 v-else class="d-block fw-semibold mb-0">
                        {{ dayjs(current_event.start).format('YYYY-MM-DD') }} ~
                        {{ dayjs(current_event.end).format('YYYY-MM-DD') }}
                      </h6>
                    </div>
                  </div>
                </div>
                <div v-if="!current_event.all_day" class="d-flex align-items-center mb-2">
                  <div class="flex-shrink-0 me-3">
                    <i class="mdi mdi-clock-time-three-outline text-muted fs-16"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="d-block fw-semibold mb-0">
                      <span>{{ dayjs(current_event.start).format('HH:mm:ss') }}</span>
                      ~
                      <span>{{ dayjs(current_event.end).format('HH:mm:ss') }}</span>
                    </h6>
                  </div>
                </div>
                <div v-if="current_event.location" class="d-flex align-items-center mb-2">
                  <div class="flex-shrink-0 me-3">
                    <i class="mdi mdi-google-maps text-muted fs-16"></i>
                  </div>
                  <div class="flex-grow-1">
                    <img
                      v-if="$store.state.sys.cfg.amapWebService && isLngLat(current_event.location)"
                      :src="`//restapi.amap.com/v3/staticmap?location=${current_event.location}&zoom=12&size=700*300&markers=,,:${current_event.location}&key=${$store.state.sys.cfg.amapWebService}`"
                      @dblclick="handleDblClickMap(current_event.location)"
                      class="img-fluid"
                      :alt="current_event.location"
                      loading="lazy"
                    />
                    <h6 v-else class="d-block fw-semibold mb-0">
                      <span>{{ current_event.location }}</span>
                    </h6>
                  </div>
                </div>
                <div class="d-flex align-items-center" v-if="current_event.description">
                  <div class="flex-shrink-0 me-3">
                    <i class="mdi mdi-comment-multiple-outline text-muted fs-16"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="d-block text-muted mb-0">{{ current_event.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <span
                v-if="current_event.id"
                class="btn btn-sm btn-primary"
                @click="editing = !editing"
              >
                <i
                  class="mdi"
                  :class="editing ? 'mdi-content-save-off-outline' : 'mdi-square-edit-outline '"
                ></i>
                {{
                  editing
                    ? $t('app.calendar.viewAndEditEventModal.form.footer.cancel')
                    : $t('app.calendar.viewAndEditEventModal.form.footer.edit')
                }}
              </span>
              <span
                v-if="!editing && current_event.id"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                href="#deleteEventModal"
              >
                <i class="mdi mdi-delete-outline"></i>
                {{ $t('app.calendar.viewAndEditEventModal.form.footer.delete') }}
              </span>
              <button type="submit" class="d-none" ref="submitEventBtnRef"></button>
              <span
                v-if="editing"
                class="btn btn-sm btn-success"
                @click="Object.keys(errors).length === 0 && submitEventBtnRef.click()"
              >
                <i class="mdi mdi-content-save-outline"></i>
                {{
                  current_event.id
                    ? $t('app.calendar.viewAndEditEventModal.form.footer.save')
                    : $t('app.calendar.viewAndEditEventModal.form.footer.create')
                }}
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="deleteEventModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close d-none"
              id="hideDeleteEventModalBtn"
              data-bs-dismiss="modal"
            ></button>
            <button
              type="button"
              class="btn-close"
              data-bs-toggle="modal"
              href="#viewAndEditEventModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{ $t('app.calendar.deleteEventModal.title', { name: current_event.title }) }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('app.calendar.deleteEventModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-toggle="modal"
                href="#viewAndEditEventModal"
              >
                {{ $t('app.calendar.deleteEventModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelEvent">
                {{ $t('app.calendar.deleteEventModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { nanoid } from 'nanoid';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/core/vdom';
import usUs from '@fullcalendar/core/locales/es-us';
import zhCn from '@fullcalendar/core/locales/zh-cn';
import { getUserInfo, isLngLat } from '@utils';
import i18n from '@utils/i18n';
import dayjs from '@utils/dayjs';
import { socket } from '@utils/socket';
import FlatPickr from '@components/FlatPickr';
import Amap from '@components/Amap';
import UserSelector from '@components/UserSelector';
import store from '@store';
import { getEvents, createEvent, updateEvent } from '@api/app/calendar';

const toast = useToast();

const calendar = ref(null);
let calendarApi = null;

const categories = [
  {
    title: i18n.global.t('app.calendar.category.personal'),
    value: 'personal',
    variant: 'primary',
  },
  {
    title: i18n.global.t('app.calendar.category.meeting'),
    value: 'meeting',
    variant: 'secondary',
  },
  {
    title: i18n.global.t('app.calendar.category.family'),
    value: 'family',
    variant: 'warning',
  },
  {
    title: i18n.global.t('app.calendar.category.work'),
    value: 'work',
    variant: 'danger',
  },
  {
    title: i18n.global.t('app.calendar.category.holiday'),
    value: 'holiday',
    variant: 'success',
  },
  {
    title: i18n.global.t('app.calendar.category.other'),
    value: 'other',
    variant: 'info',
  },
];

const resolveEventVariant = computed(() => {
  return (event) => {
    const category = categories.find((category) => category.value === event.category);
    return category ? category.variant : 'info';
  };
});

const events = ref([]);
const upcoming_events = ref(null);
const current_event = ref({});
const editing = ref(false);
const submitEventBtnRef = ref(null);

const getInitialView = () => {
  if (window.innerWidth >= 768 && window.innerWidth < 1200) {
    return 'timeGridWeek';
  } else if (window.innerWidth <= 768) {
    return 'listMonth';
  } else {
    return 'dayGridMonth';
  }
};

const fetchUpcomingEvents = () => {
  getEvents({
    start: dayjs().format('YYYY-MM-DD'),
    end: dayjs().add(1, 'M').format('YYYY-MM-DD'),
  }).then(({ code, data, msg }) => {
    if (code === 200) {
      upcoming_events.value = data
        .map((event) => {
          const category = categories.find((category) => category.value === event.category);
          event.className = category ? `bg-soft-${category.variant}` : 'bg-soft-info';
          event.allDay = event.all_day;
          event.users = event.users.filter((username) => getUserInfo(username));
          return event;
        })
        .sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
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

const fetchEvents = (info, successCallback) => {
  getEvents({
    start: dayjs(info.start).format('YYYY-MM-DD'),
    end: dayjs(info.end).format('YYYY-MM-DD'),
  }).then(({ code, data, msg }) => {
    if (code === 200) {
      events.value = data.map((event) => {
        const category = categories.find((category) => category.value === event.category);
        event.className = category ? `bg-soft-${category.variant}` : 'bg-soft-info';
        event.allDay = event.all_day;
        event.users = event.users.filter((username) => getUserInfo(username));
        return event;
      });
      successCallback(events.value);
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

const viewAndEditEventModalKey = ref(null);

const handleDateClick = (e) => {
  current_event.value = {
    title: '',
    description: '',

    date: [dayjs(e.date).format('YYYY-MM-DD'), dayjs(e.date).format('YYYY-MM-DD')],

    start: `${dayjs(e.date).format('YYYY-MM-DD')} 00:00:00`,
    end: `${dayjs(e.date).format('YYYY-MM-DD')} 00:00:00`,
    all_day: true,

    start_time: '09:00:00',
    end_time: '18:00:00',

    location: '',
    category: 'other',
    users: [store.state.user.data.username],
  };
  editing.value = true;
  viewAndEditEventModalKey.value = nanoid();
  document.getElementById('showViewAndEditEventModalBtn').click();
};

const handleEventClick = ({ event }) => {
  current_event.value = {
    id: event.id,

    title: event.title,
    description: event.extendedProps ? event.extendedProps.description : event.description,

    date: [
      dayjs(event.start).format('YYYY-MM-DD'),
      event.allDay && event.end && event.endStr != event.startStr
        ? dayjs(event.end).add(-1, 'd').format('YYYY-MM-DD')
        : dayjs(event.end || event.start).format('YYYY-MM-DD'),
    ],

    start: event.start,
    end:
      event.allDay && event.end && event.endStr != event.startStr
        ? dayjs(event.end).add(-1, 'd').format('YYYY-MM-DD')
        : event.end || event.start,
    all_day: event.allDay,

    start_time: dayjs(event.start).format('HH:mm:ss'),
    end_time: dayjs(event.end).format('HH:mm:ss'),

    location: event.extendedProps ? event.extendedProps.location : event.location,
    category: event.extendedProps ? event.extendedProps.category : event.category,
    users: event.extendedProps ? event.extendedProps.users : event.users,
  };
  document.getElementById('showViewAndEditEventModalBtn').click();
};

const handleEventDrop = ({ event }) => {
  const data = {
    id: event.id,
    start: dayjs(event.start).format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(event.end || event.start).format('YYYY-MM-DD HH:mm:ss'),
  };
  updateEvent(data).then(({ code, msg }) => {
    if (code !== 200) {
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

const handleEventReceive = ({ event, revert }) => {
  revert();
  const data = {
    title: event.title,
    description: event.extendedProps.description,
    start: dayjs(event.start).format('YYYY-MM-DD 00:00:00'),
    end: dayjs(event.start).format('YYYY-MM-DD 00:00:00'),
    all_day: true,
    category: event.extendedProps.category,
    users: event.extendedProps.users,
  };
  createEvent(data).then(({ code, msg }) => {
    if (code !== 200) {
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

const calendarOptions = ref({
  locales: [usUs, zhCn],
  locale: store.state.sys.lang,
  firstDay: 0,
  timeZone: 'local',
  droppable: true,
  navLinks: true,
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin, listPlugin],
  themeSystem: 'bootstrap',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
  },
  windowResize: () => {
    getInitialView();
  },
  initialView: getInitialView(),
  events: fetchEvents,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventReceive: handleEventReceive,
});

const refetchEventsHandler = () => {
  fetchUpcomingEvents();
  calendarApi.refetchEvents();
};

const viewAndEditEventModalHiddenHandler = () => {
  editing.value = false;
};

onMounted(() => {
  fetchUpcomingEvents();
  calendarApi = calendar.value.getApi().view.calendar;
  new Draggable(document.getElementById('external-events'), {
    itemSelector: '.external-event',
    eventData: function (eventEl) {
      return {
        title: eventEl.innerText.trim(),
        description: i18n.global.t('app.calendar.viewAndEditEventModal.form.description'),
        start: new Date(),
        category: eventEl.getAttribute('data-category'),
        users: [store.state.user.data.username],
      };
    },
  });

  const viewAndEditEventModal = document.getElementById('viewAndEditEventModal');
  if (viewAndEditEventModal) {
    viewAndEditEventModal.addEventListener('hidden.bs.modal', viewAndEditEventModalHiddenHandler);
  }
  socket.on('refetchEvents', refetchEventsHandler);
});

onUnmounted(() => {
  const viewAndEditEventModal = document.getElementById('viewAndEditEventModal');
  if (viewAndEditEventModal) {
    viewAndEditEventModal.removeEventListener(
      'hidden.bs.modal',
      viewAndEditEventModalHiddenHandler,
    );
  }
  socket.off('refetchEvents', refetchEventsHandler);
});

const handleCreateEvent = () => {
  current_event.value = {
    key: nanoid(),

    title: '',
    description: '',

    date: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],

    start: `${dayjs().format('YYYY-MM-DD')} 00:00:00`,
    end: `${dayjs().format('YYYY-MM-DD')} 00:00:00`,
    all_day: true,

    start_time: '09:00:00',
    end_time: '18:00:00',

    location: '',
    category: 'other',
    users: [store.state.user.data.username],
  };
  editing.value = true;
  viewAndEditEventModalKey.value = nanoid();
  document.getElementById('showViewAndEditEventModalBtn').click();
};

const handleChangeDate = (e) => {
  if (e.target.value) {
    if (e.target.value.split(' ').length === 3) {
      current_event.value.start = e.target.value.split(' ')[0];
      current_event.value.end = e.target.value.split(' ')[2];
      current_event.value.all_day = true;
    } else {
      current_event.value.start = current_event.value.end = e.target.value;
    }
  }
};

const handleDelEvent = () => {
  updateEvent({
    id: current_event.value.id,
    data_state: 'deleted',
  }).then(({ code, msg }) => {
    if (code === 200) {
      document.getElementById('hideDeleteEventModalBtn').click();
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

const handleSubmitEvent = () => {
  const data = {
    title: current_event.value.title,
    description: current_event.value.description,
    start: dayjs(current_event.value.start).format('YYYY-MM-DD'),
    end: dayjs(current_event.value.end).format('YYYY-MM-DD'),
    all_day: current_event.value.all_day,
    location: current_event.value.location,
    category: current_event.value.category,
    users: current_event.value.users,
  };

  if (current_event.value.all_day) {
    data.end =
      data.end === data.start
        ? dayjs(data.end).format('YYYY-MM-DD 00:00:00')
        : dayjs(data.end).add(1, 'd').format('YYYY-MM-DD 00:00:00');
    data.start = dayjs(data.start).format('YYYY-MM-DD 00:00:00');
  } else {
    if (current_event.value.start_time.split(':').length !== 3) {
      current_event.value.start_time = '';
      return;
    }
    if (current_event.value.end_time.split(':').length !== 3) {
      current_event.value.end_time = '';
      return;
    }

    data.start = `${data.start} ${current_event.value.start_time}`.trim();
    data.end = `${data.end} ${current_event.value.end_time}`.trim();
  }

  if (current_event.value.id) {
    data.id = current_event.value.id;
    updateEvent(data).then(({ code, msg }) => {
      if (code === 200) {
        document.getElementById('hideViewAndEditEventModalBtn').click();
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
  } else {
    createEvent(data).then(({ code, msg }) => {
      if (code === 200) {
        document.getElementById('hideViewAndEditEventModalBtn').click();
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
  }
};

const handleDblClickMap = (lnglat) => {
  window.open(
    `//www.amap.com/regeo?lng=${lnglat.split(',')[0]}&lat=${lnglat.split(',')[1]}`,
    '_blank',
  );
};
</script>
