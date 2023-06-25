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

<script>
import { defineComponent, ref } from 'vue';
import FlatPickr from '@/components/FlatPickr';
export default defineComponent({
  components: {
    FlatPickr,
  },
  setup(props) {
    const moment = window.moment;

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
    const getDate = () => {
      return date.value
        ? moment(
            props.params.filterParams._column.cfg.dateFormat.includes('Y-m-d')
              ? date.value
              : `${moment().format('YYYY-MM-DD')} ${date.value}`,
          ).toDate()
        : null;
    };

    const setDate = (res) => {
      date.value = res;
    };

    const disabled = ref(false);
    const setDisabled = (res) => {
      disabled.value = res;
    };

    return {
      onOpen,
      onChange,
      onClose,
      date,
      getDate,
      setDate,
      disabled,
      setDisabled,
    };
  },
});
</script>
