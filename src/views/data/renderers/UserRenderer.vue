<template>
  <span v-if="['acl_view', 'acl_edit'].includes(params._column.field)">
    <div class="mt-1" style="line-height: initial">
      <Avatar v-if="params.value && params.value.length" :data="$store.state.org.users.filter((user) => params.value.includes(user.username))" size="xs" />
      <Avatar v-else :data="{ username: 0, fullname: 'All' }" size="xs" />
    </div>
  </span>
  <span v-else>
    <div v-if="user" class="d-flex align-items-center mt-1" style="line-height: initial">
      <Avatar :data="user" size="xs" />
      <span class="d-flex flex-column ms-1" style="line-height: 100%">
        <span class="fs-14 text-dark">{{ user.fullname }}</span>
        <span class="mt-1 fs-10 text-muted">{{ user.username }}</span>
      </span>
    </div>
    <span v-else></span>
  </span>
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
    if (!['acl_view', 'acl_edit'].includes(props.params._column.field) && props.params.value) {
      // created_by && updated_by
      // @system, @pub..., username
      if (props.params.value === '@system') user.value = { username: '@system', fullname: 'System' };
      else if (props.params.value.includes('@pub')) user.value = { username: props.params.value, fullname: props.params.value.replace('@pub_', '') };
      else user.value = store.state.org.users.find((user) => user.username === props.params.value);
    }
    return { user };
  },
});
</script>
