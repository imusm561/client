<template>
  <div class="card card-height-100">
    <div class="card-header border-0 align-items-center d-flex">
      <h4 class="card-title mb-0 flex-grow-1">
        {{ $t('layout.navbar.helper.org.role.roles') }}
        <i
          class="mdi mdi-shield-plus float-end fs-16 cursor-pointer"
          @click="handleCreateOrEditRole"
        />
      </h4>
    </div>
    <div class="card-body pt-0 pb-0">
      <div class="row">
        <div
          class="col-xl-4 col-md-6 pb-3"
          v-for="(role, index) in $store.state.org.roles"
          :key="index"
        >
          <div class="card tasks-box ribbon-box border ribbon-fill right">
            <div class="card-body bg-light">
              <div class="p-3 mt-n3 mx-n3">
                <div class="d-flex align-items-center">
                  <div class="fs-15 flex-grow-1 text-truncate">
                    <span class="cursor-pointer" @click="$emit('set-role', role)">
                      {{ role.name }}
                    </span>
                  </div>
                  <div v-if="role.id != 1 || $store.state.user.data.id === 1" class="flex-shrink-0">
                    <div class="d-flex gap-2 align-items-center my-n2">
                      <button type="button" class="btn p-0" @click="handleCreateOrEditRole(role)">
                        <i class="mdi mdi-square-edit-outline text-info"></i>
                      </button>
                      <button type="button" class="btn p-0" @click="handlePreDelRole(role)">
                        <i class="mdi mdi-delete-outline text-danger"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-muted text-truncate" :title="role.description">
                {{ role.description }}
              </p>
              <div class="mb-3">
                <div class="d-flex mb-1">
                  <div class="flex-grow-1">
                    <h6 class="text-muted mb-0">
                      <span class="text-secondary">
                        {{ getCheckedMenuCount(role.permissions) }}
                      </span>
                      / {{ forms.length }}
                    </h6>
                  </div>
                </div>
                <div class="progress rounded-3 progress-sm">
                  <div
                    class="progress-bar bg-soft-primary"
                    :style="{
                      width: `${(getCheckedMenuCount(role.permissions) / forms.length) * 100}%`,
                    }"
                  ></div>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="mw-50">
                  <span
                    v-if="role.tags.length > 0"
                    class="badge badge-soft-primary me-1 text-truncate"
                    :title="role.tags[0]"
                  >
                    {{ role.tags[0] }}
                  </span>
                  <span
                    v-if="role.tags.length > 1"
                    class="badge badge-soft-success me-1 text-truncate"
                    :title="role.tags.slice(1).join(', ')"
                  >
                    +{{ role.tags.length - 1 }}
                  </span>
                </div>
                <div class="flex-shrink-0">
                  <Avatar :data="resolveRoleUsers(role)" size="xxs" />
                </div>
              </div>
            </div>
            <div class="card-footer border-top-dashed bg-light">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <h6 class="text-muted mb-0">#{{ role.id }}</h6>
                </div>
                <div class="flex-shrink-0">
                  <ul class="link-inline mb-0">
                    <li class="list-inline-item">
                      <span class="text-muted">
                        <i class="mdi mdi-clock-outline align-bottom"></i>
                        {{ dayjs(role.updated_at || role.created_at).fromNow() }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      id="showEditOrCreateRoleModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#editOrCreateRoleModal"
    />
    <div
      class="modal fade"
      id="editOrCreateRoleModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">
              {{
                current_role.id
                  ? current_role.name
                  : $t('layout.navbar.helper.org.role.editOrCreateRoleModal.newRole')
              }}
            </h5>
            <button
              type="button"
              id="hideEditOrCreateRoleModalBtn"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitRole" :key="editOrCreateRoleModalKey">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-lg-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.name') }}
                    </label>
                    <Field
                      name="name"
                      v-model="current_role.name"
                      type="text"
                      :placeholder="
                        $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.name')
                      "
                      :class="['form-control', errors.name && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.name }}</span>
                  </div>

                  <div class="col-lg-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.tags') }}
                    </label>
                    <VueSelect
                      v-model="current_role.tags"
                      multiple
                      :close-on-select="false"
                      taggable
                      push-tags
                      :placeholder="
                        $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.tags')
                      "
                      :options="['HR', 'OE', 'DBA']"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
                      </template>
                    </VueSelect>
                  </div>
                  <div class="col-lg-12">
                    <label class="form-label">
                      {{
                        $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.description')
                      }}
                    </label>
                    <textarea
                      :class="['form-control', errors.description && 'is-invalid']"
                      v-model="current_role.description"
                      :placeholder="
                        $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.description')
                      "
                      rows="3"
                    />
                    <Field
                      name="description"
                      v-model="current_role.description"
                      class="d-none"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                  <div class="col-lg-12 d-none d-lg-block" v-if="current_role.permissions">
                    <label class="form-label">
                      {{
                        $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions')
                      }}
                    </label>
                    <div class="float-end text-info">
                      <span class="cursor-pointer" @click="handleCopyPermissions">
                        <i class="mdi mdi-content-copy" />
                        {{
                          $t(
                            'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.copy',
                          )
                        }}
                      </span>
                      /
                      <span class="cursor-pointer" @click="handlePastePermissions">
                        <i class="mdi mdi-content-duplicate" />
                        {{
                          $t(
                            'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.paste',
                          )
                        }}
                      </span>
                    </div>
                    <BaseTree v-model="tree" nodeKey="id">
                      <template #default="{ node, stat }">
                        <span
                          class="tree-node-info d-flex align-items-center w-100"
                          :title="node.title"
                          @click="stat.open = !stat.open"
                        >
                          <i
                            style="margin-right: 5px"
                            class="mdi"
                            :class="{
                              'mdi-folder-open-outline': stat.open,
                              'mdi-folder-outline': !stat.open,
                              'opacity-0': !node.children,
                            }"
                          />
                          <div class="form-check ms-1">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              v-model="current_role.permissions[node.id].checked"
                              :indeterminate="current_role.permissions[node.id].half_checked"
                              @change="handleSetCheckStatus(stat)"
                              @click.stop="() => {}"
                            />
                            <label class="form-check-label">
                              <span class="w-100 text-truncate">
                                <i :class="['mdi me-1', node.icon || 'mdi-circle-medium']"></i>
                                {{ node.title }}
                                <span
                                  :class="`ms-2 badge badge-soft-${
                                    node.status === 1 ? 'primary' : 'danger'
                                  }`"
                                >
                                  {{
                                    node.status === 1
                                      ? $t(
                                          'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.status.enable',
                                        )
                                      : $t(
                                          'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.status.disabled',
                                        )
                                  }}
                                </span>
                              </span>
                            </label>
                          </div>
                        </span>
                        <span
                          class="text-nowrap"
                          v-if="!node.children && current_role.permissions[node.id].checked"
                        >
                          <div v-if="node.redirect">
                            <div class="form-check form-check-danger ms-3">
                              <input class="form-check-input" type="checkbox" disabled checked />
                              <label class="form-check-label">{{ node.redirect }}</label>
                            </div>
                          </div>
                          <div v-else class="d-flex">
                            <div class="form-check form-check-danger ms-3">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :disabled="current_role.permissions[node.id]?.all"
                                v-model="current_role.permissions[node.id].create"
                              />
                              <label class="form-check-label">
                                {{
                                  $t(
                                    'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.permission.create',
                                  )
                                }}
                              </label>
                            </div>
                            <div class="form-check form-check-success ms-3">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :disabled="current_role.permissions[node.id]?.all"
                                v-model="current_role.permissions[node.id].edit"
                              />
                              <label class="form-check-label">
                                {{
                                  $t(
                                    'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.permission.edit',
                                  )
                                }}
                              </label>
                            </div>
                            <div class="form-check form-check-warning ms-3">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :disabled="current_role.permissions[node.id]?.all"
                                v-model="current_role.permissions[node.id].batch"
                              />
                              <label class="form-check-label">
                                {{
                                  $t(
                                    'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.permission.batch',
                                  )
                                }}
                              </label>
                            </div>
                            <div class="form-check form-check-info ms-3">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :disabled="current_role.permissions[node.id]?.all"
                                v-model="current_role.permissions[node.id].export"
                              />
                              <label class="form-check-label">
                                {{
                                  $t(
                                    'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.permission.export',
                                  )
                                }}
                              </label>
                            </div>
                            <div class="form-check form-check-secondary ms-3">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :disabled="current_role.permissions[node.id]?.all"
                                v-model="current_role.permissions[node.id].import"
                              />
                              <label class="form-check-label">
                                {{
                                  $t(
                                    'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.permission.import',
                                  )
                                }}
                              </label>
                            </div>
                            <div class="form-check ms-3">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="current_role.permissions[node.id].all"
                              />
                              <label class="form-check-label">
                                {{
                                  $t(
                                    'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.form.permission.all',
                                  )
                                }}
                              </label>
                            </div>
                          </div>
                        </span>
                      </template>
                    </BaseTree>
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
                  current_role.id
                    ? $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.footer.save')
                    : $t('layout.navbar.helper.org.role.editOrCreateRoleModal.form.footer.create')
                }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <button
      id="showDeleteRoleModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#deleteRoleModal"
    />
    <div class="modal fade" id="deleteRoleModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              id="hideDeleteRoleModalBtn"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{
                    $t('layout.navbar.helper.org.role.deleteRoleModal.title', {
                      name: current_role.name,
                    })
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.org.role.deleteRoleModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">
                {{ $t('layout.navbar.helper.org.role.deleteRoleModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelRole">
                {{ $t('layout.navbar.helper.org.role.deleteRoleModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { BaseTree } from '@he-tree/vue';
import { nanoid } from 'nanoid';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { listToTree, copyToClipboard, pasteFromClipboard } from '@utils';
import i18n from '@utils/i18n';
import dayjs from '@utils/dayjs';
import store from '@store';
import Avatar from '@components/Avatar';
import { createRole, updateRole } from '@api/role';
import { getForms } from '@api/form';

const toast = useToast();

const getCheckedMenuCount = computed(() => {
  return (permissions) => {
    let count = 0;
    for (let key in permissions) {
      if (permissions[key].checked) count += 1;
    }
    return count;
  };
});

const resolveRoleUsers = computed(() => {
  return (role) => {
    return store.state.org.users.filter((user) => user.role.includes(role.id));
  };
});

const current_role = ref({});
const editOrCreateRoleModalKey = ref(null);

const handleCreateOrEditRole = (role) => {
  current_role.value = JSON.parse(JSON.stringify(role || {}));
  current_role.value.permissions = current_role.value.permissions || {};
  forms.value.forEach((form) => {
    current_role.value.permissions[form.id] = current_role.value.permissions[form.id] || {};
  });
  editOrCreateRoleModalKey.value = nanoid();
  document.getElementById('showEditOrCreateRoleModalBtn').click();
};

const forms = ref([]);
onMounted(() => {
  getForms().then(({ code, data, msg }) => {
    if (code === 200) {
      forms.value = data;
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

const tree = computed(() => {
  return listToTree(JSON.parse(JSON.stringify(forms.value)));
});

const handleSetParentCheckStatus = (stat) => {
  current_role.value.permissions[stat.data.id].checked = stat.children.every(
    (child) => current_role.value.permissions[child.data.id].checked,
  );
  if (current_role.value.permissions[stat.data.id].checked) {
    current_role.value.permissions[stat.data.id].half_checked = false;
  } else {
    current_role.value.permissions[stat.data.id].half_checked = stat.children.some(
      (child) =>
        current_role.value.permissions[child.data.id].checked ||
        current_role.value.permissions[child.data.id].half_checked,
    );
  }
  if (stat.parent) handleSetParentCheckStatus(stat.parent);
};

const handleSetChildCheckStatus = (stat) => {
  stat.children.forEach((child) => {
    current_role.value.permissions[child.data.id].checked =
      current_role.value.permissions[stat.data.id].checked;
    current_role.value.permissions[child.data.id].half_checked = false;
    handleSetChildCheckStatus(child);
  });
};

const handleSetCheckStatus = (stat) => {
  current_role.value.permissions[stat.data.id].half_checked = false;
  if (stat.parent) handleSetParentCheckStatus(stat.parent);
  handleSetChildCheckStatus(stat);
};

const handleCopyPermissions = () => {
  const text = {
    keyword: `copy_role_permissions_at_${dayjs().format('YYYY-MM-DD')}_by_${
      store.state.user.data.username
    }`,
    permissions: current_role.value.permissions,
  };
  copyToClipboard(JSON.stringify(text))
    .then(() => {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: i18n.global.t(
            'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.copy.success',
          ),
        },
      });
    })
    .catch((error) => {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: error.message,
        },
      });
    });
};

const handlePastePermissions = () => {
  pasteFromClipboard()
    .then((text) => {
      if (
        text.includes(
          `copy_role_permissions_at_${dayjs().format('YYYY-MM-DD')}_by_${
            store.state.user.data.username
          }`,
        )
      ) {
        try {
          text = JSON.parse(text);
          if (text.permissions && typeof text.permissions === 'object') {
            current_role.value.permissions = text.permissions;
            toast({
              component: ToastificationContent,
              props: {
                variant: 'success',
                icon: 'mdi-check-circle',
                text: i18n.global.t(
                  'layout.navbar.helper.org.role.editOrCreateRoleModal.form.permissions.paste.success',
                ),
              },
            });
          }
        } catch (error) {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: error.message,
            },
          });
        }
      }
    })
    .catch((error) => {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: error.message,
        },
      });
    });
};

const handleSubmitRole = () => {
  if (
    !current_role.value.id &&
    store.state.org.roles.filter((role) => role.name === current_role.value.name).length
  ) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.role.create.error', {
          name: current_role.value.name,
        }),
      },
    });
    return;
  }

  if (current_role.value.id) {
    if (store.state.user.data.id != 1 && current_role.value.tags) {
      const newTags = current_role.value.tags.filter(
        (n) =>
          !store.state.org.roles.find((role) => role.id === current_role.value.id).tags.includes(n),
      );
      if (current_role.value.tags?.length)
        current_role.value.tags = current_role.value.tags.map((tag) => {
          return newTags.includes(tag) && ['HR', 'OE', 'DBA'].includes(tag)
            ? `*${tag.toLowerCase()}`
            : tag;
        });
    }
    delete current_role.value.created_at;
    delete current_role.value.created_by;
    delete current_role.value.updated_at;
    delete current_role.value.updated_by;
    updateRole(current_role.value).then(() => {
      document.getElementById('hideEditOrCreateRoleModalBtn').click();
    });
  } else {
    if (store.state.user.data.id != 1 && current_role.value.tags?.length) {
      current_role.value.tags = current_role.value.tags.map((tag) => {
        return ['HR', 'OE', 'DBA'].includes(tag) ? `*${tag.toLowerCase()}` : tag;
      });
    }
    createRole(current_role.value).then(() => {
      document.getElementById('hideEditOrCreateRoleModalBtn').click();
    });
  }
};

const handlePreDelRole = (role) => {
  if (store.state.org.users.filter((user) => user.role.includes(role.id)).length !== 0) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: i18n.global.t('layout.navbar.helper.org.role.delete.error', { name: role.name }),
      },
    });
  } else {
    current_role.value = JSON.parse(JSON.stringify(role));
    current_role.value.permissions = current_role.value.permissions || {};
    forms.value.forEach((form) => {
      current_role.value.permissions[form.id] = current_role.value.permissions[form.id] || {};
    });
    document.getElementById('showDeleteRoleModalBtn').click();
  }
};

const handleDelRole = () => {
  updateRole({
    id: current_role.value.id,
    data_state: 'deleted',
  }).then(() => {
    document.getElementById('hideDeleteRoleModalBtn').click();
  });
};
</script>
