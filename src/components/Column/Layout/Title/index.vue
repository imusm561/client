<template>
  <div class="ck ck-content" v-html="column.cfg.content"></div>
</template>

<script setup>
// eslint-disable-next-line
defineProps({
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>
