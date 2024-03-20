<template>
  <span v-if="['alpine', 'quartz'].includes(theme)">
    <span v-if="['acl_view', 'acl_edit'].includes(params._column.field)" class="ag-avatar">
      <Avatar
        v-if="Array.isArray(params.value)"
        :data="
          params.value.length
            ? params.value.map((username) => {
                return (
                  $store.state.org.users.find((user) => user.username === username) || {
                    username: username,
                    fullname: username,
                  }
                );
              })
            : []
        "
        size="xs"
      />
    </span>
    <span v-else-if="user" class="ag-avatar d-flex align-items-center">
      <Avatar :data="user" size="xs" />
      <span class="d-flex flex-column ms-1">
        <span class="fs-14">{{ user.fullname }}</span>
        <span class="fs-10 text-muted">{{ user.username }}</span>
      </span>
    </span>
  </span>

  <span v-else>
    <span v-if="['acl_view', 'acl_edit'].includes(params._column.field)" class="ag-avatar">
      <Avatar
        v-if="Array.isArray(params.value)"
        :data="
          params.value.length
            ? params.value.map((username) => {
                return (
                  $store.state.org.users.find((user) => user.username === username) || {
                    username: username,
                    fullname: username,
                  }
                );
              })
            : []
        "
        size="xxs"
      />
    </span>
    <span v-else-if="user" class="ag-avatar d-flex align-items-center">
      <Avatar :data="user" size="xxs" />
      <span class="ms-1">
        {{ user.fullname }}
        <small class="text-muted">[{{ user.username }}]</small>
      </span>
    </span>
  </span>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import Avatar from '@components/Avatar';
import store from '@store';

const props = defineProps(['params']);

const theme = computed(() => {
  return props.params.api.getTheme();
});

const user = ref(null);
if (!['acl_view', 'acl_edit'].includes(props.params._column.field) && props.params.value) {
  if (props.params.value === '@system') user.value = { username: '@system', fullname: 'System' };
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
}
</script>
