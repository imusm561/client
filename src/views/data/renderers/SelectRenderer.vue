<template>
  <span v-if="data">
    <span v-if="Array.isArray(data)">
      <span v-for="(item, index) in data" :key="index">
        <span
          class="cursor-pointer text-decoration-underline text-secondary"
          v-if="item.text && item.raw"
          @dblclick="handleClickValue(item)"
          :title="`${item.raw.tid}/${item.raw.rid}`"
        >
          {{ item.text }}
        </span>
        <span
          v-else
          :class="params._column.component === 'SelectTags' ? 'me-1 badge bg-primary' : ''"
        >
          {{ item }}
        </span>
        <span v-if="params._column.component === 'SelectMultiple' && index < data.length - 1">
          &nbsp;|&nbsp;
        </span>
      </span>
    </span>
    <span v-else>
      <span
        class="cursor-pointer text-decoration-underline text-secondary"
        v-if="data.text && data.raw"
        @dblclick="handleClickValue(data)"
        :title="`${data.raw.tid}/${data.raw.rid}`"
      >
        {{ data.text }}
      </span>
      <span v-else>{{ data }}</span>
    </span>
  </span>
  <span v-else></span>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getDataByFormula } from '@utils';

// eslint-disable-next-line
const props = defineProps(['params']);

const column = JSON.parse(JSON.stringify(props.params._column));
const data = ref(null);

onBeforeMount(async () => {
  if (column.cfg?.__source && props.params.value) {
    data.value = await getDataByFormula(props.params.data, column.cfg.__source, {
      view: true,
      value: props.params.value,
    });
  } else {
    data.value = JSON.parse(JSON.stringify(props.params.value || null));
  }
});

const router = useRouter();
const handleClickValue = (item) => {
  const { href } = router.resolve({ name: 'view', params: item.raw });
  window.open(href, '_blank');
};
</script>
