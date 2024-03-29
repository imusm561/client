<template>
  <div id="search-results">
    <!-- Recent -->
    <div v-if="result.recent?.length">
      <div class="dropdown-header">
        <h6 class="text-overflow text-muted mb-0 text-uppercase">
          {{ $t('layout.navbar.search.recentSearches') }}
        </h6>
      </div>

      <div class="dropdown-item bg-transparent text-wrap">
        <span
          class="btn btn-soft-secondary btn-sm btn-rounded me-1 mb-1"
          v-for="(item, index) in result.recent"
          :key="index"
          @click.stop="$emit('set-keyword', item)"
        >
          {{ item }}
          <i class="mdi mdi-magnify ms-1"></i>
        </span>
      </div>
    </div>

    <!-- User-->
    <div v-if="result.user?.length">
      <div class="dropdown-header">
        <h6 class="text-overflow text-muted mb-0 text-uppercase">
          {{ $t('layout.navbar.search.user') }}
        </h6>
      </div>
      <div
        class="d-flex align-items-center dropdown-item notify-item py-2 cursor-pointer"
        v-for="user in result.user"
        :key="user.id"
        @click="$router.push({ name: 'chat', query: { contact: user.username } })"
      >
        <Avatar :data="user" size="xs" />
        <span class="d-flex flex-column ms-1">
          <span class="fs-14">{{ user.fullname }}</span>
          <span class="fs-10 text-muted">{{ user.post }}</span>
        </span>
      </div>
    </div>

    <!-- Form-->
    <div v-if="result.form?.length">
      <div class="dropdown-header">
        <h6 class="text-overflow text-muted mb-0 text-uppercase">
          {{ $t('layout.navbar.search.form') }}
        </h6>
      </div>
      <div
        class="dropdown-item notify-item cursor-pointer"
        v-for="item in result.form"
        :key="item.id"
      >
        <span
          v-if="item.status === 0"
          class="d-flex align-items-center justify-content-between text-muted"
          style="cursor: not-allowed"
        >
          <span class="text-truncate">
            <i
              class="mdi align-middle fs-18 text-muted me-2"
              :class="item.icon || 'mdi-circle-medium'"
            ></i>
            <span>{{ $t(item.title) }}</span>
          </span>
          <span
            v-if="item.rid === undefined && item?.badge?.text"
            :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
          >
            {{ item.badge.text }}
          </span>
        </span>
        <a
          v-else-if="item.redirect"
          class="d-flex align-items-center justify-content-between"
          :href="item.redirect"
          target="_blank"
          rel="nofollow"
        >
          <span class="text-truncate">
            <i
              class="mdi align-middle fs-18 text-muted me-2"
              :class="item.icon || 'mdi-circle-medium'"
            ></i>
            <span>{{ $t(item.title) }}</span>
          </span>
          <span
            v-if="item.rid === undefined && item?.badge?.text"
            :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
          >
            {{ item.badge.text }}
          </span>
        </a>
        <router-link
          v-else-if="item.route"
          :to="item.route"
          class="d-flex align-items-center justify-content-between"
        >
          <span class="text-truncate">
            <i
              class="mdi align-middle fs-18 text-muted me-2"
              :class="item.icon || 'mdi-circle-medium'"
            ></i>
            <span>{{ $t(item.title) }}</span>
          </span>
          <span
            v-if="item.rid === undefined && item?.badge?.text"
            :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
          >
            {{ item.badge.text }}
          </span>
          <span
            v-else-if="
              item.rid === undefined &&
              $store.state.user.notices[item.id] &&
              $store.state.user.notices[item.id].length
            "
            :class="['badge', 'rounded-pill', `bg-${item?.badge?.variant || 'primary'}`]"
          >
            {{ $store.state.user.notices[item.id].length }}
          </span>
          <span
            v-else-if="
              item.rid === undefined &&
              $store.state.user.notices.flow?.filter((flow) => flow.tid === item.id)?.length
            "
            :class="['badge', 'rounded-pill', `bg-${item?.badge?.variant || 'primary'}`]"
          >
            {{ $store.state.user.notices.flow.filter((flow) => flow.tid === item.id).length }}
          </span>
        </router-link>
        <span v-else class="d-flex align-items-center justify-content-between">
          <span class="text-truncate">
            <i
              class="mdi align-middle fs-18 text-muted me-2"
              :class="item.icon || 'mdi-circle-medium'"
            ></i>
            <span>{{ $t(item.title) }}</span>
          </span>
          <span
            v-if="item.rid === undefined && item?.badge?.text"
            :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
          >
            {{ item.badge.text }}
          </span>
        </span>
      </div>
    </div>

    <!-- Data-->
    <div v-if="result.data?.length">
      <div class="dropdown-header">
        <h6 class="text-overflow text-muted mb-0 text-uppercase">
          {{ $t('layout.navbar.search.data') }}
        </h6>
      </div>
      <div
        class="dropdown-item notify-item cursor-pointer"
        v-for="(data, index) in result.data"
        :key="index"
      >
        <router-link
          :to="{ name: 'view', params: { tid: data.tid, rid: data.rid } }"
          class="d-block text-truncate"
        >
          <span :title="`${data.tid}/${data.rid}/${data.cid}`">
            {{ Array.isArray(data.value) ? JSON.stringify(data.value) : replaceHtml(data.value) }}
          </span>
        </router-link>
      </div>
    </div>

    <!-- File-->
    <div v-if="result.file?.length">
      <div class="dropdown-header">
        <h6 class="text-overflow text-muted mb-0 text-uppercase">
          {{ $t('layout.navbar.search.file') }}
        </h6>
      </div>
      <div
        class="dropdown-item notify-item cursor-pointer d-flex"
        v-for="file in result.file"
        :key="file.id"
        @click.stop="handlePreviewFile(file)"
      >
        <div class="flex-shrink-0 me-2 mt-1">
          <img
            v-if="file.category === 'image'"
            :src="`${BASE_URL}cor/file/load/${file.uuid}`"
            class="rounded avatar-xs cursor-pointer"
            loading="lazy"
          />
          <i v-else class="file-icon" :class="FileIcons.getClassWithColor(file.name)" />
        </div>
        <div class="flex-grow-1 w-75">
          <div class="d-flex">
            <div class="flex-grow-1 mt-1 cursor-pointer text-truncate">
              <b>{{ file.name }}</b>
            </div>
          </div>
          <small class="text-muted">
            {{ size2Str(file.size) }}
            <i
              class="mdi mdi-eye cursor-pointer ms-1 text-primary"
              :title="file.source"
              @click.stop="handleViewFileSource(file.source)"
            />
            <i
              class="mdi mdi-download cursor-pointer ms-1 text-primary"
              @click.stop="handleDownloadFile(file)"
            />
          </small>
        </div>
      </div>
    </div>

    <!-- Icon-->
    <div v-if="result.icon?.length">
      <div class="dropdown-header">
        <h6 class="text-overflow text-muted mb-0 text-uppercase">
          {{ $t('layout.navbar.search.icon') }}
        </h6>
      </div>
      <div
        class="dropdown-item notify-item cursor-pointer"
        v-for="icon in result.icon"
        :key="icon.name"
        @click.stop="handleClickIcon(icon)"
      >
        <span class="text-truncate">
          <i class="align-middle text-muted me-2" :class="`mdi mdi-${icon.name}`"></i>
          <span>{{ icon.name }}</span>
        </span>
      </div>
    </div>

    <Empty
      :text="$t('layout.navbar.search.empty', { keyword })"
      v-if="
        !(
          result.user?.length ||
          result.form?.length ||
          result.data?.length ||
          result.file?.length ||
          result.icon?.length
        )
      "
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { size2Str, replaceHtml, copyToClipboard } from '@utils';
import i18n from '@utils/i18n';
import Avatar from '@components/Avatar';
import Empty from '@components/Empty';
defineProps({
  keyword: {
    type: String,
    default: () => '',
    requried: true,
  },
  result: {
    type: Object,
    default: () => {
      return {};
    },
    requried: true,
  },
});

const { FileIcons } = window;

const router = useRouter();
const toast = useToast();
const { BASE_URL } = process.env;

const handlePreviewFile = (file) => {
  const { href } = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
  window.open(href, '_blank');
};

const handleViewFileSource = (source) => {
  // const { href } = router.resolve({ path: source });
  window.open(`${BASE_URL}${source.substring(1)}`, '_blank');
};

const handleDownloadFile = (file) => {
  let downloadElement = document.createElement('a');
  downloadElement.href = `${BASE_URL}cor/file/load/${file.uuid}?raw=1`;
  downloadElement.download = file.name;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
};

const handleClickIcon = (icon) => {
  copyToClipboard(`mdi mdi-${icon.name}`)
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
};
</script>
