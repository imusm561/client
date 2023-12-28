<template>
  <UserSelector
    v-model="value"
    :disabled="params._form.flow.length > 0"
    :placeholder="$t(data.column.BasicAclView)"
  />
</template>

<script>
import { defineComponent, ref } from 'vue';
import UserSelector from '@components/UserSelector';
export default defineComponent({
  components: {
    UserSelector,
  },
  setup(props) {
    const value = ref(props.params.value);

    const getValue = () => {
      return value.value;
    };

    const isCancelAfterEnd = () => {
      return false;
    };

    return {
      value,
      getValue,
      isCancelAfterEnd,
    };
  },
});
</script>
