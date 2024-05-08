<template>
  <div class="card card-height-100">
    <div class="card-body">
      <div class="row">
        <div class="col-md-3 mb-3">
          <div class="sticky-side-div">
            <div class="align-items-center d-flex">
              <h4 class="flex-grow-1">{{ $t('layout.navbar.helper.form.column.components') }}</h4>
            </div>
            <div class="p-1">
              <div class="mb-3" v-for="(item, tidx) in components" :key="tidx">
                <h5 class="text-primary">
                  <i :class="`mdi ${item.icon}`" />
                  {{ $t(item.title) }}
                </h5>
                <VueDraggableNext
                  class="row"
                  :list="item.list"
                  :group="{ name: 'component', pull: 'clone', put: false }"
                  :sort="false"
                >
                  <div class="col-sm-6 p-1" v-for="(component, cidx) in item.list" :key="cidx">
                    <div class="drag-item text-truncate cursor-move p-2">
                      <i :class="`mdi ${component.icon}`" />
                      {{ $t(component.name) }}
                    </div>
                  </div>
                </VueDraggableNext>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="d-flex">
            <div class="flex-grow-1">
              <h4>
                <code>#{{ form.id }}</code>
                <span class="ms-2">
                  {{ form.title }} {{ $t('layout.navbar.helper.form.column.columns') }}
                </span>
              </h4>
            </div>
            <div class="flex-shrink-0">
              <div class="d-flex align-items-center">
                <div class="text-info me-2">
                  <span class="cursor-pointer" @click="handleCopyColumns">
                    <i class="mdi mdi-content-copy" />
                    {{ $t('layout.navbar.helper.form.column.components.copy') }}
                  </span>
                  /
                  <span class="cursor-pointer" @click="handlePasteColumns">
                    <i class="mdi mdi-content-duplicate" />
                    {{ $t('layout.navbar.helper.form.column.components.paste') }}
                  </span>
                </div>
                <button
                  v-if="changes.create.length || changes.update.length || changes.delete.length"
                  type="button"
                  :disabled="
                    saving &&
                    (changes.create.length || changes.update.length || changes.delete.length)
                  "
                  class="btn btn-sm btn-soft-secondary btn-icon waves-effect waves-light ms-1"
                  @click="handleSaveFormColumns"
                >
                  <i class="fs-20 mdi mdi-content-save"></i>
                </button>
                <button
                  v-if="changes.create.length || changes.update.length || changes.delete.length"
                  type="button"
                  class="btn btn-sm btn-soft-success btn-icon waves-effect waves-light ms-1"
                  @click="handleRestoreFormColumns"
                >
                  <i class="fs-20 mdi mdi-restore"></i>
                </button>
              </div>
            </div>
          </div>
          <VueDraggableNext
            class="row mt-2"
            :style="{ height: columns.length === 0 ? '100px' : 'auto' }"
            :list="columns"
            :animation="300"
            :group="{ name: 'component' }"
            @add="handleAddColumn"
            @sort="handleSortColumn"
          >
            <div
              :class="`col-sm-${column.col || 12} pe-1 ps-1`"
              v-for="(column, index) in columns"
              :key="index"
            >
              <div
                :class="[
                  'mb-3',
                  'p-2',
                  !column.id
                    ? 'bg-soft-primary'
                    : changes.update
                        .map((item) => {
                          return item.id;
                        })
                        .includes(column.id)
                    ? 'bg-soft-warning'
                    : 'bg-light',
                ]"
              >
                <div class="form-label float-end">
                  <i
                    v-if="Object.keys(column.cfg).length"
                    class="mdi mdi-cog-outline text-primary ms-1 cursor-pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#viewAndEditColumnModal"
                    @click="current_column = column"
                  />
                  <i
                    class="mdi mdi-content-copy text-success ms-1 cursor-pointer"
                    @click="
                      () => {
                        const copy_column = JSON.parse(JSON.stringify(columns[index]));
                        copy_column.alias = null;
                        copy_column.name = $t(
                          'layout.navbar.helper.form.column.components.duplicate',
                          { name: copy_column.name },
                        );
                        delete copy_column.id;
                        delete copy_column.uuid;
                        delete copy_column.data_state;
                        delete copy_column.created_at;
                        delete copy_column.created_by;
                        delete copy_column.updated_at;
                        delete copy_column.updated_by;
                        columns.splice(index + 1, 0, copy_column);
                      }
                    "
                  />
                  <i
                    class="mdi mdi-delete-outline text-danger ms-1 cursor-pointer"
                    @click="
                      () => {
                        columns.splice(index, 1);
                        handleSortColumn();
                      }
                    "
                  />
                </div>
                <component :is="column.component" :column="column" type="DESIGN"></component>
              </div>
            </div>
          </VueDraggableNext>
          <Empty
            v-if="columns.length === 0"
            :text="$t('layout.navbar.helper.form.column.components.empty')"
          />
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="viewAndEditColumnModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <Form v-slot="{ errors }">
            <div class="modal-header p-2 bg-light justify-content-start">
              <h5 class="modal-title">#{{ current_column.id || 0 }}</h5>
              <div v-if="current_column.created_at" class="vr me-2 ms-2"></div>
              <div v-if="current_column.created_at" class="text-muted">
                {{
                  $t('layout.navbar.helper.form.column.config.create', {
                    user: getUserInfo(current_column.created_by).fullname,
                    time: dayjs(current_column.created_at).format('llll'),
                  })
                }}
              </div>
              <div v-if="current_column.updated_at" class="vr me-2 ms-2"></div>
              <div v-if="current_column.updated_at" class="text-muted">
                {{
                  $t('layout.navbar.helper.form.column.config.update', {
                    user: getUserInfo(current_column.updated_by).fullname,
                    time: dayjs(current_column.updated_at).format('llll'),
                  })
                }}
              </div>
              <button
                type="button"
                class="btn-close"
                :disabled="Object.keys(errors).length"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div>
                  <component
                    :is="`${current_column.component}Config`"
                    v-model="current_column"
                    :errors="errors"
                    :alias="
                      columns
                        .filter((column) => column.id != current_column.id && column.alias)
                        .map((column) => {
                          return column.alias;
                        })
                        .join('0x2C')
                    "
                  />
                </div>
              </div>
            </div>
            <!-- <div class="modal-footer p-3 pt-1 pb-1">
              <button type="button" class="btn btn-sm btn-primary" :disabled="Object.keys(errors).length" data-bs-dismiss="modal">Close</button>
            </div> -->
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { getChanges, copyToClipboard, pasteFromClipboard, getUserInfo } from '@utils';
import i18n from '@utils/i18n';
import dayjs from '@utils/dayjs';

