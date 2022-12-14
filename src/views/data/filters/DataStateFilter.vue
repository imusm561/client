<template>
  <span v-if="params.value === $t('data.list.filter.selectAll')">{{ $t('data.list.filter.selectAll') }}</span>
  <span v-else class="badge text-uppercase" :class="resolveBadgeBg(params.value)">{{ $t(`data.column.BasicDataState.${params.value}`) }}</span>
</template>

<script>
import { computed, defineComponent } from 'vue';
export default defineComponent({
  setup() {
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
    return {
      resolveBadgeBg,
    };
  },
});
</script>
