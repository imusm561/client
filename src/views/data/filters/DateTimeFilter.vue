<template>
  <FlatPickr
    class="ag-input-wrapper custom-date-filter"
    style="width: 100%"
    :disabled="disabled"
    :placeholder="params.filterParams._column.cfg.dateFormat"
    :config="{
      wrap: true,
      dateFormat: params.filterParams._column.cfg.dateFormat,
      onOpen: onOpen,
      onChange: onChange,
      onClose: onClose,
    }"
    v-model="date"
  ></FlatPickr>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from '@utils/dayjs';
import FlatPickr from '@/components/FlatPickr';

// eslint-disable-next-line
const props = defineProps(['params']);

const onOpen = () => {
  document
    .getElementsByClassName('flatpickr-calendar animate open')[0]
    .classList.add('ag-custom-component-popup');
};

const onChange = () => {
  props.params.onDateChanged();
};

const onClose = () => {
  props.params.onDateChanged();
};

const date = ref(null);

/* eslint-disable-next-line no-unused-vars */
const getDate = () => {
  return date.value
    ? dayjs(
        props.params.filterParams._column.cfg.dateFormat.includes('Y-m-d')
          ? date.value
          : `${dayjs().format('YYYY-MM-DD')} ${date.value}`,
      ).toDate()
    : null;
};

/* eslint-disable-next-line no-unused-vars */
const setDate = (res) => {
  date.value = res;
};

const disabled = ref(false);

/* eslint-disable-next-line no-unused-vars */
const setDisabled = (res) => {
  disabled.value = res;
};
</script>