import store from '@store';

import Empty from '@components/Empty';
import components from '@components/Column';

import InputText from '@components/Column/Input/Text/index.vue';
import InputNumber from '@components/Column/Input/Number/index.vue';
import InputNumberConfig from '@components/Column/Input/Number/config.vue';
import InputMaska from '@components/Column/Input/Maska/index.vue';
import InputMaskaConfig from '@components/Column/Input/Maska/config.vue';
import InputTextConfig from '@components/Column/Input/Text/config.vue';
import InputTextarea from '@components/Column/Input/Textarea/index.vue';
import InputTextareaConfig from '@components/Column/Input/Textarea/config.vue';
import InputRichtext from '@components/Column/Input/Richtext/index.vue';
import InputRichtextConfig from '@components/Column/Input/Richtext/config.vue';
import InputCode from '@components/Column/Input/Code/index.vue';
import InputCodeConfig from '@components/Column/Input/Code/config.vue';

import SelectSingle from '@components/Column/Select/Single/index.vue';
import SelectSingleConfig from '@components/Column/Select/Single/config.vue';
import SelectMultiple from '@components/Column/Select/Multiple/index.vue';
import SelectMultipleConfig from '@components/Column/Select/Multiple/config.vue';
import SelectTags from '@components/Column/Select/Tags/index.vue';
import SelectTagsConfig from '@components/Column/Select/Tags/config.vue';
import SelectDatetime from '@components/Column/Select/Datetime/index.vue';
import SelectDatetimeConfig from '@components/Column/Select/Datetime/config.vue';
import SelectPosition from '@components/Column/Select/Position/index.vue';
import SelectPositionConfig from '@components/Column/Select/Position/config.vue';
import SelectFile from '@components/Column/Select/File/index.vue';
import SelectFileConfig from '@components/Column/Select/File/config.vue';
import SelectSwitch from '@components/Column/Select/Switch/index.vue';
import SelectSwitchConfig from '@components/Column/Select/Switch/config.vue';

