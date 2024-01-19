<template>
  <span v-if="params.value === $t('data.list.filter.selectAll')">
    {{ $t('data.list.filter.selectAll') }}
  </span>
  <span v-else-if="user" class="d-flex align-items-center">
    <Avatar :data="user" size="xxxs" />
    <span class="d-flex flex-column ms-1" style="line-height: 100%">
      <span class="fs-14 text-dark">{{ user.fullname }}</span>
    </span>
  </span>
  <span v-else>{{ $t('data.list.filter.blank') }}</span>
</template>

<script>
import { defineComponent, ref } from 'vue';
import store from '@store';
import Avatar from '@components/Avatar';
export default defineComponent({
  components: {
    Avatar,
  },
  setup(props) {
    const user = ref(null);
    if (props.params.value === null) user.value = null;
    else if (props.params.value === '@system')
      user.value = { username: '@system', fullname: 'System' };
    else if (props.params.value.includes('@pub'))
      user.value = {
        username: props.params.value,
        fullname: props.params.value.replace('@pub_', 'Pub_'),
      };
    else
      user.value = store.state.org.users.find((user) => user.username === props.params.value) || {
        username: props.params.value,
        fullname: props.params.value,
      };
    return { user };
  },
});
</script>
