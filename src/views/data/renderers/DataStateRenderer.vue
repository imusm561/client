<template>
  <span v-if="params.value" class="badge text-uppercase" :class="resolveBadgeBg(params.value)">
    {{ $t(`data.column.BasicDataState.${params.value}`) }}
  </span>
  <span v-else></span>
</template>

<script setup>
import { computed } from 'vue';
const resolveBadgeBg = computed(() => {
  return (state) => {
    switch (state) {
      case 'published':
        return 'bg-primary';
      case 'deleted':
        return 'bg-danger';
      case 'drafted':
        return 'bg-info';
      case 'archived':
        return 'bg-success';
      case 'approving':
        return 'bg-secondary';
      default:
        return 'bg-warning';
    }
  };
});
</script>