import LayoutButton from '@components/Column/Layout/Button/index.vue';
import LayoutButtonConfig from '@components/Column/Layout/Button/config.vue';
import LayoutTitle from '@components/Column/Layout/Title/index.vue';
import LayoutTitleConfig from '@components/Column/Layout/Title/config.vue';
import LayoutSeparator from '@components/Column/Layout/Separator/index.vue';
import LayoutSeparatorConfig from '@components/Column/Layout/Separator/config.vue';
import LayoutTab from '@components/Column/Layout/Tab/index.vue';
import LayoutTabConfig from '@components/Column/Layout/Tab/config.vue';

import { getColumns, syncColumns } from '@api/column';

// eslint-disable-next-line
defineOptions({
  components: {
    InputText,
    InputTextConfig,
    InputNumber,
    InputNumberConfig,
    InputMaska,
    InputMaskaConfig,
    InputTextarea,
    InputTextareaConfig,
    InputRichtext,
    InputRichtextConfig,
    InputCode,
    InputCodeConfig,

    SelectSingle,
    SelectSingleConfig,
    SelectMultiple,
    SelectMultipleConfig,
    SelectTags,
    SelectTagsConfig,
    SelectDatetime,
    SelectDatetimeConfig,
    SelectPosition,
    SelectPositionConfig,
    SelectFile,
    SelectFileConfig,
    SelectSwitch,
    SelectSwitchConfig,

    LayoutButton,
    LayoutButtonConfig,
    LayoutTitle,
    LayoutTitleConfig,
    LayoutSeparator,
    LayoutSeparatorConfig,
    LayoutTab,
    LayoutTabConfig,
  },
});

