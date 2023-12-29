<template>
  <UserSelector
    :key="`editor_acl_edit_${params._form.id}`"
    v-model="value"
    :placeholder="$t('data.column.BasicAclEdit')"
    :disabled="params._form.flow.length > 0"
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
