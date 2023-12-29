<template>
  <UserSelector
    :key="`editor_acl_view_${params._form.id}`"
    v-model="value"
    :placeholder="$t('data.column.BasicAclView')"
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
