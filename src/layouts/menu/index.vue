<template>
  <ul class="navbar-nav h-100" id="navbar-nav">
    <component
      :is="resolveNavItemComponent(item)"
      v-for="item in items"
      :key="`${item.id}-${item.title}`"
      :item="item"
    />
  </ul>
</template>

<script setup>
import Header from './Header.vue';
import Group from './Group.vue';
import Link from './Link.vue';
// eslint-disable-next-line
defineOptions({
  name: 'Menu',
});
// eslint-disable-next-line
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
const resolveNavItemComponent = (item) => {
  if (item.header) return Header;
  if (item.children && item.children.length) return Group;
  return Link;
};
</script>
