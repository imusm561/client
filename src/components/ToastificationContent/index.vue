<template>
  <div class="toastification w-100 toast show">
    <div class="toast-header">
      <div v-if="user">
        <Avatar class="me-2" :data="user" size="xxs" />
      </div>
      <div v-else>
        <i :class="`mdi ${icon} text-${variant} fs-16 align-middle me-2`"></i>
      </div>
      <span :class="`fw-semibold me-auto text-truncate text-${variant}`">
        {{ title ? $t(title) : user ? user.fullname : $store.state.sys.name }}
      </span>
      <small v-if="time" style="white-space: nowrap">{{ dayjs(time).fromNow() }}</small>
      <button type="button" class="btn-close" @click="$emit('close-toast')"></button>
    </div>
    <div
      class="toast-body"
      :class="{ 'cursor-pointer ': !!to }"
      :title="text"
      @click="handleClickText"
    >
      <span class="text-muted text-truncate-five-lines">{{ $t(text) }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import dayjs from '@utils/dayjs';
import Avatar from '@components/Avatar';
// eslint-disable-next-line
const props = defineProps({
  variant: {
    type: String,
    default: null,
  },
  user: {
    type: Object,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  time: {
    type: String,
    default: null,
  },
  to: {
    type: String,
    default: null,
  },
});
// eslint-disable-next-line
const emits = defineEmits(['close-toast']);

const handleClickText = () => {
  if (props.to) {
    const to = JSON.parse(JSON.stringify(props.to));
    to.query = to.query || {};
    to.query.t = new Date().getTime();
    const router = useRouter();
    router.replace(to);
    emits('close-toast');
  }
};
</script>
