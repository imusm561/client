<template>
  <FlatPickr
    class="form-control h-100"
    :placeholder="params._column.cfg.placeholder"
    :config="params._column.cfg"
    v-model="value"
  ></FlatPickr>
</template>

<script>
import { defineComponent, ref } from 'vue';
import FlatPickr from '@components/FlatPickr';
export default defineComponent({
  components: {
    FlatPickr,
  },
  setup(props) {
    const value = ref(props.params.value);
    const getValue = () => {
      return value.value;
    };
    const isCancelAfterEnd = () => {
      return !!props.params._column._required && !value.value;
    };
    return {
      value,
      getValue,
      isCancelAfterEnd,
    };
  },
});
</script>
