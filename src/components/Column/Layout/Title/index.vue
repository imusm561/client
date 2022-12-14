<template>
  <div class="ck ck-content" v-html="column.cfg.content"></div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    column: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {},
});
</script>
