<template>
  <li class="nav-item">
    <a class="nav-link menu-link" :href="`#g_${item.id}`" data-bs-toggle="collapse">
      <i :class="['fs-16 mdi', item.icon || 'mdi-circle-medium']"></i>
      <span>{{ $t(item.title) }}</span>
    </a>
    <div class="collapse menu-dropdown" :id="`g_${item.id}`">
      <ul class="nav nav-sm flex-column">
        <component :is="resolveNavItemComponent(child)" v-for="child in item.children" :key="`${child.id}-${child.title}`" :item="child" />
      </ul>
    </div>
  </li>
</template>

<script>
import Header from './header.vue';
import Link from './link.vue';
export default {
  name: 'Group',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    Header,
    Link,
  },
  setup() {
    const resolveNavItemComponent = (item) => {
      if (item.header) return 'header';
      if (item.children && item.children.length) return 'group';
      return 'link';
    };

    return {
      resolveNavItemComponent,
    };
  },
};
</script>
