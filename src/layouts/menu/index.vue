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

<script>
import Header from './header.vue';
import Group from './group.vue';
import Link from './link.vue';
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  components: {
    Header,
    Link,
    Group,
  },
  setup() {
    const resolveNavItemComponent = (item) => {
      if (item.header) return 'Header';
      if (item.children && item.children.length) return 'Group';
      return 'Link';
    };

    return {
      resolveNavItemComponent,
    };
  },
};
</script>
