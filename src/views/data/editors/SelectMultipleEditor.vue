<template>
  <VueSelect
    v-if="params._column.cfg.__source"
    :placeholder="params._column.cfg.placeholder"
    v-model="value"
    multiple
    :close-on-select="false"
    :reduce="(item) => item.value"
    label="text"
    :options="options"
    @search="handleSelecterSearch"
    :selectable="(option) => option.value !== 'Error: '"
  >
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        <span v-html="$t('components.vs.search', { search })"></span>
      </template>
      <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
    </template>
  </VueSelect>
  <VueSelect
    v-else
    :placeholder="params._column.cfg.placeholder"
    v-model="value"
    multiple
    :close-on-select="false"
    :options="params._column.cfg.options"
  >
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        <span v-html="$t('components.vs.search', { search })"></span>
      </template>
      <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
    </template>
  </VueSelect>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue';
import { getDataByFormula } from '@utils';
export default defineComponent({
  setup(props) {
    const value = ref(
      props.params.value.map((val) => {
        return Number(val);
      }),
    );

    const getValue = () => {
      return value.value;
    };
    const isCancelAfterEnd = () => {
      return !!props.params._column._required && (!value.value || value.value.length === 0);
    };

    const search = ref([]);
    const select = ref([]);

    watch(
      () => value.value,
      (val) => {
        select.value = search.value.filter((option) => val.includes(option.value));
      },
      { immediate: true },
    );

    const handleSelecterSearch = async (keyword, loading) => {
      loading(true);
      search.value = await getDataByFormula(props.params.data, props.params._column.cfg.__source, {
        search: keyword,
      });
      loading(false);
    };

    const unique = (arr) => {
      const res = new Map();
      return arr.filter((item) => !res.has(item.value) && res.set(item.value, 1));
    };

    const options = computed(() => {
      return unique([
        ...search.value,
        ...(props.params._column.cfg.options || []),
        ...select.value,
      ]);
    });

    return {
      value,
      options,
      handleSelecterSearch,
      getValue,
      isCancelAfterEnd,
    };
  },
});
</script>