// eslint-disable-next-line
const props = defineProps({
  form: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

// eslint-disable-next-line
const emits = defineEmits(['setColumnsChangedFlag']);

const toast = useToast();

let server_columns = [];
const columns = ref([]);
const changes = ref({
  create: [],
  update: [],
  delete: [],
});

const current_column = ref({});

const fetchColumns = (tid) => {
  current_column.value = {};
  getColumns({ tid }).then(({ code, data, msg }) => {
    if (code === 200) {
      server_columns = data;
      columns.value = JSON.parse(JSON.stringify(server_columns));
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

watch(
  () => props.form.id,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      columns.value = [];
      changes.value = [];
      if (newVal) fetchColumns(newVal);
    }
  },
  { immediate: true },
);

watch(
  () => columns.value,
  (val) => {
    const create_columns = val.filter((item) => !item.id);
    const existe_columns = val.filter((item) => item.id);

    changes.value.create = create_columns;

    changes.value.update = [];
    existe_columns.forEach((cloumn) => {
      let server_item = server_columns.find((item) => item.id === cloumn.id);
      let existe_item = existe_columns.find((item) => item.id === cloumn.id);
      const column_changes = getChanges(existe_item, server_item);
      if (Object.keys(column_changes).length)
        changes.value.update.push({ ...column_changes, id: cloumn.id });
    });

    changes.value.delete = server_columns
      .filter((server_item) => existe_columns.every((old_item) => old_item.id != server_item.id))
      .map((column) => {
        return {
          data_state: 'deleted',
          id: column.id,
        };
      });

    if (changes.value.create.length || changes.value.update.length || changes.value.delete.length)
      emits('setColumnsChangedFlag', true);
    else emits('setColumnsChangedFlag', false);
  },
  { immediate: true, deep: true },
);

const viewAndEditColumnModalShownHandler = () => {
  const viewAndEditColumnModal = document.getElementById('viewAndEditColumnModal');
  if (viewAndEditColumnModal) scrollToTop(viewAndEditColumnModal);
};

onMounted(() => {
  const viewAndEditColumnModal = document.getElementById('viewAndEditColumnModal');
  if (viewAndEditColumnModal)
    viewAndEditColumnModal.addEventListener('shown.bs.modal', viewAndEditColumnModalShownHandler);

  // document.onkeydown = (e) => {
  //   if ((e.ctrlKey || e.metaKey) && e.key === 's') {
  //     if (!viewAndEditColumnModal.classList.contains('show')) handleSaveFormColumns();
  //     e.preventDefault();
  //   }
  // };
});

onUnmounted(() => {
  const viewAndEditColumnModal = document.getElementById('viewAndEditColumnModal');
  if (viewAndEditColumnModal)
    viewAndEditColumnModal.removeEventListener(
      'shown.bs.modal',
      viewAndEditColumnModalShownHandler,
    );
});

const scrollToTop = (modal) => {
  const el = modal?.querySelector('.simplebar-content-wrapper');
  if (el)
    el.scrollTo({
      top: el.offsetTop,
      behavior: 'smooth',
    });
};

const handleAddColumn = (e) => {
  columns.value[e.newIndex] = JSON.parse(JSON.stringify(columns.value[e.newIndex]));
  columns.value[e.newIndex].name = i18n.global.t(columns.value[e.newIndex].name);
  delete columns.value[e.newIndex].icon;
};

const handleSortColumn = () => {
  columns.value.forEach((column, index) => (column.sort = index + 1));
};

const handleCopyColumns = () => {
  const text = {
    keyword: `copy_form_columns_at_${dayjs().format('YYYY-MM-DD')}_by_${
      store.state.user.data.username
    }`,
    columns: columns.value.map((column) => {
      return {
        name: column.name,
        component: column.component,
        col: column.col,
        type: column.type,
        length: column.length,
        default: column.default,
        alias: column.alias,
        visible: column.visible,
        required: column.required,
        editable: column.editable,
        tags: column.tags,
        cfg: column.cfg,
        header: column.header,
        footer: column.footer,
        sort: column.sort,
      };
    }),
  };
  copyToClipboard(JSON.stringify(text))
    .then(() => {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-check-circle',
          text: 'layout.navbar.helper.form.column.components.copy.success',
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

const handlePasteColumns = () => {
  pasteFromClipboard()
    .then((text) => {
      if (
        text.includes(
          `copy_form_columns_at_${dayjs().format('YYYY-MM-DD')}_by_${
            store.state.user.data.username
          }`,
        )
      ) {
        try {
          text = JSON.parse(text);
          if (text.columns && Array.isArray(text.columns)) {
            columns.value = text.columns;
            toast({
              component: ToastificationContent,
              props: {
                variant: 'success',
                icon: 'mdi-check-circle',
                text: 'layout.navbar.helper.form.column.components.paste.success',
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

const saving = ref(false);
const handleSaveFormColumns = () => {
  if (columns.value.some((column) => column.component === 'LayoutTab')) {
    if (columns.value[0].component !== 'LayoutTab') {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: 'layout.navbar.helper.form.column.components.layout.tab.top',
        },
      });
      return;
    }

    if (columns.value[columns.value.length - 1].component === 'LayoutTab') {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: 'layout.navbar.helper.form.column.components.layout.tab.bottom',
        },
      });
      return;
    }

    if (
      columns.value.some(
        (column, index) =>
          column.component === 'LayoutTab' &&
          (columns.value?.[index - 1]?.component === 'LayoutTab' ||
            columns.value?.[index + 1]?.component === 'LayoutTab'),
      )
    ) {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: 'layout.navbar.helper.form.column.components.layout.tab.between',
        },
      });
      return;
    }
  }

  if (changes.value.create.length || changes.value.update.length || changes.value.delete.length) {
    saving.value = true;
    syncColumns({
      tid: props.form.id,
      columns: [...changes.value.create, ...changes.value.update, ...changes.value.delete],
    }).then(({ code, msg }) => {
      saving.value = false;
      if (code === 200) {
        fetchColumns(props.form.id);
        toast({
          component: ToastificationContent,
          props: {
            variant: 'success',
            icon: 'mdi-check-circle',
            text: 'layout.navbar.helper.form.column.save.success',
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
    });
  }
};

const handleRestoreFormColumns = () => {
  columns.value = JSON.parse(JSON.stringify(server_columns));
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/index.scss';
.drag-item {
  border-radius: 5px;
  border: 1px dashed $text-muted;
  background-color: $pagination-bg;
  &:hover {
    border: 1px solid $primary;
    background-color: $pagination-hover-bg;
  }
}

[data-theme='dark'] {
  .drag-item {
    &:hover {
      border: 1px solid $success;
    }
  }
}
</style>
