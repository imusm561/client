<template>
  <li class="nav-item w-100">
    <span
      v-if="item.status === 0"
      class="nav-link menu-link text-muted"
      style="cursor: not-allowed"
    >
      <i :class="['fs-16 mdi', item.icon || 'mdi-circle-medium']"></i>
      <span class="text-truncate" :title="$t(item.title)">{{ $t(item.title) }}</span>
      <span
        v-if="item?.badge?.text"
        :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
      >
        {{ item.badge.text }}
      </span>
    </span>
    <a
      v-else-if="item.redirect"
      class="nav-link menu-link"
      :href="item.redirect"
      target="_blank"
      rel="nofollow"
    >
      <i :class="['fs-16 mdi', item.icon || 'mdi-circle-medium']"></i>
      <span class="text-truncate" :title="$t(item.title)">{{ $t(item.title) }}</span>
      <span
        v-if="item?.badge?.text"
        :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
      >
        {{ item.badge.text }}
      </span>
    </a>
    <router-link v-else-if="item.route" :to="item.route" class="nav-link">
      <i :class="['fs-16 mdi', item.icon || 'mdi-circle-medium']"></i>
      <span class="text-truncate" :title="$t(item.title)">{{ $t(item.title) }}</span>
      <span
        v-if="item?.badge?.text"
        :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
      >
        {{ item.badge.text }}
      </span>
      <span
        v-else-if="$store.state.user.notices[item.id] && $store.state.user.notices[item.id].length"
        :class="['badge', 'rounded-pill', `bg-${item?.badge?.variant || 'primary'}`]"
      >
        {{ $store.state.user.notices[item.id].length }}
      </span>
      <span
        v-else-if="$store.state.user.notices.flow?.filter((flow) => flow.tid === item.id)?.length"
        :class="['badge', 'rounded-pill', `bg-${item?.badge?.variant || 'primary'}`]"
      >
        {{ $store.state.user.notices.flow.filter((flow) => flow.tid === item.id).length }}
      </span>
    </router-link>
    <span v-else class="nav-link menu-link">
      <i :class="['fs-16 mdi', item.icon || 'mdi-circle-medium']"></i>
      <span class="text-truncate" :title="$t(item.title)">{{ $t(item.title) }}</span>
      <span
        v-if="item?.badge?.text"
        :class="['badge', 'rounded-pill', `bg-${item.badge.variant || 'primary'}`]"
      >
        {{ item.badge.text }}
      </span>
    </span>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>
