<template>
  <span class="badge text-uppercase" :class="resolveBadgeBg(params.value)">{{ params.value }}</span>
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
