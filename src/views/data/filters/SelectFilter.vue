<template>
  <span v-if="data === $t('data.list.filter.selectAll')">
    {{ $t('data.list.filter.selectAll') }}
  </span>
  <span v-else-if="data">
    <span v-if="Array.isArray(data)">
      <span v-for="(item, index) in data" :key="index">
        <span v-if="item.text && item.tid && item.rid" :title="`${item.tid}/${item.rid}`">
          {{ item.text }}
        </span>
        <span v-else>{{ item }}</span>
      </span>
    </span>
    <span v-else>
      <span v-if="data.text && data.tid && data.rid" :title="`${data.tid}/${data.rid}`">
        {{ data.text }}
      </span>
      <span
        v-else
        :class="params._column.component === 'SelectTags' ? 'me-1 badge bg-primary' : ''"
      >
        {{ data }}
      </span>
    </span>
  </span>
  <span v-else>{{ $t('data.list.filter.blank') }}</span>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { replaceVariables, getDataByFormula } from '@utils';
export default defineComponent({
  setup(props) {
    const column = JSON.parse(JSON.stringify(props.params._column));
    const data = ref(null);

    if (column.cfg?.source && props.params.value && props.params.value != '(Select All)') {
      column.cfg.source = replaceVariables(column.cfg.source, props.params._alias);
      getDataByFormula(props.params.data, column.cfg.source, {
        view: true,
        value: props.params.value,
      }).then((res) => {
        data.value = res;
      });
    } else {
      data.value = JSON.parse(JSON.stringify(props.params.value || null));
    }

    return {
      data,
    };
  },
});
</script>
