<template>
  <span v-if="theme === 'alpine'">
    <span v-if="['acl_view', 'acl_edit'].includes(params._column.field)">
      <Avatar
        v-if="Array.isArray(params.value)"
        :data="
          params.value.length
            ? $store.state.org.users.filter((user) => params.value.includes(user.username))
            : [{ username: 0, fullname: $t('data.list.renderer.user.userAll') }]
        "
        size="xs"
      />
    </span>
    <span v-else>
      <span v-if="user" class="d-flex align-items-center">
        <Avatar :data="user" size="xs" />
        <span class="d-flex flex-column ms-1" style="line-height: 100%">
          <span class="fs-14">{{ user.fullname }}</span>
          <span class="fs-10 text-muted">{{ user.username }}</span>
        </span>
      </span>
    </span>
  </span>
  <span v-else style="line-height: inherit" class="align-items-center d-flex">
    <span v-if="['acl_view', 'acl_edit'].includes(params._column.field)">
      <Avatar
        v-if="Array.isArray(params.value)"
        style="margin-top: -1px"
        :data="
          params.value.length
            ? $store.state.org.users.filter((user) => params.value.includes(user.username))
            : [{ username: 0, fullname: $t('data.list.renderer.user.userAll') }]
        "
        size="xxs"
      />
    </span>
    <span v-else>
      <span v-if="user" class="d-flex align-items-center">
        <Avatar style="margin-top: -1px" :data="user" size="xxs" />
        <span class="ms-1">
          {{ user.fullname }}
          <small class="text-muted">[{{ user.username }}]</small>
        </span>
      </span>
    </span>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import store from '@store';
import Avatar from '@components/Avatar';
export default defineComponent({
  components: {
    Avatar,
  },
  setup(props) {
    const theme = computed(() => {
      return props.params.api.getTheme();
    });

    const user = ref(null);
    if (!['acl_view', 'acl_edit'].includes(props.params._column.field) && props.params.value) {
      if (props.params.value === '@system')
        user.value = { username: '@system', fullname: 'System' };
      else if (props.params.value.includes('@pub'))
        user.value = {
          username: props.params.value,
          fullname: props.params.value.replace('@pub_', 'Pub_'),
        };
      else user.value = store.state.org.users.find((user) => user.username === props.params.value);
    }
    return {
      theme,
      user,
    };
  },
});
</script>
