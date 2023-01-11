<template>
  <div class="w-100">
    <button id="handleSetCurrentFilter" class="d-none" @click="handleSetCurrentFilter"></button>
    <div class="ag-filter-toolpanel-search">
      <input
        type="text"
        v-model="keyword"
        class="ag-filter-toolpanel-search-input ag-labeled ag-label-align-left ag-text-field ag-input-field"
        :placeholder="$t('data.list.sideBar.toolPanels.customFilters.search')"
      />
      <i v-if="!current_filter.id && Object.keys(params.api.getFilterModel()).length != 0" class="cursor-pointer fs-16 me-2 text-dark mdi mdi-plus" @click="handleCreateFilter"></i>
    </div>
    <div class="ag-filter-list-panel">
      <div class="ag-filter-toolpanel-group-wrapper">
        <div class="ag-group ag-filter-toolpanel-group ag-filter-toolpanel-group-level-0" :class="prefabricated.children.find((child) => child.name === current_filter.name) && 'ag-has-filter'">
          <div class="ag-group-title-bar ag-filter-toolpanel-group-level-0-header ag-filter-toolpanel-header" @click="prefabricated.visible = !prefabricated.visible">
            <span class="ag-group-title-bar-icon ag-filter-toolpanel-group-title-bar-icon" :class="!prefabricated.visible && 'ag-hidden'">
              <span class="ag-icon ag-icon-tree-open"></span>
            </span>
            <span class="ag-group-title-bar-icon ag-filter-toolpanel-group-title-bar-icon" :class="prefabricated.visible && 'ag-hidden'">
              <span class="ag-icon ag-icon-tree-closed"></span>
            </span>
            <span class="ag-group-title ag-filter-toolpanel-group-title" style="cursor: pointer">{{ $t('data.list.sideBar.toolPanels.customFilters.prefabricated') }}</span>
          </div>
          <div v-if="prefabricated.visible" class="ag-filter-toolpanel-group-container">
            <div
              class="ag-filter-toolpanel-group-item"
              v-for="(item, index) in prefabricated.children.filter((item) => !keyword || item.name.toLowerCase().includes(keyword.toLowerCase()))"
              :key="index"
            >
              <div class="ag-filter-toolpanel-header">
                <span
                  class="ag-header-cell-text ms-3"
                  style="cursor: pointer"
                  :title="`${item.name}\r\n--------------------------------\r\n${JSON.stringify(item.model, null, 2)}`"
                  @click="handleSetFilterModel(item)"
                >
                  {{ item.name }}
                </span>
                <span v-if="current_filter.name === item.name" class="ag-filter-toolpanel-instance-header-icon"><span class="ag-icon ag-icon-filter"></span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ag-filter-toolpanel-group-wrapper" v-for="(item, index) in customfilters.filter((item) => !keyword || item.name.toLowerCase().includes(keyword.toLowerCase()))" :key="index">
        <div class="ag-filter-toolpanel-group ag-filter-toolpanel-group-level-0" :class="current_filter.name === item.name && 'ag-has-filter'">
          <div class="ag-group-title-bar ag-filter-toolpanel-group-level-0-header ag-filter-toolpanel-header">
            <span
              class="ag-group-title ag-filter-toolpanel-group-title ms-1 text-truncate"
              style="cursor: pointer"
              :title="`@${getUserInfo(item.created_by)?.fullname || item.created_by}\r\n${item.name}\r\n--------------------------------\r\n${JSON.stringify(item.model, null, 2)}`"
              @click="handleSetFilterModel(item)"
            >
              {{ item.name }}
            </span>
            <i
              v-if="item.created_by === $store.state.user.data.username"
              class="cursor-pointer fs-16 text-danger mdi mdi-delete-outline"
              @click.stop="delete_filter = item"
              data-bs-toggle="modal"
              data-bs-target="#deleteFilterConfirmModal"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="d-none" id="showCreateFilterModalBtn" data-bs-toggle="modal" data-bs-target="#createFilterModal"></button>
    <div class="modal fade" id="createFilterModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">{{ $t('data.list.sideBar.toolPanels.customFilters.createFilterModal.title') }}</h5>
            <button type="button" class="btn-close" id="hideCreateFilterModalBtn" data-bs-dismiss="modal"></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitFilter">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">{{ $t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.name') }}</label>
                    <Field
                      name="name"
                      v-model="create_filter.name"
                      type="text"
                      :placeholder="$t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.name')"
                      :class="['form-control', errors.name && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.name }}</span>
                  </div>

                  <div class="col-12">
                    <label class="form-label">{{ $t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.users') }}</label>
                    <UsersSelector v-model="create_filter.users" :placeholder="$t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.users')" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">{{ $t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.model') }}</label>
                    <MonacoEditor
                      v-model="create_filter.model"
                      language="json"
                      :options="{
                        readOnly: true,
                      }"
                      height="40vh"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button type="submit" class="btn btn-sm btn-success" :disabled="Object.keys(errors).length">
                <i class="mdi mdi-content-save-outline"></i>
                {{ $t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.footer.create') }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteFilterConfirmModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" id="hideDeleteFilterConfirmModalBtn" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>{{ $t('data.list.sideBar.toolPanels.customFilters.deleteFilterConfirmModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('data.list.sideBar.toolPanels.customFilters.deleteFilterConfirmModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">{{ $t('data.list.sideBar.toolPanels.customFilters.deleteFilterConfirmModal.cancel') }}</button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDeleteFilter">{{ $t('data.list.sideBar.toolPanels.customFilters.deleteFilterConfirmModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { deepCompare, getUserInfo } from '@utils';
import { getFilters, createFilter, updateFilter } from '@api/filter';
import UsersSelector from '@components/UsersSelector';
import MonacoEditor from '@components/MonacoEditor';
import store from '@store';
import i18n from '@utils/i18n';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
export default defineComponent({
  components: {
    UsersSelector,
    MonacoEditor,
  },
  setup(props) {
    const toast = useToast();
    const moment = window.moment;
    const keyword = ref(null);

    const prefabricated = reactive({
      visible: false,
      children: [
        {
          id: 'createdByMe',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdByMe'),
          model: {
            created_by: {
              filterType: 'set',
              values: [store.state.user.data.username],
            },
          },
        },
        {
          id: 'updatedByMe',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedByMe'),
          model: {
            updated_by: {
              filterType: 'set',
              values: [store.state.user.data.username],
            },
          },
        },
        {
          id: 'createdBeforeYesterday',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdBeforeYesterday'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-2, 'd').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().add(-2, 'd').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'createdYesterday',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdYesterday'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-1, 'd').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().add(-1, 'd').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'createdToday',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdToday'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'createdLastWeek',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdLastWeek'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().startOf('week').add(-7, 'd').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().endOf('week').add(-7, 'd').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'createdThisWeek',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdThisWeek'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().startOf('week').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().endOf('week').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'createdLastMonth',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdLastMonth'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-1, 'M').format('YYYY-MM-01 00:00:00'),
              dateTo: moment(moment().format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'createdThisMonth',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdThisMonth'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().format('YYYY-MM-01 00:00:00'),
              dateTo: moment(moment().add(1, 'M').format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'createdLastYear',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdLastYear'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-1, 'Y').format('YYYY-01-01 00:00:00'),
              dateTo: moment(moment().format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'createdThisYear',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.createdThisYear'),
          model: {
            created_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().format('YYYY-01-01 00:00:00'),
              dateTo: moment(moment().add(1, 'Y').format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'updatedBeforeYesterday',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedBeforeYesterday'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-2, 'd').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().add(-2, 'd').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'updatedYesterday',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedYesterday'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-1, 'd').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().add(-1, 'd').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'updatedToday',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedToday'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'updatedLastWeek',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedLastWeek'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().startOf('week').add(-7, 'd').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().endOf('week').add(-7, 'd').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'updatedThisWeek',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedThisWeek'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().startOf('week').format('YYYY-MM-DD 00:00:00'),
              dateTo: moment().endOf('week').format('YYYY-MM-DD 23:59:59'),
            },
          },
        },
        {
          id: 'updatedLastMonth',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedLastMonth'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-1, 'M').format('YYYY-MM-01 00:00:00'),
              dateTo: moment(moment().format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'updatedThisMonth',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedThisMonth'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().format('YYYY-MM-01 00:00:00'),
              dateTo: moment(moment().add(1, 'M').format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'updatedLastYear',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedLastYear'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().add(-1, 'Y').format('YYYY-01-01 00:00:00'),
              dateTo: moment(moment().format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
        {
          id: 'updatedThisYear',
          name: i18n.global.t('data.list.sideBar.toolPanels.customFilters.prefabricated.updatedThisYear'),
          model: {
            updated_at: {
              filterType: 'date',
              type: 'inRange',
              dateFrom: moment().format('YYYY-01-01 00:00:00'),
              dateTo: moment(moment().add(1, 'Y').format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
        },
      ],
    });
    const customfilters = reactive([]);

    onMounted(() => {
      getFilters({ tid: props.params.context.tid }).then(({ code, data, msg }) => {
        if (code === 200) {
          customfilters.push(...data);
          handleSetCurrentFilter();
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

    const current_filter = ref({});

    const handleSetCurrentFilter = () => {
      const filterModel = props.params.api.getFilterModel();
      if (Object.keys(filterModel).length === 0) current_filter.value = {};
      else {
        const filter =
          prefabricated.children.find((filter) => Object.keys(deepCompare(filterModel, filter.model)).length === 0) ||
          customfilters.find((filter) => Object.keys(deepCompare(filterModel, filter.model)).length === 0);
        current_filter.value = filter || {};
      }
    };

    const handleSetFilterModel = (item) => {
      if (current_filter.value.id === item.id) {
        props.params.api.setFilterModel({
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
        });
      } else {
        props.params.api.setFilterModel(item.model);
      }
    };

    const create_filter = ref({});

    const handleCreateFilter = () => {
      const new_model = JSON.stringify(props.params.api.getFilterModel(), null, 2);
      create_filter.value = {
        tid: props.params.context.tid,
        name: create_filter.value.model === new_model ? create_filter.value.name : '',
        users: create_filter.value.model === new_model ? create_filter.value.users : [],
        model: new_model,
      };
      document.getElementById('showCreateFilterModalBtn').click();
    };

    const handleSubmitFilter = () => {
      if (customfilters.find((filter) => filter.name === create_filter.value.name)) {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: i18n.global.t('data.list.sideBar.toolPanels.customFilters.createFilterModal.form.name.duplicate', { name: create_filter.value.name }),
          },
        });
      } else {
        create_filter.value.model = JSON.parse(create_filter.value.model);
        createFilter(create_filter.value).then(({ code, data, msg }) => {
          if (code === 200) {
            customfilters.push(data);
            create_filter.value = {};
            handleSetCurrentFilter();
            document.getElementById('hideCreateFilterModalBtn').click();
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

    const delete_filter = ref({});

    const handleDeleteFilter = () => {
      delete_filter.value.data_state = 'deleted';
      updateFilter(delete_filter.value).then(({ code, msg }) => {
        if (code === 200) {
          customfilters.splice(
            customfilters.findIndex((filter) => filter.id === delete_filter.value.id),
            1,
          );
          delete_filter.value = {};
          handleSetCurrentFilter();
          document.getElementById('hideDeleteFilterConfirmModalBtn').click();
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

    return {
      keyword,
      prefabricated,
      customfilters,
      current_filter,
      handleSetCurrentFilter,
      handleSetFilterModel,
      create_filter,
      handleCreateFilter,
      handleSubmitFilter,
      delete_filter,
      handleDeleteFilter,

      getUserInfo,
    };
  },
});
</script>
