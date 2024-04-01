<template>
  <div class="pagination-wrap hstack gap-2">
    <span v-if="layout.includes('total')" class="float-start">
      {{ $tc('components.pagination.total', { total }) }}
    </span>
    <div v-if="layout.includes('sizes')" class="btn-group dropup d-none d-md-flex">
      <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
        {{ currentSize }}/{{ $t('components.pagination.page') }}
      </button>
      <ul class="dropdown-menu">
        <li v-for="(size, index) in sizesList" :key="index">
          <a class="dropdown-item cursor-pointer" @click="currentSize = size">
            {{ size }}/{{ $t('components.pagination.page') }}
          </a>
        </li>
      </ul>
    </div>
    <span
      v-if="layout.includes('prev') && pager.length > 1 && currentPage > 1"
      class="page-item pagination-prev cursor-pointer d-none d-xl-flex"
      @click="prev"
    >
      {{ $t('components.pagination.prev') }}
    </span>
    <ul
      v-if="layout.includes('pager') && pager.length > 1"
      class="pagination pagination-pager mb-0 d-none d-xl-flex"
      :key="pager"
    >
      <li v-for="page in pager" :key="page" :class="{ active: page === currentPage }">
        <span class="page cursor-pointer" @click="goto(page)">
          {{ ['p', 'n'].includes(page) ? '...' : page }}
        </span>
      </li>
    </ul>
    <span
      v-if="layout.includes('next') && pager.length > 1 && currentPage < pagerCount"
      class="page-item pagination-next cursor-pointer d-none d-xl-flex"
      @click="next"
    >
      {{ $t('components.pagination.next') }}
    </span>
    <span v-if="layout.includes('jumper') && pager.length > 1">
      {{ $t('components.pagination.goto') }}
    </span>
    <input
      v-if="layout.includes('jumper') && pager.length > 1"
      type="number"
      class="form-control pagination-jumper"
      v-model="jumper"
      @blur="goto(jumper)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// eslint-disable-next-line
const props = defineProps({
  pageNum: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 100,
  },
  total: {
    type: Number,
    default: 0,
  },
  sizesList: {
    type: Array,
    default: () => {
      return [100, 500, 1000];
    },
  },
  layout: {
    type: String,
    default: () => {
      return 'total, sizes, prev, pager, next, jumper';
    },
  },
});
// eslint-disable-next-line
const emits = defineEmits(['changed']);

const step = ref(5);
const jumper = ref(props.pageNum);

const currentPage = computed({
  get() {
    return props.pageNum;
  },
  set(value) {
    jumper.value = value;
    if (props.pageNum != value) {
      emits('changed', {
        pageNum: value,
        pageSize: props.pageSize,
      });
    }
  },
});

const currentSize = computed({
  get() {
    return props.pageSize;
  },
  set(value) {
    jumper.value = 1;
    emits('changed', {
      pageNum: 1,
      pageSize: value,
    });
  },
});

const pagerCount = computed(() => {
  return Math.ceil(props.total / currentSize.value);
});

const pager = computed(() => {
  if (pagerCount.value <= step.value + 1) {
    return [...new Array(pagerCount.value).keys()].map((i) => i + 1);
  } else {
    if (currentPage.value < step.value)
      return [1, ...[...new Array(step.value).keys()].map((i) => i + 2), 'n', pagerCount.value];
    else if (currentPage.value > pagerCount.value - step.value + 1)
      return [
        1,
        'p',
        ...[...new Array(step.value + 1).keys()].map((i) => pagerCount.value - i).reverse(),
      ];
    else
      return [
        1,
        'p',
        ...[...new Array(step.value).keys()].map((i) => currentPage.value - 2 + i),
        'n',
        pagerCount.value,
      ];
  }
});

const prev = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const next = () => {
  if (currentPage.value < pagerCount.value) currentPage.value++;
};

const goto = (num) => {
  if (num === 'n')
    currentPage.value =
      currentPage.value + step.value > pagerCount.value
        ? pagerCount.value
        : currentPage.value + step.value;
  else if (num === 'p')
    currentPage.value = currentPage.value - step.value < 1 ? 1 : currentPage.value - step.value;
  else if (num > 0 && num <= pagerCount.value) currentPage.value = Number(num);
  else currentPage.value = props.pageNum;
};
</script>
