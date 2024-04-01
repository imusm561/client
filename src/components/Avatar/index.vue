<template>
  <div v-if="isGroup" class="avatar-group">
    <span v-for="(user, index) in users" :key="index" class="avatar-group-item cursor-pointer">
      <img
        :title="user[keyFullname]"
        v-if="user[keyAvatar]"
        :src="`${BASE_URL}${user[keyAvatar]}`"
        :class="`avatar-${size} rounded-circle bg-avatar img-thumbnail`"
        loading="lazy"
      />
      <div v-else :title="user[keyFullname]" :class="`avatar-${size} rounded-circle`">
        <div :class="`avatar-title rounded-circle bg-avatar text-light ${fs[size]} img-thumbnail`">
          {{
            user.collapse
              ? user[keyUsername]
              : typeof user[keyUsername] === 'string'
              ? user[keyFullname] &&
                user[keyFullname].charAt(user[keyFullname].length - 1).toUpperCase()
              : user[keyFullname] && user[keyFullname].charAt(0).toUpperCase()
          }}
        </div>
      </div>
    </span>
  </div>
  <template v-else>
    <img
      :title="user[keyFullname]"
      v-if="user[keyAvatar]"
      :src="`${BASE_URL}${user[keyAvatar]}`"
      :class="`avatar-${size} rounded-circle bg-avatar ${thumbnail ? 'img-thumbnail' : ''}`"
      loading="lazy"
    />
    <div v-else :title="user[keyFullname]" :class="`avatar-${size} rounded-circle`">
      <div
        :class="`avatar-title rounded-circle bg-avatar text-light ${fs[size]} ${
          thumbnail ? 'img-thumbnail' : ''
        }`"
      >
        {{
          typeof user[keyUsername] === 'string'
            ? user[keyFullname] &&
              user[keyFullname].charAt(user[keyFullname].length - 1).toUpperCase()
            : user[keyFullname] && user[keyFullname].charAt(0).toUpperCase()
        }}
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, watch } from 'vue';
// eslint-disable-next-line
const props = defineProps({
  data: {
    type: [Object, Array],
    requried: true,
  },
  size: {
    type: String,
    default: () => 'xs',
    requried: true,
  },
  thumbnail: {
    type: Boolean,
    default: () => false,
  },
  keyAvatar: {
    type: String,
    default: () => 'avatar',
    requried: true,
  },
  keyUsername: {
    type: String,
    default: () => 'username',
    requried: true,
  },
  keyFullname: {
    type: String,
    default: () => 'fullname',
    requried: true,
  },
});

const isGroup = ref(false);
const user = ref({});
const users = ref([]);

const { BASE_URL } = process.env;

const fs = {
  xxxs: 'fs-10',
  xxs: 'fs-12',
  xs: 'fs-16',
  sm: 'fs-20',
  md: 'fs-24',
  lg: 'fs-36',
  xl: 'fs-48',
};

watch(
  () => props.data,
  (val) => {
    const data = JSON.parse(JSON.stringify(val));
    if (Array.isArray(data)) {
      isGroup.value = true;
      if (data.length < 6) users.value = data;
      else {
        const collapse_users_object = {};
        collapse_users_object.collapse = true;
        collapse_users_object[props.keyUsername] = '···';
        collapse_users_object[props.keyFullname] = data
          .slice(4)
          .map((item) => {
            return item[props.keyFullname];
          })
          .toString();
        users.value = [...data.slice(0, 4), ...[collapse_users_object]];
      }
    } else {
      isGroup.value = false;
      user.value = data;
    }
  },
  { immediate: true, deep: true },
);
</script>
