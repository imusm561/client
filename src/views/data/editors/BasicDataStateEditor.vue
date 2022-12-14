<template>
  <VueSelect v-model="value" :placeholder="$t('data.column.BasicDataState')" :options="['published', 'deleted', 'drafted', 'archived']">
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        <span v-html="$t('components.vs.search', { search })"></span>
      </template>
      <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
    </template>
  </VueSelect>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup(props) {
    const value = ref(props.params.value);

    const getValue = () => {
      return value.value;
    };

    const isCancelAfterEnd = () => {
      return !value.value;
    };

    return {
      value,
      getValue,
      isCancelAfterEnd,
    };
  },
});
</script>
