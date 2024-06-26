<template>
  <div class="p-3" id="comment">
    <div v-if="comments.length" data-simplebar style="max-height: 40vh" class="px-3 mx-n3 pb-1">
      <Item
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
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
    <Empty :text="$t('component.comment.empty')" v-else />
    <Form v-slot="{ errors }" @submit="handleCreateComment" :key="comment.key">
      <CKEditor
        v-model="comment.content"
        id="ck_comment"
        :error="{ id: 'ck_comment', error: errors.comment }"
        :class="errors.comment && 'is-invalid'"
      />
      <Field name="comment" v-model="comment.content" rules="required" class="d-none" />
      <span
        v-if="comment.reply && !comment.content"
        style="position: absolute; margin: calc(-30vh + 11px) 0px 0px 9px; z-index: 1"
      >
        <span class="me-1 opacity-50">
          {{
            $t('component.comment.replyTo', {
              user: getUserInfo(comment.reply.created_by).fullname,
            })
          }}
        </span>
        <i class="mdi mdi-close-circle text-danger cursor-pointer" @click="comment.reply = null" />
      </span>
      <span class="invalid-feedback">{{ $te(errors.comment) }}</span>
      <div class="mt-2 mb-2 float-end">
        <button type="submit" :disabled="Object.keys(errors).length" class="btn btn-primary">
          {{ comment.reply ? $t('component.comment.reply') : $t('component.comment.submit') }}
        </button>
      </div>
    </Form>

    <button
      id="showDeleteCommentModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#deleteCommentModal"
    />
    <div
      class="modal fade"
      id="deleteCommentModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{ $t('component.comment.deleteCommentModal.title', { id: current_comment.id }) }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('component.comment.deleteCommentModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                id="hideDeleteCommentModalBtn"
                data-bs-dismiss="modal"
              >
                {{ $t('component.comment.deleteCommentModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleUpdateComment">
                {{ $t('component.comment.deleteCommentModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { nanoid } from 'nanoid';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { listToTree, getUserInfo } from '@utils';
import { socket } from '@utils/socket';
import store from '@store';
import Empty from '@components/Empty';
import CKEditor from '@components/CKEditor';
import Item from './components/Item';
import { getComments, createComment, updateComment } from '@api/com/comment';
// eslint-disable-next-line
const props = defineProps({
  source: {
    type: String,
    default: () => '',
    requried: true,
  },
  data: {
    type: Object,
    default: () => {},
    requried: false,
  },
});
// eslint-disable-next-line
const emits = defineEmits(['fetch']);

const route = useRoute();
const toast = useToast();
const comments = ref([]);

const fetchComments = (callback) => {
  getComments({ source: props.source }).then(({ code, data, msg }) => {
    if (code === 200) {
      data.forEach((comment) => {
        if (store.state.user.notices?.comment?.findIndex((item) => item.id == comment.id) !== -1) {
          store.dispatch('user/delNotice', {
            app: 'comment',
            data: comment,
          });
          updateComment({
            id: comment.id,
            read: true,
          }).then(({ code, msg }) => {
            if (code !== 200) {
              toast({
                component: ToastificationContent,
                props: {
                  variant: 'danger',
                  icon: 'mdi-alert',
                  text: msg,
                },
              });
            }
          });
        }
      });
      comments.value = listToTree(data);
      emits('fetch', data);
      callback && callback();
    } else {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: msg,
        },
      });
    }
  });
};

const scrollToComment = ({ id }) => {
  setTimeout(() => {
    document.documentElement.scrollTop = document.documentElement.offsetHeight;
    const el = document.getElementById(`comment_${id}`);
    if (el && document.getElementById('comment')) {
      const commentList = document
        .getElementById('comment')
        ?.querySelector('.simplebar-content-wrapper');
      if (commentList)
        commentList.scrollTo({
          top: el.offsetTop,
          behavior: 'smooth',
        });
    }
  }, 500);
};

const refetchCommentsHandler = () => {
  fetchComments();
};

onMounted(() => {
  fetchComments();
  socket.on('refetchComments', refetchCommentsHandler);
});

onUnmounted(() => {
  socket.off('refetchComments', refetchCommentsHandler);
});

watch(
  () => route.query.id,
  (id) => {
    if (id) scrollToComment({ id });
  },
  { immediate: true },
);

const comment = reactive({
  key: nanoid(),
  content: '',
  reply: null,
});

const handleReplyComment = (e) => {
  comment.reply = e;
};

const handleCreateComment = () => {
  createComment({
    source: props.source,
    content: comment.content,
    pid: comment.reply ? comment.reply.id : 0,
    to: comment.reply
      ? comment.reply.created_by
      : props.data?.created_by && store.state.user.data.username != props.data?.created_by
      ? props.data.created_by
      : null,
    read: false,
  }).then(({ code, data, msg }) => {
    if (code === 200) {
      fetchComments(() => {
        scrollToComment(data);
        Object.assign(comment, {
          key: nanoid(),
          content: '',
          reply: null,
        });
      });
    } else {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: msg,
        },
      });
    }
  });
};

const current_comment = reactive({});

const handleDeleteComment = (e) => {
  Object.assign(current_comment, e);
  document.getElementById('showDeleteCommentModalBtn').click();
};

const handleUpdateComment = () => {
  updateComment({
    id: current_comment.id,
    data_state: 'deleted',
  }).then(({ code, msg }) => {
    if (code === 200) {
      fetchComments();
      document.getElementById('hideDeleteCommentModalBtn').click();
    } else {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: msg,
        },
      });
    }
  });
};
</script>
