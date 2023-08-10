<template>
  <span
    v-if="typeof params.value === 'boolean'"
    :class="`form-check form-switch mt-${theme === 'alpine' ? '2' : '1'} form-switch-${
      params._column.cfg.style
    } form-switch-${theme === 'alpine' ? 'md' : 'sm'}`"
  >
    <input
      type="checkbox"
      class="form-check-input"
      :style="{ 'margin-top': theme === 'alpine' ? '2px' : '' }"
      disabled
      :checked="params.value"
    />
  </span>
  <span v-else></span>
</template>
<script>
import { defineComponent, computed } from 'vue';
export default defineComponent({
  setup(props) {
    const theme = computed(() => {
      return props.params.api.getTheme();
    });
    return { theme };
  },
});
</script>
