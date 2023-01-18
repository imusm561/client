<template>
  <div class="task-wrapper mt-n4 mx-n4 pe-1 ps-1 pt-1">
    <div class="card mb-2" style="border-radius: 0px">
      <div class="card-body d-md-none d-flex justify-content-between">
        <div class="search-box w-75">
          <input v-model="search_keyword" type="text" class="form-control" :placeholder="$t('app.task.search')" />
          <i class="mdi mdi-magnify fs-16 search-icon"></i>
        </div>
        <button class="btn btn-primary ms-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#editTaskModal" @click="handleCreateTask">{{ $t('app.task.create') }}</button>
      </div>
      <div class="card-body d-none d-md-flex justify-content-between">
        <div class="w-25 d-none d-md-block">
          <VueSelect v-model="search_users" multiple :close-on-select="false" :placeholder="$t('app.task.filter')" :reduce="(item) => item.username" label="fullname" :options="$store.state.org.users">
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
            <input v-model="search_keyword" type="text" class="form-control" :placeholder="$t('app.task.search')" />
            <i class="mdi mdi-magnify fs-16 search-icon"></i>
          </div>
          <button class="btn btn-primary ms-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#editTaskModal" @click="handleCreateTask">{{ $t('app.task.create') }}</button>
        </div>
      </div>
    </div>

    <div class="tasks-board p-2">
      <div class="tasks-list" v-for="(item, index) in status" :key="index">
        <div class="d-flex align-items-center mb-3">
          <h5 class="text-uppercase fw-semibold mb-0 me-1">
            {{ item.title }}
          </h5>
          <small :class="`badge bg-${item.variant}`">{{ item.tasks.length }}</small>
        </div>
        <div data-simplebar class="tasks-wrapper mb-1 px-3 mx-n3">
          <div class="tasks">
            <draggable :list="item.tasks" :id="item.value" class="dragArea" handle=".mover" :group="item.group" @end="handleSortTask">
              <div class="card tasks-box" v-for="task in item.tasks" :key="task.id" :data-progress="task.progress">
                <div :class="`card-body ${resolveTaskVariant(task)}`">
                  <div class="d-flex mb-2">
                    <h6 class="fs-15 mb-0 flex-grow-1 text-truncate">
                      <i class="mdi mdi-drag mover cursor-move"></i>
                      <span class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#editTaskModal" @click="handleEditTask(task)">&nbsp;{{ task.title }}</span>
                    </h6>
                    <i
                      v-if="task.created_by === $store.state.user.data.username"
                      class="mdi mdi-delete-outline text-danger cursor-pointer"
                      data-bs-toggle="modal"
                      href="#deleteTaskModal"
                      @click="current_task = JSON.parse(JSON.stringify(task))"
                    ></i>
                  </div>
                  <p class="text-muted text-truncate-five-lines">{{ replaceHtml(task.description) }}</p>
                  <div class="mb-3">
                    <div class="d-flex mb-1">
                      <div class="flex-grow-1">
                        <h6 class="text-muted mb-0">
                          <span class="text-secondary">{{ task.progress }}%</span>
                        </h6>
                      </div>
                      <div class="flex-shrink-0">
                        <span class="text-muted" :title="task.due_date">{{ $moment(task.due_date).add(1, 'd').fromNow() }}</span>
                      </div>
                    </div>
                    <div class="progress rounded-3 progress-sm">
                      <div class="progress-bar bg-success" :style="{ width: `${task.progress}%` }" aria-valuemax="100"></div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <span class="badge badge-soft-primary me-1 mb-1" v-for="(tag, index) in task.tags" :key="`${tag}_${index}`">{{ tag }}</span>
                    </div>
                    <div class="flex-shrink-0">
                      <div class="avatar-group">
                        <span v-for="(user, index) in task._users" :key="index" class="avatar-group-item cursor-pointer" :title="user.title || user.fullname">
                          <Avatar :data="user" size="xxs" />
                        </span>
                      </div>
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
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editTaskModal" data-bs-focus="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">{{ current_task.id ? $t('app.task.editTaskModal.editTask') : $t('app.task.editTaskModal.createTask') }}</h5>
            <button type="button" class="btn-close" id="hideEditTaskModalBtn" data-bs-dismiss="modal"></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitTask">
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
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.dueDate') }}</label>
                    <FlatPickr v-model="current_task.due_date" :class="['form-control', errors.due_date && 'is-invalid']" :placeholder="$t('app.task.editTaskModal.form.dueDate')"></FlatPickr>
                    <Field name="due_date" v-model="current_task.due_date" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.due_date }}</span>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.status') }}</label>
                    <VueSelect
                      v-model="current_task.status"
                      :placeholder="$t('app.task.editTaskModal.form.status')"
                      :class="errors.status && 'is-invalid'"
                      :reduce="(item) => item.value"
                      label="title"
                      :options="status"
                      :selectable="
                        (option) =>
                          current_task.progress <= 0
                            ? ['todo', 'urgent'].includes(option.value)
                            : current_task.progress >= 100
                            ? ['review', 'completed'].includes(option.value)
                            : ['urgent', 'inprogress'].includes(option.value)
                      "
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                      </template>
                    </VueSelect>
                    <Field name="status" v-model="current_task.status" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.status }}</span>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.progress') }}</label>
                    <Field
                      type="number"
                      name="progress"
                      :class="['form-control', errors.progress && 'is-invalid']"
                      :placeholder="$t('app.task.editTaskModal.form.progress')"
                      v-model="current_task.progress"
                      rules="required|between:0,100"
                      @input="current_task.status = current_task.progress <= 0 ? 'todo' : current_task.progress >= 100 ? 'review' : 'inprogress'"
                    />
                    <span class="invalid-feedback">{{ errors.progress }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.users') }}</label>
                    <UsersSelector v-model="current_task.users" :placeholder="$t('app.task.editTaskModal.form.users')" :class="[errors.users && 'is-invalid']" />
                    <Field name="users" v-model="current_task.users" :rules="`required|include:${$store.state.user.data.username}`" class="d-none" />
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
                    <Field name="tags" v-model="current_task.tags" rules="" class="d-none" />
                    <span class="invalid-feedback">{{ errors.tags }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('app.task.editTaskModal.form.description') }}</label>
                    <CKEditor
                      v-model="current_task.description"
                      id="ck_task_description"
                      :error="{ id: 'ck_task_description', error: errors.description }"
                      :class="errors.description && 'is-invalid'"
                    />
                    <Field name="description" v-model="current_task.description" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button type="submit" class="btn btn-sm btn-success" :disabled="Object.keys(errors).length">
                <i class="mdi mdi-content-save-outline"></i>
                {{ current_task.id ? $t('app.task.editTaskModal.form.footer.save') : $t('app.task.editTaskModal.form.footer.create') }}
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
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btn-close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('app.task.deleteTaskModal.title', { name: current_task.title }) }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('app.task.deleteTaskModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" id="hideDelTaskModalBtn" data-bs-dismiss="modal">{{ $t('app.task.deleteTaskModal.cancel') }}</button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelTask">{{ $t('app.task.deleteTaskModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue';
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
import i18n from '@utils/i18n';
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

    const search_users = ref([]);
    const search_keyword = ref('');

    const resolveTaskVariant = (task) => {
      if (task.progress === 100) return 'bg-soft-success';
      if (new Date(task.due_date).getTime() < new Date().getTime()) return 'bg-soft-danger';
      else if (new Date(task.due_date).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000) return 'bg-soft-primary';
      else return null;
    };

    const filterKeyword = (str) => {
      if (!search_keyword.value) return true;
      return str.toLowerCase().includes(search_keyword.value.toLowerCase());
    };

    const filterUsers = (users) => {
      if (search_users.value.length === 0) return true;
      return search_users.value.every((username) => users.includes(username));
    };

    const setTaskStatusList = () => {
      status.value = status.value.map((item) => {
        item.group = {
          name: 'group',
          /* eslint-disable-next-line no-unused-vars */
          put: (to, from, dragEl, evt) => {
            return ['todo'].includes(to.el.id)
              ? Number(dragEl.getAttribute('data-progress')) <= 0
              : ['urgent'].includes(to.el.id)
              ? Number(dragEl.getAttribute('data-progress')) < 100
              : ['inprogress'].includes(to.el.id)
              ? Number(dragEl.getAttribute('data-progress')) > 0 && Number(dragEl.getAttribute('data-progress')) < 100
              : Number(dragEl.getAttribute('data-progress')) >= 100;
          },
          pull: true,
        };
        item.tasks = _tasks.value.filter((task) => task.status === item.value && (filterKeyword(task.title) || filterKeyword(replaceHtml(task.description))) && filterUsers(task.users));
        return item;
      });
    };

    const status = ref([
      {
        title: i18n.global.t('app.task.status.todo'),
        value: 'todo',
        variant: 'secondary', // ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'][Math.floor(Math.random() * 7)],
      },
      {
        title: i18n.global.t('app.task.status.urgent'),
        value: 'urgent',
        variant: 'warning',
      },
      {
        title: i18n.global.t('app.task.status.inprogress'),
        value: 'inprogress',
        variant: 'primary',
      },
      {
        title: i18n.global.t('app.task.status.review'),
        value: 'review',
        variant: 'info',
      },
      {
        title: i18n.global.t('app.task.status.completed'),
        value: 'completed',
        variant: 'success',
      },
    ]);

    const _tasks = ref([]);
    const fetchTasks = () => {
      getTasks().then(({ code, data, msg }) => {
        if (code === 200) {
          _tasks.value = data.map((task) => {
            task._users = task.users
              .filter((username) => getUserInfo(username))
              .slice(0, 4)
              .map((username) => {
                return getUserInfo(username);
              });
            if (task.users.length > 5)
              task._users.push({
                more: '···',
                title: task.users
                  .slice(4)
                  .map((u) => {
                    return u.fullname;
                  })
                  .toString(),
              });
            return task;
          });
          setTaskStatusList();
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

    onMounted(() => {
      fetchTasks();
      socket.on('refetchTasks', () => {
        fetchTasks();
      });
    });

    onUnmounted(() => {
      socket.removeListener('refetchTasks');
    });

    watch(
      () => search_users.value,
      () => {
        setTaskStatusList();
      },
      { immediate: true },
    );

    watch(
      () => search_keyword.value,
      () => {
        setTaskStatusList();
      },
      { immediate: true },
    );

    const current_task = ref({});

    const handleCreateTask = () => {
      current_task.value = {
        title: '',
        description: '',
        tags: [],
        users: [store.state.user.data.username],
        due_date: moment().add(7, 'd').format('YYYY-MM-DD'),
        progress: 0,
        status: 'todo',
        sort: 0,
      };
    };

    const handleEditTask = (task) => {
      current_task.value = JSON.parse(JSON.stringify(task));
    };

    const handleSubmitTask = () => {
      if (current_task.value.id) {
        const data = JSON.parse(JSON.stringify(current_task.value));
        delete data._users;
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
        const toStatus = status.value.find((item) => item.value === e.to.id);
        sortTask({
          ids: toStatus.tasks.map((task) => {
            return task.id;
          }),
          status: toStatus.value,
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
      status,
      resolveTaskVariant,
      current_task,
      handleCreateTask,
      handleEditTask,
      handleSubmitTask,
      handleDelTask,
      handleSortTask,
    };
  },
};
</script>
