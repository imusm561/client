import io from 'socket.io-client';
import { watch } from 'vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';

import { clearUserData, getUserInfo, replaceHtml, decryptData, parseMessage } from '@utils';

import router from '@router';
import store from '@store';

import { getSysInfo } from '@api/sys';
import { getUserData } from '@api/user';

const { BASE_URL } = process.env;

export let socket = {};

const toast = useToast();

export const initSocket = () => {
  socket = io(store.state.sys.cfg.origin, {
    path: `${BASE_URL}socket.io`,
    transports: ['websocket'],
    secure: true,
  });

  socket.on('connect', () => {
    delete socket._disconnected;
    watch(
      () => store.state.user.data.username,
      (newVal, oldVal) => {
        if (router.currentRoute.value.name != 'pubForm') {
          if (newVal && oldVal === undefined) socket.emit('login', { username: newVal });
          if (newVal === undefined && oldVal) socket.emit('logout', { username: oldVal });
        }
      },
      { immediate: true },
    );
  });

  socket.on('forcedLogout', async () => {
    // Clean user information
    clearUserData();
    if (router.currentRoute.value?.meta?.auth) {
      // Redirect to login page
      router.replace({ name: 'login', query: { redirect: router.currentRoute.value.path } });
    }
  });

  socket.on('online', async (username) => {
    const onlines = JSON.parse(JSON.stringify(store.state.org.onlines));
    const idx = onlines.findIndex((item) => item === username);
    if (idx === -1) onlines.push(username);
    store.commit('org/SET_ONLINES', onlines);
  });

  socket.on('offline', async (username) => {
    const onlines = JSON.parse(JSON.stringify(store.state.org.onlines));
    const idx = onlines.findIndex((item) => item === username);
    if (idx !== -1) onlines.splice(idx, 1);
    store.commit('org/SET_ONLINES', onlines);
  });

  socket.on('addChatNotify', (chat) => {
    // if (router.currentRoute.value.name !== 'chat') { }
    const user = getUserInfo(chat.sender);
    if (user) {
      store.dispatch('user/addNotice', {
        app: 'chat',
        data: chat,
      });
      if (store.state.user.data?.config?.chatNotify)
        toast({
          component: ToastificationContent,
          props: {
            user: user,
            text:
              chat.type === 'file'
                ? JSON.parse(decryptData(chat.message))?.name
                : parseMessage(decryptData(chat.message)),
            to: { name: 'chat', query: { contact: user.username } },
          },
        });
    }
  });

  socket.on('delChatNotify', (chat) => {
    store.dispatch('user/delNotice', {
      app: 'chat',
      data: { user: { username: chat.sender }, id: chat.id },
    });
  });

  socket.on('addMailNotify', (mail) => {
    const user = getUserInfo(mail.created_by);
    if (user) {
      store.dispatch('user/addNotice', {
        app: 'mail',
        data: mail,
      });
      if (store.state.user.data?.config?.mailNotify)
        toast({
          component: ToastificationContent,
          props: {
            user: user,
            title: mail.subject,
            text: replaceHtml(mail.content),
            to: { name: 'mail', query: { id: mail.id } },
          },
        });
    }
  });

  socket.on('delMailNotify', (mail) => {
    store.dispatch('user/delNotice', {
      app: 'mail',
      data: mail,
    });
  });

  socket.on('addCommentNotify', (comment) => {
    const user = getUserInfo(comment.created_by);
    if (user) {
      store.dispatch('user/addNotice', {
        app: 'comment',
        data: comment,
      });
      if (store.state.user.data?.config?.commentNotify) {
        toast({
          component: ToastificationContent,
          props: {
            user: user,
            text: replaceHtml(comment.content),
            to: { path: comment.source, query: { tab: 'comment', id: comment.id } },
          },
        });
      }
    }
  });

  socket.on('delCommentNotify', (comment) => {
    store.dispatch('user/delNotice', {
      app: 'comment',
      data: comment,
    });
  });

  socket.on('addFlowNotify', (flow) => {
    const user = getUserInfo(flow.updated_by || flow.created_by);
    if (user) {
      store.dispatch('user/addNotice', {
        app: 'flow',
        data: flow,
      });
      toast({
        component: ToastificationContent,
        props: {
          user: user,
          text: flow.title,
          to: { path: `/data/view/${flow.tid}/${flow.rid}` },
        },
      });
    }
  });

  socket.on('delFlowNotify', (flow) => {
    store.dispatch('user/delNotice', {
      app: 'flow',
      data: flow,
    });
  });

  socket.on('endFlowNotify', (flow) => {
    const user = getUserInfo(flow.updated_by);
    if (user) {
      toast({
        component: ToastificationContent,
        props: {
          user: user,
          text: `${flow.title} ${flow.status === 1 ? 'Approved' : 'Rejected'}`,
          to: { path: `/data/view/${flow.tid}/${flow.rid}` },
        },
      });
    }
  });

  socket.on('refetchSysInfo', () => {
    getSysInfo().then(({ code, data }) => {
      if (code === 200) store.dispatch('sys/updateSysInfo', data);
    });
  });

  socket.on('refetchUserData', (data = {}) => {
    if (data.dept || data.role || data.id) {
      if (
        store.state.user.data.id === data.id ||
        store.state.user.data.dept === data.dept ||
        store.state.user.data.role.includes(data.role)
      )
        getUserData();
    } else {
      getUserData();
    }
  });

  socket.on('disconnect', () => {
    socket._disconnected = true;
  });
};
