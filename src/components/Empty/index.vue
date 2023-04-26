<template>
  <div class="d-flex flex-column justify-content-center m-5">
    <img src="@/assets/images/svg/empty.svg" class="mx-auto p-2" height="150" loading="lazy" />
    <p class="text-muted text-center">{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import i18n from '@utils/i18n';
export default defineComponent({
  props: {
    text: {
      type: String,
      default: () => i18n.global.t('components.empty.text'),
      requried: true,
    },
  },
  setup() {},
});
</script>
