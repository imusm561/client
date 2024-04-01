<template>
  <div class="d-flex flex-column justify-content-center m-5">
    <img src="@/assets/images/svg/empty.svg" class="mx-auto p-2" height="150" loading="lazy" />
    <p class="text-muted text-center">{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script setup>
import i18n from '@utils/i18n';
// eslint-disable-next-line
defineProps({
  text: {
    type: String,
    default: () => i18n.global.t('components.empty.text'),
    requried: true,
  },
});
</script>
