<template>
  <li class="nav-item" :style="item.status === 0 ? 'cursor: not-allowed' : ''">
    <span
      class="cursor-pointer nav-link menu-link"
      :class="item.status === 0 ? 'text-muted' : ''"
      :style="item.status === 0 ? 'pointer-events: none' : ''"
      data-bs-toggle="collapse"
      :data-bs-target="`#c${item.id}`"
    >
      <i :class="['fs-16 mdi', item.icon || 'mdi-circle-medium']"></i>
      <span class="text-truncate" style="width: 85%" :title="item.title">{{ $t(item.title) }}</span>
    </span>
    <div v-if="item.status === 1" class="collapse menu-dropdown" :id="`c${item.id}`">
      <ul class="nav nav-sm flex-column">
        <component
          :is="resolveNavItemComponent(child)"
          v-for="child in item.children"
          :key="`${child.id}-${child.title}`"
          :item="child"
        />
      </ul>
    </div>
  </li>
</template>

<script setup>
import { defineProps } from 'vue';
import Header from './Header.vue';
import Group from './Group.vue';
import Link from './Link.vue';
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const resolveNavItemComponent = (item) => {
  if (item.header) return Header;
  if (item.children && item.children.length) return Group;
  return Link;
};
</script>
