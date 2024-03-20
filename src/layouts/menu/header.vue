<template>
  <li class="menu-title">
    <span>{{ $t(item.title) }}</span>
  </li>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
