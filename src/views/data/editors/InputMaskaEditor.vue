<template>
  <input
    class="form-control h-100"
    type="text"
    v-maska="params._column.cfg.maska.length === 1 ? params._column.cfg.maska[0] : params._column.cfg.maska"
    :placeholder="params._column.cfg.placeholder"
    v-model="value"
  />
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
