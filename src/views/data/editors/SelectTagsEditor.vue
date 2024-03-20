<template>
  <VueSelect
    :placeholder="params._column.cfg.placeholder"
    v-model="value"
    multiple
    :close-on-select="false"
    taggable
    :options="options"
  >
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        <span v-html="$t('components.vs.search', { search })"></span>
      </template>
      <em v-else style="opacity: 0.5">{{ $t('components.vs.generateOption') }}</em>
    </template>
  </VueSelect>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
const props = defineProps(['params']);
const value = ref(props.params.value);

const options = computed(() => {
  return Array.from(new Set([...(props.params._column.cfg.options || []), ...(value.value || [])]));
});

/* eslint-disable-next-line no-unused-vars */
const getValue = () => {
  return value.value;
};

/* eslint-disable-next-line no-unused-vars */
const isCancelAfterEnd = () => {
  return !!props.params._column._required && (!value.value || value.value.length === 0);
};
</script>
