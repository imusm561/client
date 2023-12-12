<template>
  <div class="task-wrapper mt-n4 mx-n4 pe-1 ps-1 pt-1">
    <div class="card mb-2" style="border-radius: 0px">
      <div class="card-body d-md-none d-flex justify-content-between">
        <div class="search-box w-75">
          <input
            v-model="search_keyword"
            type="text"
            class="form-control"
            :placeholder="$t('app.task.search')"
          />
          <i class="mdi mdi-magnify fs-16 search-icon"></i>
        </div>
        <button
          class="btn btn-primary ms-3 text-nowrap"
          data-bs-toggle="modal"
          data-bs-target="#editTaskModal"
          @click="handleCreateTask"
        >
          {{ $t('app.task.create') }}
        </button>
      </div>
      <div class="card-body d-none d-md-flex justify-content-between">
        <div class="w-25 d-none d-md-block">
          <VueSelect
            v-model="search_users"
            multiple
            :close-on-select="false"
            :placeholder="$t('app.task.filter')"
            :reduce="(user) => user.username"
            label="fullname"
            :options="$store.state.org.users"
          >
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
        <div class="d-flex">
          <div class="search-box w-100">
            <input
              v-model="search_keyword"
              type="text"
              class="form-control"
              :placeholder="$t('app.task.search')"
            />
            <i class="mdi mdi-magnify fs-16 search-icon"></i>
          </div>
          <button
            class="btn btn-primary ms-3 text-nowrap"
            data-bs-toggle="modal"
            data-bs-target="#editTaskModal"
            @click="handleCreateTask"
          >
            {{ $t('app.task.create') }}
          </button>
        </div>
      </div>
    </div>

    <div class="tasks-board p-2">
      <div
        :id="`task-${status.value}`"
        class="tasks-list"
        v-for="(status, index) in statuses"
        :key="index"
      >
        <div class="d-flex align-items-center mb-3">
          <h5 class="text-uppercase fw-semibold mb-0 me-1">
            {{ status.title }}
          </h5>
          <small :class="`badge bg-${status.variant}`">
            {{ status.total }}
          </small>
        </div>
        <div data-simplebar class="tasks-wrapper mb-1 px-3 mx-n3">
          <div class="tasks" :id="status.value">
            <draggable
              :list="status.tasks"
              :id="status.value"
              class="dragArea"
              handle=".mover"
              :group="status.group"
              @end="handleSortTask"
            >
              <div
                class="card tasks-box"
                v-for="task in status.tasks"
                :key="task.id"
                :data-progress="task.progress"
              >
                <div :class="`card-body ${resolveTaskVariant(task)}`">
                  <div class="d-flex mb-2">
                    <h6 class="fs-15 mb-0 flex-grow-1 text-truncate">
                      <i class="mdi mdi-drag mover cursor-move"></i>
                      <span
                        class="cursor-pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#editTaskModal"
                        @click="handleEditTask(task)"
                      >
                        &nbsp;{{ task.title }}
                      </span>
                    </h6>
                    <i
                      v-if="task.created_by === $store.state.user.data.username"
                      class="mdi mdi-delete-outline text-danger cursor-pointer"
                      data-bs-toggle="modal"
                      href="#deleteTaskModal"
                      @click="current_task = JSON.parse(JSON.stringify(task))"
                    ></i>
                  </div>
                  <p class="text-muted text-truncate-five-lines">
                    {{ replaceHtml(task.description) }}
                  </p>
                  <div class="mb-3">
                    <div class="d-flex mb-1">
                      <div class="flex-grow-1">
                        <h6 class="text-muted mb-0">
                          <span class="text-secondary">{{ task.progress }}%</span>
                        </h6>
                      </div>
                      <div class="flex-shrink-0">
                        <span class="text-muted" :title="task.due_date">
                          {{ $moment(task.due_date).add(1, 'd').fromNow() }}
                        </span>
                      </div>
                    </div>
                    <div class="progress rounded-3 progress-sm">
                      <div
                        class="progress-bar bg-success"
                        :style="{ width: `${task.progress}%` }"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <span
                        class="badge badge-soft-primary me-1 mb-1"
                        v-for="(tag, index) in task.tags"
                        :key="`${tag}_${index}`"
                      >
                        {{ tag }}
                      </span>
                    </div>
                    <div class="flex-shrink-0">
                      <Avatar :data="getTaskUsers(task.users)" size="xxs" />
                    </div>
                  </div>
                </div>
                <div :class="`card-footer ${resolveTaskVariant(task)} border-top-dashed`">
                  <div class="d-flex">
                    <div class="flex-grow-1">
                      <h6 class="text-muted mb-0">#{{ task.id }}</h6>
                    </div>
                    <div class="flex-shrink-0">
                      <ul class="link-inline mb-0">
                        <li class="list-inline-item">
                          <span class="text-muted" :title="task.created_at">
                            <i class="mdi mdi-clock-outline align-bottom"></i>
                            {{ $moment(task.created_at).fromNow() }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
            <button
              v-if="status.loading && !status.refetch"
              type="button"
              class="btn btn-soft-info btn-rounded btn-sm px-2 d-block mt-2"
              style="margin: 0 auto"
            >
              <i class="mdi mdi-spin mdi-loading me-2"></i>
              {{ $t('app.task.loading') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="editTaskModal"
      data-bs-focus="false"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">
              {{
                current_task.id
                  ? $t('app.task.editTaskModal.editTask')
                  : $t('app.task.editTaskModal.createTask')
              }}
            </h5>
            <button
              type="button"
              class="btn-close"
              id="hideEditTaskModalBtn"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitTask" :key="current_task.key">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.title') }}</label>
                    <Field
                      name="title"
                      v-model="current_task.title"
                      type="text"
                      :placeholder="$t('app.task.editTaskModal.form.title')"
                      :class="['form-control', errors.title && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.title }}</span>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">
                      {{ $t('app.task.editTaskModal.form.dueDate') }}
                    </label>
                    <FlatPickr
                      v-model="current_task.due_date"
                      :class="['form-control', errors.due_date && 'is-invalid']"
                      :placeholder="$t('app.task.editTaskModal.form.dueDate')"
                    ></FlatPickr>
                    <Field
                      name="due_date"
                      v-model="current_task.due_date"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.due_date }}</span>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.status') }}</label>
                    <VueSelect
                      v-model="current_task.status"
                      :placeholder="$t('app.task.editTaskModal.form.status')"
                      :class="errors.status && 'is-invalid'"
                      :reduce="(status) => status.value"
                      label="title"
                      :options="statuses"
                      :selectable="
                        (status) => status.condition({ progress: Number(current_task.progress) })
                      "
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                      </template>
                    </VueSelect>
                    <Field
                      name="status"
                      v-model="current_task.status"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.status }}</span>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">
                      {{ $t('app.task.editTaskModal.form.progress') }}
                    </label>
                    <Field
                      type="number"
                      name="progress"
                      :class="['form-control', errors.progress && 'is-invalid']"
                      :placeholder="$t('app.task.editTaskModal.form.progress')"
                      v-model="current_task.progress"
                      rules="required|between:0,100"
                      @input="handleChangeTaskProgress"
                    />
                    <span class="invalid-feedback">{{ errors.progress }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.users') }}</label>
                    <UsersSelector
                      v-model="current_task.users"
                      :placeholder="$t('app.task.editTaskModal.form.users')"
                      :class="[errors.users && 'is-invalid']"
                    />
                    <Field
                      name="users"
                      v-model="current_task.users"
                      :rules="`required|users:${$store.state.user.data.username}`"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.users }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.tags') }}</label>
                    <VueSelect
                      v-model="current_task.tags"
                      multiple
                      :close-on-select="false"
                      taggable
                      push-tags
                      :placeholder="$t('app.task.editTaskModal.form.tags')"
                      :class="errors.tags && 'is-invalid'"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
                      </template>
                    </VueSelect>
                    <Field name="tags" v-model="current_task.tags" class="d-none" />
                    <span class="invalid-feedback">{{ errors.tags }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('app.task.editTaskModal.form.description') }}
                    </label>
                    <CKEditor
                      v-model="current_task.description"
                      id="ck_task_description"
                      :error="{ id: 'ck_task_description', error: errors.description }"
                      :class="errors.description && 'is-invalid'"
                    />
                    <Field
                      name="description"
                      v-model="current_task.description"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button
                type="submit"
                class="btn btn-sm btn-success"
                :disabled="Object.keys(errors).length"
              >
                <i class="mdi mdi-content-save-outline"></i>
                {{
                  current_task.id
                    ? $t('app.task.editTaskModal.form.footer.save')
                    : $t('app.task.editTaskModal.form.footer.create')
                }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteTaskModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('app.task.deleteTaskModal.title', { name: current_task.title }) }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('app.task.deleteTaskModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                id="hideDelTaskModalBtn"
                data-bs-dismiss="modal"
              >
                {{ $t('app.task.deleteTaskModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelTask">
                {{ $t('app.task.deleteTaskModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, computed, nextTick } from 'vue';
import { getTasks, createTask, updateTask, sortTask } from '@api/app/task';
import CKEditor from '@components/CKEditor';
import { VueDraggableNext } from 'vue-draggable-next';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import store from '@store';
import { replaceHtml, getUserInfo } from '@utils';
import FlatPickr from '@components/FlatPickr';
import Avatar from '@components/Avatar';
import UsersSelector from '@components/UsersSelector';
import useTask from './useTask';
export default {
  components: {
    draggable: VueDraggableNext,
    CKEditor,
    FlatPickr,
    Avatar,
    UsersSelector,
  },
  setup() {
    const toast = useToast();
    const socket = window.socket;
    const moment = window.moment;

    const statuses = ref(
      JSON.parse(JSON.stringify(store.state.sys.cfg.task.statuses)).map((status) => {
        status.condition = new Function('task', `return ${status.condition}`);
        status.group = {
          name: 'group',
          /* eslint-disable-next-line no-unused-vars */
          put: (to, from, dragEl, evt) => {
            const status = statuses.value.find((status) => status.value === to.el.id);
            return status?.condition({ progress: Number(dragEl.getAttribute('data-progress')) });
          },
          pull: true,
        };
        status.total = 0;
        status.pageNum = 1;
        status.pageSize = 10;
        status.tasks = [];
        status.loading = false;
        return status;
      }),
    );

    const { resolveTaskVariant } = useTask();

    const search_users = ref([]);
    const search_keyword = ref('');

    const getTaskUsers = computed(() => {
      return (users) => {
        return users.map((username) => {
          return getUserInfo(username);
        });
      };
    });

    const fetchTasks = (status, callback) => {
      const data = {};
      data.status = status.value;
      data.pageNum = status.refetch ? 1 : status.pageNum;
      data.pageSize = status.refetch ? (status.pageNum - 1) * status.pageSize : status.pageSize;
      if (search_users.value.length) data.users = search_users.value.toString();
      if (search_keyword.value) data.keyword = search_keyword.value.trim();

      getTasks(data).then(({ code, data, msg }) => {
        if (code === 200) {
          status.total = data.count;
          if (status.refetch) {
            status.tasks = data.rows;
          } else {
            status.pageNum += 1;
            status.tasks.push(...data.rows);
          }
          setTimeout(() => {
            status.loading = false;
            status.refetch = false;
          }, 500);
          nextTick(() => {
            callback && callback();
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
      });
    };

    const refetchTasksHandler = (relates) => {
      statuses.value
        .filter((status) => relates.includes(status.value))
        .forEach((status) => {
          status.refetch = true;
          status.loading = true;
          fetchTasks(status);
        });
    };

    const scrollHandler = (e) => {
      const status = statuses.value.find(
        (status) => status.value === e.target.children[0].children[0].id,
      );
      const list = document
        .getElementById(`task-${status.value}`)
        ?.querySelector('.simplebar-content-wrapper');

      if (
        list &&
        list.scrollHeight - (list.scrollTop + list.offsetHeight) < 2 &&
        status.tasks.length < status.total &&
        !status.loading
      ) {
        status.loading = true;
        fetchTasks(status);
      }
    };

    onMounted(() => {
      socket.on('refetchTasks', refetchTasksHandler);
      statuses.value.forEach((status) => {
        fetchTasks(status, () => {
          const list = document
            .getElementById(`task-${status.value}`)
            ?.querySelector('.simplebar-content-wrapper');
          if (list) list.addEventListener('scroll', scrollHandler);
        });
      });
    });

    onUnmounted(() => {
      socket.removeListener('refetchTasks', refetchTasksHandler);
      statuses.value.forEach((status) => {
        const list = document
          .getElementById(`task-${status.value}`)
          ?.querySelector('.simplebar-content-wrapper');
        if (list) list.removeEventListener('scroll', scrollHandler);
      });
    });

    watch(
      () => [search_users.value, search_keyword.value],
      (newVal, oldVal) => {
        if (newVal && oldVal) {
          statuses.value.forEach((status) => {
            const list = document
              .getElementById(`task-${status.value}`)
              ?.querySelector('.simplebar-content-wrapper');
            if (list) list.scrollTop = 0;
            status.pageNum = 1;
            status.tasks = [];
            status.loading = true;
            fetchTasks(status);
          });
        }
      },
      { immediate: true },
    );

    const current_task = ref({});

    const handleCreateTask = () => {
      current_task.value = {
        key: Math.random().toString(36).slice(-6),
        title: '',
        description: '',
        tags: [],
        users: [store.state.user.data.username],
        due_date: moment().add(7, 'd').format('YYYY-MM-DD'),
        progress: 0,
        status: statuses.value[0].value,
        sort: 0,
      };
    };

    const handleEditTask = (task) => {
      current_task.value = JSON.parse(JSON.stringify(task));
      current_task.value.emits = current_task.value.users;
      current_task.value.relates = current_task.value.status;
    };

    const handleChangeTaskProgress = (e) => {
      const current = statuses.value.find((item) => item.value === current_task.value.status);
      if (!current.condition({ progress: Number(e.target.value || 0) })) {
        for (let index = 0; index < statuses.value.length; index++) {
          const status = statuses.value[index];
          if (status.condition({ progress: Number(e.target.value || 0) })) {
            current_task.value.status = status.value;
            break;
          }
        }
      }
    };

    const handleSubmitTask = () => {
      if (current_task.value.id) {
        const data = JSON.parse(JSON.stringify(current_task.value));
        data.emits = Array.from(new Set([...data.users, ...data.emits]));
        data.relates = Array.from(new Set([current_task.value.status, data.relates]));
        updateTask(data).then(({ code, msg }) => {
          if (code === 200) {
            document.getElementById('hideEditTaskModalBtn').click();
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
        createTask(current_task.value).then(({ code, msg }) => {
          if (code === 200) {
            document.getElementById('hideEditTaskModalBtn').click();
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

    const handleDelTask = () => {
      updateTask({
        id: current_task.value.id,
        data_state: 'deleted',
        emits: current_task.value.users,
        relates: [current_task.value.status],
      }).then(({ code, msg }) => {
        if (code === 200) {
          document.getElementById('hideDelTaskModalBtn').click();
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

    const handleSortTask = (e) => {
      if (!(e.to.id === e.from.id && e.newIndex === e.oldIndex)) {
        const to = statuses.value.find((status) => status.value === e.to.id);
        sortTask({
          ids: to.tasks.map((task) => {
            return task.id;
          }),
          status: to.value,
          emits: to.tasks[e.newIndex].users,
          relates: Array.from(new Set([e.from.id, e.to.id])),
        }).then(({ code, msg }) => {
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
      }
    };

    return {
      search_users,
      search_keyword,
      replaceHtml,
      statuses,
      resolveTaskVariant,
      getTaskUsers,
      current_task,
      handleCreateTask,
      handleEditTask,
      handleChangeTaskProgress,
      handleSubmitTask,
      handleDelTask,
      handleSortTask,
    };
  },
};
</script>
