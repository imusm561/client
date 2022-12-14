<template>
  <li class="menu-title">
    <span>{{ $t(item.title) }}</span>
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
