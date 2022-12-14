<template>
  <flat-pickr :class="['flatpickr-input', disabled && 'disabled']" :placeholder="placeholder" v-model="date" :config="configuration" :disabled="disabled"></flat-pickr>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import store from '@store';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js';
export default defineComponent({
  components: {
    flatPickr,
  },
  props: {
    modelValue: {
      type: [String, Array],
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
  },
  setup(props, { emit }) {
    const configuration = ref({
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

    if (!['Y-m-d H:i:S', 'Y-m-d H:i', 'Y-m-d', 'H:i:S', 'H:i'].includes(configuration.value.dateFormat)) configuration.value.dateFormat = 'Y-m-d';

    switch (configuration.value.dateFormat) {
      case 'Y-m-d H:i:S':
        configuration.value.enableTime = true;
        configuration.value.enableSeconds = true;
        configuration.value.noCalendar = false;
        break;

      case 'Y-m-d H:i':
        configuration.value.enableTime = true;
        configuration.value.enableSeconds = false;
        configuration.value.noCalendar = false;
        break;

      case 'H:i:S':
        configuration.value.enableTime = true;
        configuration.value.enableSeconds = true;
        configuration.value.noCalendar = true;
        break;

      case 'H:i':
        configuration.value.enableTime = true;
        configuration.value.enableSeconds = false;
        configuration.value.noCalendar = true;
        break;

      default:
        configuration.value.enableTime = false;
        configuration.value.enableSeconds = false;
        configuration.value.noCalendar = false;
        break;
    }

    if (store.state.sys.lang === 'zh-cn') configuration.value.locale = Mandarin;

    return {
      configuration,
      date: computed({
        get() {
          return props.modelValue;
        },
        set(value) {
          emit('update:modelValue', value);
        },
      }),
    };
  },
});
</script>
