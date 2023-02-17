<template>
  <div
    :class="`ms-3 mt-2 form-check form-switch form-switch-${params._column.cfg.style} form-switch-md`"
  >
    <input type="checkbox" class="form-check-input" :checked="value" v-model="value" />
  </div>
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
      return !!props.params._column._required;
    };
    return {
      value,
      getValue,
      isCancelAfterEnd,
    };
  },
});
</script>
