<template>
  <li class="menu-title">
    <span>{{ $t(item.title) }}</span>
  </li>
</template>

<script setup>
// eslint-disable-next-line
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
