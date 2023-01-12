<template>
  <div class="w-100">
    <button id="handleSetCurrentFilter" class="d-none" @click="handleSetCurrentFilter"></button>
    <div class="ag-filter-toolpanel-search">
      <input
        type="text"
        v-model="keyword"
        class="ag-filter-toolpanel-search-input ag-labeled ag-label-align-left ag-text-field ag-input-field"
        :placeholder="$t('data.list.sideBar.toolPanels.customization.search')"
      />
      <i v-if="!current_filter.id && Object.keys(params.api.getFilterModel()).length != 0" class="cursor-pointer fs-16 me-2 text-dark mdi mdi-plus" @click="handleCreateFilter"></i>
    </div>
    <div class="ag-filter-list-panel">
      <div class="ag-filter-toolpanel-group-wrapper">
        <div
          class="ag-group ag-filter-toolpanel-group ag-filter-toolpanel-group-level-0"
          v-for="(item, index) in filters"
          :key="index"
          :class="[
            item.children.find((filter) => filter.id === current_filter.id) && 'ag-has-filter',
            item.children.filter((filter) => !keyword || filter.name.toLowerCase().includes(keyword.toLowerCase())).length === 0 && 'd-none',
          ]"
        >
          <div class="ag-group-title-bar ag-filter-toolpanel-group-level-0-header ag-filter-toolpanel-header" @click="item.visible = !item.visible">
            <span class="ag-group-title-bar-icon ag-filter-toolpanel-group-title-bar-icon" :class="!item.visible && 'ag-hidden'">
              <span class="ag-icon ag-icon-tree-open"></span>
            </span>
            <span class="ag-group-title-bar-icon ag-filter-toolpanel-group-title-bar-icon" :class="item.visible && 'ag-hidden'">
              <span class="ag-icon ag-icon-tree-closed"></span>
            </span>
            <span class="ag-group-title ag-filter-toolpanel-group-title text-truncate" style="cursor: pointer">
              {{ getUserInfo(item.created_by)?.fullname || item.created_by }}
              [{{ item.children.filter((filter) => !keyword || filter.name.toLowerCase().includes(keyword.toLowerCase())).length }}]
            </span>
          </div>
          <div v-if="item.visible" class="ag-filter-toolpanel-group-container">
            <div class="ag-filter-toolpanel-group-item" v-for="(filter, index) in item.children.filter((filter) => !keyword || filter.name.toLowerCase().includes(keyword.toLowerCase()))" :key="index">
              <div class="ag-filter-toolpanel-header justify-content-between">
                <span class="text-truncate w-100">
                  <span
                    class="ag-header-cell-text ms-3"
                    style="cursor: pointer"
                    :title="`${filter.name}\r\n--------------------------------\r\n${JSON.stringify(filter.data, null, 2)}`"
                    @click="handleSetFilterModel(filter)"
                  >
                    {{ filter.name }}
                  </span>
                  <span v-if="current_filter.id === filter.id" class="ag-filter-toolpanel-instance-header-icon"><span class="ag-icon ag-icon-filter"></span></span>
                </span>
                <i
                  v-if="item.created_by === $store.state.user.data.username"
                  class="cursor-pointer fs-16 text-danger mdi mdi-delete-outline me-2"
                  @click.stop="delete_filter = filter"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteFilterConfirmModal"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="d-none" id="showCreateFilterModalBtn" data-bs-toggle="modal" data-bs-target="#createFilterModal"></button>
    <div class="modal fade" id="createFilterModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">{{ $t('data.list.sideBar.toolPanels.customization.createFilterModal.title') }}</h5>
            <button type="button" class="btn-close" id="hideCreateFilterModalBtn" data-bs-dismiss="modal"></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitFilter">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">{{ $t('data.list.sideBar.toolPanels.customization.createFilterModal.form.name') }}</label>
                    <Field
                      name="name"
                      v-model="create_filter.name"
                      type="text"
                      :placeholder="$t('data.list.sideBar.toolPanels.customization.createFilterModal.form.name')"
                      :class="['form-control', errors.name && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.name }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">{{ $t('data.list.sideBar.toolPanels.customization.createFilterModal.form.data') }}</label>
                    <MonacoEditor
                      v-model="create_filter.data"
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
                {{ $t('data.list.sideBar.toolPanels.customization.createFilterModal.form.footer.create') }}
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
                <h4>{{ $t('data.list.sideBar.toolPanels.customization.deleteFilterConfirmModal.title') }}</h4>
                <p class="text-muted mx-4 mb-0">{{ $t('data.list.sideBar.toolPanels.customization.deleteFilterConfirmModal.confirm') }}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">{{ $t('data.list.sideBar.toolPanels.customization.deleteFilterConfirmModal.cancel') }}</button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDeleteFilter">{{ $t('data.list.sideBar.toolPanels.customization.deleteFilterConfirmModal.confirmed') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { deepCompare, getUserInfo } from '@utils';
import { getFilters, createFilter, updateFilter } from '@api/custom';
import MonacoEditor from '@components/MonacoEditor';
import store from '@store';
import i18n from '@utils/i18n';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
export default defineComponent({
  components: {
    MonacoEditor,
  },
  setup(props) {
    const toast = useToast();
    const moment = window.moment;
    const socket = window.socket;
    const system = [
      {
        id: 'created_by_me',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdByMe'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_by: {
            filterType: 'set',
            values: [store.state.user.data.username],
          },
        },
      },
      {
        id: 'updated_by_me',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedByMe'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_by: {
            filterType: 'set',
            values: [store.state.user.data.username],
          },
        },
      },
      {
        id: 'created_before_yesterday',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdBeforeYesterday'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-2, 'd').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().add(-2, 'd').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'created_yesterday',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdYesterday'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-1, 'd').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().add(-1, 'd').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'created_today',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdToday'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'created_last_week',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdLastWeek'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().startOf('week').add(-7, 'd').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().endOf('week').add(-7, 'd').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'created_this_week',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdThisWeek'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().startOf('week').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().endOf('week').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'created_last_month',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdLastMonth'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-1, 'M').format('YYYY-MM-01 00:00:00'),
            dateTo: moment(moment().format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'created_this_month',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdThisMonth'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().format('YYYY-MM-01 00:00:00'),
            dateTo: moment(moment().add(1, 'M').format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'created_last_year',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdLastYear'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-1, 'Y').format('YYYY-01-01 00:00:00'),
            dateTo: moment(moment().format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'created_this_year',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.createdThisYear'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          created_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().format('YYYY-01-01 00:00:00'),
            dateTo: moment(moment().add(1, 'Y').format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'updated_before_yesterday',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedBeforeYesterday'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-2, 'd').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().add(-2, 'd').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'updated_yesterday',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedYesterday'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-1, 'd').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().add(-1, 'd').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'updated_today',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedToday'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'updated_last_week',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedLastWeek'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().startOf('week').add(-7, 'd').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().endOf('week').add(-7, 'd').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'updated_this_week',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedThisWeek'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().startOf('week').format('YYYY-MM-DD 00:00:00'),
            dateTo: moment().endOf('week').format('YYYY-MM-DD 23:59:59'),
          },
        },
      },
      {
        id: 'updated_last_month',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedLastMonth'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-1, 'M').format('YYYY-MM-01 00:00:00'),
            dateTo: moment(moment().format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'updated_this_month',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedThisMonth'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().format('YYYY-MM-01 00:00:00'),
            dateTo: moment(moment().add(1, 'M').format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'updated_last_year',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedLastYear'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().add(-1, 'Y').format('YYYY-01-01 00:00:00'),
            dateTo: moment(moment().format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
      {
        id: 'updated_this_year',
        created_by: '@system',
        name: i18n.global.t('data.list.sideBar.toolPanels.customization.filter.system.updatedThisYear'),
        data: {
          data_state: {
            filterType: 'set',
            values: ['published'],
          },
          updated_at: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: moment().format('YYYY-01-01 00:00:00'),
            dateTo: moment(moment().add(1, 'Y').format('YYYY-01-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      },
    ];
    const keyword = ref(null);
    const _filters = ref([]);
    const filters = ref([]);

    onMounted(() => {
      socket.on('refetchFilters', (res) => {
        if (res.tid === props.params.context.tid) fetchFormFilters();
      });
      fetchFormFilters();
    });

    onUnmounted(() => {
      socket.removeListener('refetchFilters');
    });

    const fetchFormFilters = () => {
      getFilters({ tid: props.params.context.tid }).then(({ code, data, msg }) => {
        if (code === 200) {
          data = [...system, ...data];
          _filters.value = JSON.parse(JSON.stringify(data));
          const temp = [];
          data.forEach((ei) => {
            const item = temp.find((item) => item.created_by === ei.created_by);
            if (item) {
              item.children.push({
                id: ei.id,
                tid: ei.tid || props.params.context.tid,
                name: ei.name,
                data: ei.data,
              });
            } else {
              temp.push({
                created_by: ei.created_by,
                visible: filters.value.find((item) => item.created_by === ei.created_by)?.visible || false,
                children: [
                  {
                    id: ei.id,
                    tid: ei.tid || props.params.context.tid,
                    name: ei.name,
                    data: ei.data,
                  },
                ],
              });
            }
          });
          filters.value = temp;
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
    };

    const current_filter = ref({});

    const handleSetCurrentFilter = () => {
      const filterModel = props.params.api.getFilterModel();
      if (Object.keys(filterModel).length === 0) current_filter.value = {};
      else {
        const filter = _filters.value.find((filter) => Object.keys(deepCompare(filterModel, filter.data)).length === 0 && Object.keys(deepCompare(filter.data, filterModel)).length === 0);
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
        props.params.api.setFilterModel(item.data);
      }
    };

    const create_filter = ref({});

    const handleCreateFilter = () => {
      const stringifyFilterModel = JSON.stringify(props.params.api.getFilterModel(), null, 2);
      create_filter.value = {
        name: create_filter.value.data === stringifyFilterModel ? create_filter.value.name : '',
        data: stringifyFilterModel,
      };
      document.getElementById('showCreateFilterModalBtn').click();
    };

    const handleSubmitFilter = () => {
      if (_filters.value.find((filter) => filter.name === create_filter.value.name)) {
        toast({
          component: ToastificationContent,
          props: {
            variant: 'danger',
            icon: 'mdi-alert',
            text: i18n.global.t('data.list.sideBar.toolPanels.customization.createFilterModal.form.name.duplicate', { name: create_filter.value.name }),
          },
        });
      } else {
        createFilter({
          tid: props.params.context.tid,
          name: create_filter.value.name,
          data: JSON.parse(create_filter.value.data),
        }).then(({ code, msg }) => {
          if (code === 200) {
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
      getUserInfo,
      keyword,
      filters,
      current_filter,
      handleSetCurrentFilter,
      handleSetFilterModel,
      create_filter,
      handleCreateFilter,
      handleSubmitFilter,
      delete_filter,
      handleDeleteFilter,
    };
  },
});
</script>
