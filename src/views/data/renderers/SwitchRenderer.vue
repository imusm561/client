<template>
  <span
    v-if="typeof params.value === 'boolean'"
    :class="`form-check form-switch mt-${
      ['alpine', 'quartz'].includes(theme) ? '2' : '1'
    } form-switch-${params._column.cfg.style} form-switch-${
      ['alpine', 'quartz'].includes(theme) ? 'md' : 'sm'
    }`"
  >
    <input
      type="checkbox"
      class="form-check-input"
      :style="{ 'margin-top': ['alpine', 'quartz'].includes(theme) ? '2px' : '' }"
      disabled
      :checked="params.value"
    />
  </span>
  <span v-else></span>
</template>

<script setup>
import { computed } from 'vue';
// eslint-disable-next-line
const props = defineProps(['params']);
const theme = computed(() => {
  return props.params.api.getTheme();
});
</script>
