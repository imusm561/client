<template>
  <VueSelect :placeholder="params._column.cfg.placeholder" v-model="value" multiple :close-on-select="false" taggable :options="options">
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        <span v-html="$t('components.vs.search', { search })"></span>
      </template>
      <em v-else style="opacity: 0.5">{{ $t('components.vs.generateOption') }}</em>
    </template>
  </VueSelect>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
export default defineComponent({
  setup(props) {
    const value = ref(props.params.value);

    const options = computed(() => {
      return Array.from(new Set([...(props.params._column.cfg.options || []), ...(value.value || [])]));
    });

    const getValue = () => {
      return value.value;
    };
    const isCancelAfterEnd = () => {
      return !!props.params._column._required && (!value.value || value.value.length === 0);
    };

    return {
      value,
      options,
      getValue,
      isCancelAfterEnd,
    };
  },
});
</script>
