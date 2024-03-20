<template>
  <div class="ck ck-content" v-html="column.cfg.content"></div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>
