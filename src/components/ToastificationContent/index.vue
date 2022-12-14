<template>
  <div class="toastification w-100 toast show">
    <div class="toast-header">
      <div v-if="user">
        <Avatar class="me-2" :data="user" size="xxs" />
      </div>
      <div v-else>
        <i :class="`mdi ${icon} text-${variant} fs-16 align-middle me-2`"></i>
      </div>
      <span :class="`fw-semibold me-auto text-truncate text-${variant}`">{{ title ? title : user ? user.fullname : $store.state.sys.name }}</span>
      <small v-if="time" style="white-space: nowrap">{{ $moment(time).fromNow() }}</small>
      <button type="button" class="btn-close" @click="$emit('close-toast')"></button>
    </div>
    <div class="toast-body" :class="{ 'cursor-pointer ': !!to }" :title="text" @click="handleClickText">
      <span class="text-muted text-truncate-five-lines">{{ text }}</span>
    </div>
  </div>
</template>

<script>
import router from '@router';
import Avatar from '@components/Avatar';
export default {
  components: {
    Avatar,
  },
  props: {
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
  },
  setup(props, { emit }) {
    const handleClickText = () => {
      if (props.to) {
        const to = JSON.parse(JSON.stringify(props.to));
        to.query = to.query || {};
        to.query.t = new Date().getTime();
        router.replace(to);
        emit('close-toast');
      }
    };
    return {
      handleClickText,
    };
  },
};
</script>
