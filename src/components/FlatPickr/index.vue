<template>
  <flat-pickr
    :class="['flatpickr-input', disabled && 'disabled']"
    :placeholder="placeholder"
    v-model="date"
    :config="configuration"
    :disabled="disabled"
  ></flat-pickr>
</template>

<script setup>
import { defineProps, defineEmits, reactive, computed } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js';
import store from '@store';
const props = defineProps({
  modelValue: {
    type: [String, Array, Date],
    default: () => {
      return '';
    },
  },
  placeholder: {
    type: String,
    default: () => {
      return '';
    },
  },
  disabled: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  config: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const emit = defineEmits(['update:modelValue']);

const configuration = reactive({
  ...{
    mode: 'single', // 'single', 'multiple' or 'range'
    allowInput: true,
    dateFormat: 'Y-m-d',
    enableTime: false,
    enableSeconds: false,
    noCalendar: false,
    defaultHour: 9,
    defaultMinute: 0,
    minuteIncrement: 5,
    // maxDate: '2022-07-31',
    // minDate: '2022-06-01',
    // disable: [(date) => { return [0,6].includes(date.getDay())}] // ['2022-07-25', '2022-07-26']
  },
  ...props.config,
});

if (!['Y-m-d H:i:S', 'Y-m-d H:i', 'Y-m-d', 'H:i:S', 'H:i'].includes(configuration.dateFormat))
  configuration.dateFormat = 'Y-m-d';

switch (configuration.dateFormat) {
  case 'Y-m-d H:i:S':
    configuration.enableTime = true;
    configuration.enableSeconds = true;
    configuration.noCalendar = false;
    break;

  case 'Y-m-d H:i':
    configuration.enableTime = true;
    configuration.enableSeconds = false;
    configuration.noCalendar = false;
    break;

  case 'H:i:S':
    configuration.enableTime = true;
    configuration.enableSeconds = true;
    configuration.noCalendar = true;
    break;

  case 'H:i':
    configuration.enableTime = true;
    configuration.enableSeconds = false;
    configuration.noCalendar = true;
    break;

  default:
    configuration.enableTime = false;
    configuration.enableSeconds = false;
    configuration.noCalendar = false;
    break;
}

if (store.state.sys.lang === 'zh-cn') configuration.locale = Mandarin;

const date = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
