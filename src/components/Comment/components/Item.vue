<template>
  <div class="d-flex p-2 shadow border mt-1" :id="`comment_${comment.id}`">
    <Avatar :data="getUserInfo(comment.created_by)" />
    <div class="flex-grow-1 ms-1">
      <div class="fw-medium fs-10">
        {{ getUserInfo(comment.created_by).fullname }}
        <i
          v-if="comment.created_by != $store.state.user.data.username"
          class="mdi mdi-chat-processing-outline text-muted cursor-pointer"
          @click="$router.push({ name: 'chat', query: { contact: comment.created_by } })"
        />
      </div>
      <small class="text-muted">
        {{ dayjs(comment.created_at).format('llll') }}
        <span class="badge bg-soft-info text-info align-middle ms-2">
          {{ dayjs(comment.created_at).fromNow() }}
        </span>
      </small>
      <div class="ck ck-content mt-2 mb-2" v-html="comment.content"></div>
      <a
        v-if="$store.state.user.data.username != comment.created_by"
        class="me-2 badge badge-soft-primary cursor-pointer"
        @click="handleReplyComment(comment)"
      >
        <i class="mdi mdi-reply"></i>
        {{ $t('component.comment.reply') }}
      </a>
      <a
        v-if="!comment.children && $store.state.user.data.username === comment.created_by"
        class="me-2 badge badge-soft-danger cursor-pointer"
        @click="handleDeleteComment(comment)"
      >
        <i class="mdi mdi-delete"></i>
        {{ $t('component.comment.delete') }}
      </a>
      <Item
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        @reply="
          ($event) => {
            handleReplyComment($event);
          }
        "
        @delete="
          ($event) => {
            handleDeleteComment($event);
          }
        "
      />
    </div>
  </div>
</template>

<script setup>
import { getUserInfo } from '@utils';
import dayjs from '@utils/dayjs';
import Avatar from '@components/Avatar';
// eslint-disable-next-line
defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
// eslint-disable-next-line
const emits = defineEmits(['reply', 'delete']);
const handleReplyComment = (comment) => {
  emits('reply', comment);
};
const handleDeleteComment = (comment) => {
  emits('delete', comment);
};
</script>
