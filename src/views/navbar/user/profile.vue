<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card mt-n4 mx-n4">
          <div class="bg-soft-primary">
            <div class="card-body pb-0 px-4">
              <div class="row mb-3">
                <div class="col-md">
                  <div class="row align-items-center g-3">
                    <div class="col-md-auto">
                      <Avatar :data="$store.state.user.data" size="sm" />
                    </div>
                    <div class="col-md">
                      <div>
                        <h4 class="fw-bold">{{ $store.state.user.data.fullname }} - {{ $store.state.user.data.post }}</h4>
                        <div class="hstack gap-3 flex-wrap">
                          <div>
                            {{ $t('layout.navbar.user.dropdown.profil.department') }}:
                            {{ $store.state.org.depts.find((dept) => dept.id === $store.state.user.data.dept)?.name }}
                          </div>
                          <div class="vr"></div>
                          <div>
                            {{ $t('layout.navbar.user.dropdown.profil.post') }}:
                            {{ $store.state.user.data.post }}
                          </div>
                          <div class="vr"></div>
                          <div>
                            {{ $t('layout.navbar.user.dropdown.profil.phone') }}:
                            {{ $store.state.user.data.phone }}
                          </div>
                          <div class="vr"></div>
                          <div>
                            {{ $t('layout.navbar.user.dropdown.profil.email') }}:
                            {{ $store.state.user.data.email }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ul class="nav nav-tabs-custom border-bottom-0" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active fw-semibold" data-bs-toggle="tab" href="#overview" role="tab">{{ $t('layout.navbar.user.dropdown.profil.overview') }}</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link fw-semibold" data-bs-toggle="tab" href="#uploads" role="tab">{{ $t('layout.navbar.user.dropdown.profil.uploads') }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="tab-content text-muted">
          <div class="tab-pane active" id="overview">
            <div class="row">
              <div class="col-xxl-3 col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title mb-3">{{ $t('layout.navbar.user.dropdown.profil.overview.info') }}</h5>
                    <div class="table-responsive">
                      <table class="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.info.fullname') }}:</th>
                            <td class="text-muted">{{ $store.state.user.data.fullname }}</td>
                          </tr>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.info.phone') }}:</th>
                            <td class="text-muted">{{ $store.state.user.data.phone }}</td>
                          </tr>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.info.email') }}:</th>
                            <td class="text-muted">{{ $store.state.user.data.email }}</td>
                          </tr>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.info.birthday') }}:</th>
                            <td class="text-muted">{{ $moment($store.state.user.data.birthday).format('ll') }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title mb-4">{{ $t('layout.navbar.user.dropdown.profil.overview.social') }}</h5>
                    <div class="table-responsive">
                      <div class="mb-3 d-flex align-items-center">
                        <div class="avatar-xs d-block flex-shrink-0 me-3">
                          <span class="avatar-title rounded-circle fs-16 bg-dark text-light">
                            <i class="mdi mdi-github"></i>
                          </span>
                        </div>
                        <span class="text-muted">{{ $store.state.user.data.github }}</span>
                      </div>
                      <div class="mb-3 d-flex align-items-center">
                        <div class="avatar-xs d-block flex-shrink-0 me-3">
                          <span class="avatar-title rounded-circle fs-16 bg-success text-light">
                            <i class="mdi mdi-wechat"></i>
                          </span>
                        </div>
                        <span class="text-muted">{{ $store.state.user.data.wechat }}</span>
                      </div>
                      <div class="mb-3 d-flex align-items-center">
                        <div class="avatar-xs d-block flex-shrink-0 me-3">
                          <span class="avatar-title rounded-circle fs-16 bg-secondary text-light">
                            <i class="mdi mdi-qqchat"></i>
                          </span>
                        </div>
                        <span class="text-muted">{{ $store.state.user.data.qq }}</span>
                      </div>
                      <div class="mb-3 d-flex align-items-center">
                        <div class="avatar-xs d-block flex-shrink-0 me-3">
                          <span class="avatar-title rounded-circle fs-16 bg-primary text-light">
                            <i class="mdi mdi-web"></i>
                          </span>
                        </div>
                        <span class="text-muted">{{ $store.state.user.data.website }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title mb-4">{{ $t('layout.navbar.user.dropdown.profil.overview.skills') }}</h5>
                    <div class="d-flex flex-wrap gap-2 fs-15" v-if="$store.state.user.data.skills.length">
                      <span class="badge badge-soft-primary" v-for="(skill, index) in $store.state.user.data.skills" :key="index">{{ skill }}</span>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title mb-3">{{ $t('layout.navbar.user.dropdown.profil.overview.notifications') }}</h5>
                    <div class="table-responsive">
                      <table class="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.notifications.chat') }}:</th>
                            <td class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" disabled :checked="$store.state.user.data.config.chatNotify" />
                            </td>
                          </tr>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.notifications.mail') }}:</th>
                            <td class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" disabled :checked="$store.state.user.data.config.mailNotify" />
                            </td>
                          </tr>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.notifications.comment') }}:</th>
                            <td class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" disabled :checked="$store.state.user.data.config.commentNotify" />
                            </td>
                          </tr>
                          <tr>
                            <th class="ps-0" scope="row">{{ $t('layout.navbar.user.dropdown.profil.overview.notifications.offline') }}:</th>
                            <td class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" disabled :checked="$store.state.user.data.config.offlineNotify" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xxl-9 col-md-8">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title mb-3">{{ $t('layout.navbar.user.dropdown.profil.overview.about') }}</h5>
                    <p>
                      {{ $store.state.user.data.about }}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-12">
                    <div class="card">
                      <div class="card-header">
                        <h4 class="card-title mb-0">{{ $t('layout.navbar.user.dropdown.profil.overview.recentActivities') }}</h4>
                      </div>
                      <div class="card-body">
                        <div class="tab-content text-muted">
                          <div class="profile-timeline">
                            <div class="accordion accordion-flush">
                              <div class="accordion-item border-0" v-for="item in recent_activities" :key="item.id">
                                <div class="accordion-header">
                                  <a class="accordion-button p-2 shadow-none" data-bs-toggle="collapse" :href="`#recent_item_${item.id}`">
                                    <div class="d-flex">
                                      <div class="flex-shrink-0 avatar-xs">
                                        <div class="avatar-title bg-light text-muted rounded-circle">
                                          <i class="mdi" :class="resolveDeviceIcon(uaParser(item.agent).device.type || 'desktop')" />
                                        </div>
                                      </div>
                                      <div class="flex-grow-1 ms-3">
                                        <h6 class="fs-14 mt-2">{{ item.url }}</h6>
                                        <small class="text-muted mb-2">
                                          <span class="text-secondary">{{ item.method }}::{{ item.ip }}</span>
                                          @ {{ $moment(item.created_at).format('llll') }}
                                        </small>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <div :id="`recent_item_${item.id}`" class="accordion-collapse collapse show">
                                  <div class="accordion-body ms-2 mb-0 pt-0 pb-0 ps-5 cursor-pointer text-truncate-three-lines fst-italic" @click="handleViewActivityData(item)">
                                    {{ item.data }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="uploads">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title mb-3">{{ $t('layout.navbar.user.dropdown.profil.uploads.files') }}</h5>
                <table class="table table-hover table-striped table-borderless align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">{{ $t('layout.navbar.user.dropdown.profil.uploads.name') }}</th>
                      <th scope="col">{{ $t('layout.navbar.user.dropdown.profil.uploads.category') }}</th>
                      <th scope="col">{{ $t('layout.navbar.user.dropdown.profil.uploads.size') }}</th>
                      <th scope="col">{{ $t('layout.navbar.user.dropdown.profil.uploads.uploadDate') }}</th>
                      <th scope="col">{{ $t('layout.navbar.user.dropdown.profil.uploads.action') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="file in uploads" :key="file.uuid">
                      <td style="max-width: 20px">
                        <img
                          v-if="file.category == 'image'"
                          :src="`/cor/file/load/${file.uuid}`"
                          class="rounded avatar-xs cursor-pointer"
                          @click="
                            () => {
                              let images = uploads.filter((file) => file.category == 'image');
                              $viewerApi({
                                options: {
                                  focus: false,
                                  movable: false,
                                  initialViewIndex: images.findIndex((image) => image.uuid == file.uuid),
                                },
                                images: images.map((image) => {
                                  return `/cor/file/load/${image.uuid}`;
                                }),
                              });
                            }
                          "
                        />
                        <i v-else class="file-icon" :class="$fileIcons.getClassWithColor(file.name)" />
                      </td>
                      <td class="fs-15 mb-0 cursor-pointer text-secondary text-decoration-underline text-truncate" style="max-width: 300px" :title="file.name" @dblclick="handlePreviewFile(file)">
                        {{ file.name }}
                      </td>
                      <td class="text-capitalize">{{ file.category }}</td>
                      <td>{{ size2Str(file.size) }}</td>
                      <td style="white-space: nowrap">{{ $moment(file.created_at).format('llll') }}</td>
                      <td>
                        <div class="dropdown">
                          <button class="btn btn-primary btn-icon" id="dropdownMenuLink15" data-bs-toggle="dropdown" aria-expanded="true">
                            <i class="mdi mdi-dots-horizontal"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink15">
                            <li class="dropdown-item cursor-pointer" @click="handleViewFileSource(file.source)">
                              <i class="mdi mdi-table-eye me-2 align-middle text-muted"></i>
                              {{ $t('layout.navbar.user.dropdown.profil.uploads.action.source') }}
                            </li>
                            <li class="dropdown-item cursor-pointer" @click="handleDownloadFile(file)">
                              <i class="mdi mdi-download me-2 align-middle text-muted"></i>
                              {{ $t('layout.navbar.user.dropdown.profil.uploads.action.download') }}
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="pb-2 pt-4">
                  <Pagination :total="pagination.totalCount" :page-num="pagination.pageNum" :page-size="pagination.pageSize" @changed="handlePaginationChange" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button id="showActivityDataOffcanvasBtn" class="d-none" data-bs-toggle="offcanvas" data-bs-target="#activityDataOffcanvas" />
    <div class="offcanvas form offcanvas-end w-50" id="activityDataOffcanvas">
      <div class="offcanvas-body p-0 overflow-hidden">
        <i class="cursor-pointer d-md-none fs-36 mdi mdi-exit-to-app position-absolute" style="z-index: 1; right: 10px; bottom: 0" data-bs-dismiss="offcanvas" />
        <MonacoEditor
          v-model="current_activity.data"
          language="json"
          :options="{
            readOnly: true,
          }"
          height="100vh"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getUserLogs, getUserFiles } from '@api/user';
import { useToast } from 'vue-toastification';
import { useRouter, size2Str } from '@utils';
import ToastificationContent from '@components/ToastificationContent';
import MonacoEditor from '@components/MonacoEditor';
import Avatar from '@components/Avatar';
import uaParser from 'ua-parser-js';
import Pagination from '@components/Pagination';
export default {
  components: {
    Avatar,
    MonacoEditor,
    Pagination,
  },
  setup() {
    const toast = useToast();
    const { router } = useRouter();

    const recent_activities = ref([]);
    const uploads = ref([]);

    const pagination = ref({
      pageNum: 1,
      pageSize: 200,
      totalCount: 0,
    });

    const handlePaginationChange = ({ pageNum, pageSize }) => {
      pagination.value.pageNum = pageNum;
      pagination.value.pageSize = pageSize;
      getUploads();
    };

    const getUploads = () => {
      getUserFiles({ pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize }).then(({ code, msg, data }) => {
        if (code === 200) {
          uploads.value = data.rows;
          pagination.value.totalCount = data.count;
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

    const getLogs = () => {
      getUserLogs({ type: 2 }).then(({ code, data, msg }) => {
        if (code === 200) {
          recent_activities.value = data;
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
      getLogs();
      getUploads();
    });

    const resolveDeviceIcon = computed(() => {
      return (type) => {
        if (type.toLowerCase().includes('mobile')) return 'mdi-cellphone';
        else if (type.toLowerCase().includes('safari')) return 'mdi-tablet';
        else return 'mdi-desktop-mac';
      };
    });

    const current_activity = ref({});
    const handleViewActivityData = (item) => {
      current_activity.value = item;
      document.getElementById('showActivityDataOffcanvasBtn').click();
    };

    const handlePreviewFile = (file) => {
      const { href } = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
      window.open(href, '_blank');
    };

    const handleViewFileSource = (source) => {
      // const { href } = router.resolve({ path: source });
      window.open(source, '_blank');
    };

    const handleDownloadFile = (file) => {
      let downloadElement = document.createElement('a');
      downloadElement.href = `/cor/file/load/${file.uuid}`;
      downloadElement.download = file.name;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
    };

    return {
      recent_activities,
      uaParser,
      resolveDeviceIcon,
      current_activity,
      handleViewActivityData,

      uploads,
      pagination,
      handlePaginationChange,

      size2Str,
      handlePreviewFile,
      handleViewFileSource,
      handleDownloadFile,
    };
  },
};
</script>
