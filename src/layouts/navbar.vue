<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <div class="dropdown d-xl-none topbar-head-dropdown header-item">
            <button
              type="button"
              class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              @click="toggleMenu"
            >
              <i class="mdi mdi-format-indent-increase fs-22"></i>
            </button>
          </div>

          <div class="app-search d-none d-md-block">
            <div class="position-relative">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('layout.navbar.search.placeholder')"
                autocomplete="off"
                id="search-options"
                v-model="search.keyword"
                @input="handleSearch"
                @keyup.enter.stop="handleEnter"
              />
              <span class="mdi mdi-magnify search-widget-icon"></span>
              <span
                class="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
                id="search-close-options"
              ></span>
            </div>
            <div class="dropdown-menu dropdown-menu-lg" id="search-dropdown">
              <div data-simplebar style="max-height: 320px">
                <SearchResultPanel
                  :keyword="search.keyword"
                  :result="search.result"
                  @setKeyword="
                    (e) => {
                      search.keyword = e;
                      handleSearch();
                    }
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <div class="dropdown d-md-none topbar-head-dropdown header-item">
            <button
              type="button"
              class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              id="page-header-search-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="bx bx-search fs-22"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
              <div class="p-0">
                <div class="form-group p-3 m-0">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      :placeholder="$t('layout.navbar.search.placeholder')"
                      v-model="search.keyword"
                      @input="handleSearch"
                      @keyup.enter.stop="handleEnter"
                    />
                    <button class="btn btn-primary" type="submit">
                      <i class="mdi mdi-magnify"></i>
                    </button>
                  </div>
                </div>
                <div v-if="search.keyword" data-simplebar style="max-height: 50vh">
                  <SearchResultPanel
                    :keyword="search.keyword"
                    :result="search.result"
                    @setKeyword="
                      (e) => {
                        search.keyword = e;
                        handleSearch();
                      }
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="dropdown topbar-head-dropdown ms-1 header-item">
            <button
              type="button"
              class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="mdi mdi-view-grid-outline fs-22 text-secondary"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
              <div class="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="m-0 fw-semibold fs-15">{{ $t('layout.navbar.helper') }}</h6>
                  </div>
                </div>
              </div>

              <div class="p-2">
                <div class="row g-0">
                  <div v-permission="'org'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'org' }">
                      <img src="@/assets/images/navbar/helper/org.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.org') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'form'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'form' }">
                      <img src="@/assets/images/navbar/helper/form.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.form') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'job'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'job' }">
                      <img src="@/assets/images/navbar/helper/job.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.job') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'code'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'code' }">
                      <img src="@/assets/images/navbar/helper/code.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.code') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'weixin'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'weixin' }">
                      <img src="@/assets/images/navbar/helper/weixin.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.weixin') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'log'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'log' }">
                      <img src="@/assets/images/navbar/helper/log.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.log') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'sql'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'sql' }">
                      <img src="@/assets/images/navbar/helper/sql.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.sql') }}</span>
                    </router-link>
                  </div>
                  <div v-permission="'redis'" class="col-4">
                    <router-link class="dropdown-icon-item" :to="{ name: 'redis' }">
                      <img src="@/assets/images/navbar/helper/redis.png" loading="lazy" />
                      <span>{{ $t('layout.navbar.helper.redis') }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="dropdown topbar-head-dropdown ms-1 header-item">
            <button
              type="button"
              class="btn btn-icon btn-topbar btn-ghost-danger rounded-circle"
              id="page-header-notifications-dropdown"
              data-bs-toggle="dropdown"
            >
              <i class="mdi mdi-bell-outline fs-22 text-danger"></i>
              <span
                class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger"
                v-if="
                  chat_notices.length +
                    mail_notices.length +
                    comment_notices.length +
                    flow_notices.length !==
                  0
                "
              >
                {{
                  chat_notices.length +
                  mail_notices.length +
                  comment_notices.length +
                  flow_notices.length
                }}
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-xl dropdown-menu-end p-0">
              <div class="dropdown-head bg-primary bg-pattern rounded-top">
                <div class="p-3">
                  <div class="row align-items-center">
                    <div class="col">
                      <h6 class="m-0 fs-16 fw-semibold text-white">
                        {{ $t('layout.navbar.notifications') }}
                      </h6>
                    </div>
                    <div
                      class="col-auto dropdown-tabs"
                      v-if="
                        chat_notices.length +
                          mail_notices.length +
                          comment_notices.length +
                          flow_notices.length !==
                        0
                      "
                    >
                      <span class="badge badge-soft-light fs-13">
                        {{
                          $t('layout.navbar.notifications.total', {
                            total:
                              chat_notices.length +
                              mail_notices.length +
                              comment_notices.length +
                              flow_notices.length,
                          })
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="px-2 pt-2">
                  <ul
                    class="nav nav-tabs dropdown-tabs nav-tabs-custom"
                    data-dropdown-tabs="true"
                    id="notificationItemsTab"
                    role="tablist"
                  >
                    <li class="nav-item">
                      <a
                        class="nav-link active"
                        data-bs-toggle="tab"
                        href="#chats-tab"
                        role="tab"
                        @click.capture.stop
                      >
                        {{ $t('layout.navbar.notifications.chats') }}
                        <span v-if="chat_notices.length > 0" class="badge bg-danger">
                          {{ chat_notices.length }}
                        </span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#mails-tab"
                        role="tab"
                        @click.capture.stop
                      >
                        {{ $t('layout.navbar.notifications.mails') }}
                        <span v-if="mail_notices.length > 0" class="badge bg-danger">
                          {{ mail_notices.length }}
                        </span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#comments-tab"
                        role="tab"
                        @click.capture.stop
                      >
                        {{ $t('layout.navbar.notifications.comments') }}
                        <span v-if="comment_notices.length > 0" class="badge bg-danger">
                          {{ comment_notices.length }}
                        </span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#flows-tab"
                        role="tab"
                        @click.capture.stop
                      >
                        {{ $t('layout.navbar.notifications.approvals') }}
                        <span v-if="flow_notices.length > 0" class="badge bg-danger">
                          {{ flow_notices.length }}
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="tab-content" id="notificationItemsTabContent">
                <div class="tab-pane fade py-2 ps-2 show active" id="chats-tab" role="tabpanel">
                  <div
                    data-simplebar
                    v-if="chat_notices.length"
                    style="max-height: 300px"
                    class="pe-2"
                  >
                    <div
                      class="text-reset notification-item d-block dropdown-item cursor-pointer"
                      v-for="(item, index) in chat_notices"
                      :key="index"
                    >
                      <div class="d-flex">
                        <Avatar class="me-3" :data="item.user" />
                        <div class="flex-1 w-50" @click="handleClickChatNotice(item)">
                          <span class="stretched-link">
                            <h6 class="mt-0 mb-1 fs-13 fw-semibold">{{ item.user.fullname }}</h6>
                          </span>
                          <div class="fs-13 text-muted">
                            <p class="mb-1 text-truncate">
                              {{
                                item.chat_data[0].type === 'file'
                                  ? JSON.parse(decryptData(item.chat_data[0].message))?.name
                                  : decryptData(item.chat_data[0].message)
                              }}
                            </p>
                          </div>
                          <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                            <span>
                              <i class="mdi mdi-clock-outline"></i>
                              {{ $moment(item.chat_data[0].created_at).fromNow() }}
                            </span>
                          </p>
                        </div>
                        <div class="col-auto dropdown-tabs" v-if="item.chat_data.length > 1">
                          <span class="badge badge-soft-success fs-13">
                            {{
                              $t('layout.navbar.notifications.chats.more', {
                                count: item.chat_data.length - 1,
                              })
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Empty :text="$t('layout.navbar.notifications.chats.empty')" v-else />
                </div>

                <div class="tab-pane fade py-2 ps-2" id="mails-tab" role="tabpanel">
                  <div
                    data-simplebar
                    v-if="mail_notices.length"
                    style="max-height: 300px"
                    class="pe-2"
                  >
                    <div
                      class="text-reset notification-item d-block dropdown-item cursor-pointer"
                      v-for="(mail, index) in mail_notices"
                      :key="index"
                    >
                      <div class="d-flex">
                        <Avatar class="me-3" :data="getUserInfo(mail.created_by)" />
                        <div class="flex-1 w-50" @click="handleClickMailNotice(mail)">
                          <span class="stretched-link">
                            <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                              {{ getUserInfo(mail.created_by).fullname }}
                            </h6>
                          </span>
                          <div class="fs-13 text-muted">
                            <p class="mb-1 text-truncate">{{ mail.subject }}</p>
                          </div>
                          <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                            <span>
                              <i class="mdi mdi-clock-outline"></i>
                              {{ $moment(mail.created_at).fromNow() }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Empty :text="$t('layout.navbar.notifications.mails.empty')" v-else />
                </div>

                <div class="tab-pane fade py-2 ps-2" id="comments-tab" role="tabpanel">
                  <div
                    data-simplebar
                    v-if="comment_notices.length"
                    style="max-height: 300px"
                    class="pe-2"
                  >
                    <div
                      class="text-reset notification-item d-block dropdown-item cursor-pointer"
                      v-for="(comment, index) in comment_notices"
                      :key="index"
                    >
                      <div class="d-flex">
                        <Avatar class="me-3" :data="getUserInfo(comment.created_by)" />
                        <div class="flex-1 w-50" @click="handleClickCommentNotice(comment)">
                          <span class="stretched-link">
                            <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                              {{ getUserInfo(comment.created_by).fullname }}
                            </h6>
                          </span>
                          <div class="fs-13 text-muted">
                            <p class="mb-1 text-truncate">{{ replaceHtml(comment.content) }}</p>
                          </div>
                          <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                            <span>
                              <i class="mdi mdi-clock-outline"></i>
                              {{ $moment(comment.created_at).fromNow() }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Empty :text="$t('layout.navbar.notifications.comments.empty')" v-else />
                </div>

                <div class="tab-pane fade py-2 ps-2" id="flows-tab" role="tabpanel">
                  <div
                    data-simplebar
                    v-if="flow_notices.length"
                    style="max-height: 300px"
                    class="pe-2"
                  >
                    <div
                      class="text-reset notification-item d-block dropdown-item cursor-pointer"
                      v-for="(flow, index) in flow_notices"
                      :key="index"
                    >
                      <div class="d-flex">
                        <Avatar
                          class="me-3"
                          :data="getUserInfo(flow.updated_by || flow.created_by)"
                        />
                        <div class="flex-1 w-50" @click="handleClickFlowNotice(flow)">
                          <span class="stretched-link">
                            <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                              {{ getUserInfo(flow.updated_by || flow.created_by).fullname }}
                            </h6>
                          </span>
                          <div class="fs-13 text-muted">
                            <p class="mb-1 text-truncate">
                              {{ flow.title }}
                            </p>
                          </div>
                          <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                            <span>
                              <i class="mdi mdi-clock-outline"></i>
                              {{ $moment(flow.updated_at || flow.created_at).fromNow() }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Empty :text="$t('layout.navbar.notifications.approvals.empty')" v-else />
                </div>
              </div>
            </div>
          </div>

          <!-- Theme Trigger -->
          <div class="ms-1 header-item d-none d-sm-flex">
            <span
              class="btn btn-icon btn-topbar rounded-circle"
              :class="theme === 'dark' ? 'btn-ghost-warning' : 'btn-ghost-dark'"
              @click="theme = theme === 'dark' ? 'light' : 'dark'"
            >
              <i
                class="mdi mdi-theme-light-dark fs-22"
                :class="theme === 'dark' ? 'text-warning' : 'text-dark'"
              ></i>
            </span>
          </div>

          <!-- Language Selector-->
          <div class="dropdown ms-1 topbar-head-dropdown header-item">
            <button
              type="button"
              class="btn btn-icon btn-topbar btn-ghost-info rounded-circle"
              data-bs-toggle="dropdown"
            >
              <i class="mdi mdi-translate fs-22 text-info"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <div
                v-for="item in languages"
                :key="item.language"
                class="dropdown-item notify-item py-2 cursor-pointer"
                :class="{ active: lang === item.language }"
                @click="handleChangeLang(item.language)"
              >
                <img :src="item.flag" class="me-2" height="24" loading="lazy" />
                <span class="align-middle">{{ item.title }}</span>
              </div>
            </div>
          </div>

          <div class="dropdown ms-sm-3 header-item topbar-user">
            <button
              type="button"
              class="btn"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="d-flex align-items-center">
                <Avatar :data="$store.state.user.data" />
                <span class="text-start ms-xl-2">
                  <span class="d-none d-xl-inline-block ms-1 fw-medium text-dark">
                    {{ $store.state.user.data.fullname }}
                  </span>
                  <span class="d-none d-xl-block ms-1 fs-12 text-muted">
                    {{ $store.state.user.data.post }}
                  </span>
                </span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <router-link class="dropdown-item" :to="{ name: 'profile' }">
                <i class="mdi mdi-account-outline text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle">{{ $t('layout.navbar.user.dropdown.profile') }}</span>
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'setting' }">
                <i class="mdi mdi-cogs text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle">{{ $t('layout.navbar.user.dropdown.setting') }}</span>
              </router-link>

              <div class="dropdown-item cursor-pointer" @click="toggleFullScreen">
                <i
                  :class="[
                    'fs-16 text-muted align-middle me-1 mdi',
                    isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen',
                  ]"
                ></i>
                <span class="align-middle">
                  {{
                    isFullScreen
                      ? $t('layout.navbar.user.dropdown.fullScreen.exit')
                      : $t('layout.navbar.user.dropdown.fullScreen')
                  }}
                </span>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item cursor-pointer" @click="handleUserLogout">
                <i class="mdi mdi-exit-to-app text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle">{{ $t('layout.navbar.user.dropdown.Logout') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, reactive, computed, onMounted, inject } from 'vue';
import store from '@store';
import { userLogout } from '@api/user';
import { getSearchResult } from '@api/com/search';
import { icons } from '@utils/icons';
import i18n from '@utils/i18n';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import {
  useRouter,
  clearUserData,
  getUserInfo,
  replaceHtml,
  decryptData,
  copyToClipboard,
} from '@utils';
import { setWatermark, removeWatermark } from '@utils/watermark';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
import SearchResultPanel from '@components/SearchResultPanel';
export default {
  components: {
    Avatar,
    Empty,
    SearchResultPanel,
  },
  setup() {
    const { router } = useRouter();
    const moment = window.moment;
    const reload = inject('reload');
    const toast = useToast();

    const toggleMenu = () => {
      document.body.classList.add('vertical-sidebar-enable');
    };

    const search = reactive({
      keyword: null,
      result: {
        recent: [],
        user: [],
        form: [],
        data: [],
        file: [],
        icon: [],
      },
    });
    const handleSearch = () => {
      if (!search.keyword) return;
      search.keyword = search.keyword.trim();

      getSearchResult({
        keyword: search.keyword,
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          search.result.recent = data.recent;
          search.result.file = data.file;
          search.result.data = data.data;
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

      let tid = Number(search.keyword) > 0 ? Number(search.keyword) : null;
      let rid = null;

      if (
        search.keyword.includes('/') &&
        search.keyword.split('/')[0]?.length &&
        search.keyword.split('/')[1]?.length
      ) {
        tid =
          Number(search.keyword.split('/')[0]) > 0 ? Number(search.keyword.split('/')[0]) : null;
        rid =
          Number(search.keyword.split('/')[1]) >= 0 ? Number(search.keyword.split('/')[1]) : null;
      }

      search.result.form = JSON.parse(JSON.stringify(store.state.user.forms)).filter(
        (form) =>
          store.state.user.forms.every((f) => f.pid != form.id) &&
          (form.title?.toLowerCase().includes(search.keyword?.toLowerCase()) || form.id === tid),
      );
      if (rid != null) {
        search.result.form = search.result.form
          .filter((form) => form.route && !form.redirect && form.status && form.id === tid)
          .map((form) => {
            form.title = `${form.title}/${rid}`;
            form.route = {
              path: rid === 0 ? `/data/edit/${tid}/${rid}` : `/data/view/${tid}/${rid}`,
            };
            return form;
          });
      }

      search.result.user = store.state.org.users.filter(
        (user) =>
          user.username != store.state.user.data.username &&
          (user.username?.toLowerCase().includes(search.keyword?.toLowerCase()) ||
            user.fullname?.toLowerCase().includes(search.keyword?.toLowerCase())),
      );

      search.result.icon =
        search.keyword.length > 2
          ? icons.filter((icon) => icon.name?.toLowerCase().includes(search.keyword?.toLowerCase()))
          : [];
    };

    const handleEnter = () => {
      if (!search.keyword) return;
      if (search.result.icon.length) {
        copyToClipboard(`mdi mdi-${search.result.icon[0].name}`)
          .then(() => {
            toast({
              component: ToastificationContent,
              props: {
                variant: 'success',
                icon: 'mdi-check-circle',
                text: i18n.global.t('layout.navbar.search.icon.copy.success'),
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
        return;
      }

      if (search.result.user.length) {
        router.push({
          name: 'chat',
          query: {
            contact: search.result.user[0].username,
          },
        });
        return;
      }

      if (search.result.form.length) {
        const forms = search.result.form.filter(
          (form) => form.status === 1 && (form.redirect || form.route),
        );
        if (forms?.[0]?.route) {
          router.push(forms[0].route);
          return;
        }
        if (forms?.[0]?.redirect) {
          window.open(forms[0].redirect, '_blank');
          return;
        }
      }

      if (search.result.data.length) {
        router.push({
          name: 'view',
          params: {
            tid: search.result.data[0].tid,
            rid: search.result.data[0].rid,
          },
        });
        return;
      }

      if (search.result.file.length) {
        router.push({
          name: 'preview',
          params: { uuid: search.result.file[0].uuid },
        });
        return;
      }
    };

    onMounted(() => {
      document.addEventListener('scroll', scrollHandler);
      document.addEventListener('webkitfullscreenchange', fullScreenHandler);
      document.addEventListener('mozfullscreenchange', fullScreenHandler);
      document.addEventListener('fullscreenchange', fullScreenHandler);

      fullScreenHandler();
      isCustomDropdown();
    });

    const scrollHandler = () => {
      var pageTopbar = document.getElementById('page-topbar');
      if (pageTopbar) {
        document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50
          ? pageTopbar.classList.add('topbar-shadow')
          : pageTopbar.classList.remove('topbar-shadow');
      }
    };

    const fullScreenHandler = () => {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      )
        isFullScreen.value = false;
      else isFullScreen.value = true;
    };

    const isCustomDropdown = () => {
      const dropdown = document.getElementById('search-dropdown');

      const searchInput = document.getElementById('search-options');
      if (searchInput) {
        searchInput.addEventListener('focus', () => {
          var inputLength = searchInput.value.length;
          if (inputLength > 0) {
            dropdown.classList.add('show');
            searchOptions.classList.remove('d-none');
          } else {
            dropdown.classList.remove('show');
            search.keyword = '';
            searchOptions.classList.add('d-none');
          }
        });

        searchInput.addEventListener('keyup', () => {
          var inputLength = searchInput.value.length;
          if (inputLength > 0) {
            dropdown.classList.add('show');
            searchOptions.classList.remove('d-none');
          } else {
            dropdown.classList.remove('show');
            search.keyword = '';
            searchOptions.classList.add('d-none');
          }
        });
      }

      const searchOptions = document.getElementById('search-close-options');
      if (searchOptions) {
        searchOptions.addEventListener('click', () => {
          searchInput.value = '';
          dropdown.classList.remove('show');
          search.keyword = '';
          searchOptions.classList.add('d-none');
        });
      }

      document.body.addEventListener('click', (e) => {
        if (e.target.getAttribute('id') !== 'search-options') {
          dropdown.classList.remove('show');
          search.keyword = '';
          searchOptions.classList.add('d-none');
        }
      });
    };

    const chat_notices = computed(() => {
      return store.getters['user/chat_notices'];
    });

    const handleClickChatNotice = (chat) => {
      router
        .replace({
          name: 'chat',
          query: {
            contact: chat.username,
          },
        })
        .then(() => {
          store.commit('user/DEL_NOTICE', {
            app: 'chat',
            data: chat,
          });
        });
    };

    const mail_notices = computed(() => {
      return store.getters['user/mail_notices'];
    });

    const handleClickMailNotice = (mail) => {
      router
        .replace({
          name: 'mail',
          query: {
            id: mail.id,
          },
        })
        .then(() => {
          store.commit('user/DEL_NOTICE', {
            app: 'mail',
            data: mail,
          });
        });
    };

    const comment_notices = computed(() => {
      return store.getters['user/comment_notices'];
    });

    const handleClickCommentNotice = (comment) => {
      router.replace({ path: comment.source, query: { tab: 'comment', id: comment.id } });
      // .then(() => {
      //   store.commit('user/DEL_NOTICE', {
      //     app: 'comment',
      //     data: comment,
      //   });
      // });
    };

    const flow_notices = computed(() => {
      return store.getters['user/flow_notices'];
    });

    const handleClickFlowNotice = (flow) => {
      router.replace({ path: `/data/view/${flow.tid}/${flow.rid}` }).then(() => {
        store.commit('user/DEL_NOTICE', {
          app: 'flow',
          data: flow,
        });
      });
    };

    const theme = computed({
      get: () => store.state.sys.theme,
      set: (value) => {
        store.commit('sys/TOGGLE_THEME', value);
        localStorage.setItem(`${process.env.BASE_URL.replace(/\//g, '_')}theme`, value);
      },
    });

    const languages = ref([
      {
        flag: require('@/assets/images/flags/usa.png'),
        language: 'en-us',
        title: 'English',
      },
      {
        flag: require('@/assets/images/flags/china.png'),
        language: 'zh-cn',
        title: '简体中文',
      },
    ]);

    const lang = computed({
      get: () => store.state.sys.lang,
      set: (value) => {
        store.commit('sys/TOGGLE_LANG', value);
        if (store.state.sys.cfg.waterMark && store.state.user.data.id) {
          removeWatermark();
          setWatermark(
            `${store.state.user.data.username} - ${store.state.user.data.fullname}`,
            moment().format('ll'),
          );
        }
        reload();
      },
    });

    const handleChangeLang = (value) => {
      if (value != lang.value) lang.value = value;
    };

    const isFullScreen = ref(false);
    const toggleFullScreen = () => {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    };

    const handleUserLogout = () => {
      userLogout().then(async () => {
        // Clean user information
        clearUserData();
        // Redirect to login page
        router.replace({ name: 'login' });
      });
    };

    const logo = computed(() => {
      return store.getters['sys/logo'];
    });

    return {
      getUserInfo,

      toggleMenu,
      search,
      handleSearch,
      handleEnter,

      chat_notices,
      decryptData,
      handleClickChatNotice,

      mail_notices,
      handleClickMailNotice,

      comment_notices,
      handleClickCommentNotice,
      replaceHtml,

      flow_notices,
      handleClickFlowNotice,

      theme,

      languages,
      lang,
      handleChangeLang,

      isFullScreen,
      toggleFullScreen,

      handleUserLogout,

      logo,
    };
  },
};
</script>
