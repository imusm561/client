import { watch } from 'vue';
import store from '@store';
import i18n from '@utils/i18n';
import { clearUserData, getUserInfo, replaceHtml, decryptData } from '@utils';
import { getUserData } from '@api/user';
import router from '@router';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { ElLoading } from 'element-plus';
import 'element-plus/es/components/loading/style/css';
const loading = { instance: null, count: 0, interval: null };
const initSocket = (socket) => {
  const toast = useToast();
  let connection = -1;
  socket.on('connect', () => {
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
    if (loading.instance) {
      loading.instance.close();
      loading.instance = null;
      clearInterval(loading.interval);
      loading.interval = null;
      loading.count = 0;
    }
    if (connection === 0) {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'success',
          icon: 'mdi-lan-connect',
          title: i18n.global.t('socket.connected.toast.title'),
          text: i18n.global.t('socket.connected.toast.text'),
        },
      });
    }
    connection = 1;
  });

  socket.on('forcedLogout', async () => {
    if (router.currentRoute.value?.meta?.auth) {
      // Clean user information
      await clearUserData();
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
      store.commit('user/ADD_NOTICE', {
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
                : decryptData(chat.message),
            to: { name: 'chat', query: { contact: user.username } },
          },
        });
    }
  });

  socket.on('delChatNotify', (chat) => {
    store.commit('user/DEL_NOTICE', {
      app: 'chat',
      data: { user: { username: chat.sender }, id: chat.id },
    });
  });

  socket.on('addMailNotify', (mail) => {
    const user = getUserInfo(mail.created_by);
    if (user) {
      store.commit('user/ADD_NOTICE', {
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
    store.commit('user/DEL_NOTICE', {
      app: 'mail',
      data: mail,
    });
  });

  socket.on('addCommentNotify', (comment) => {
    const user = getUserInfo(comment.created_by);
    if (user) {
      store.commit('user/ADD_NOTICE', {
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
    store.commit('user/DEL_NOTICE', {
      app: 'comment',
      data: comment,
    });
  });

  socket.on('addFlowNotify', (flow) => {
    const user = getUserInfo(flow.updated_by || flow.created_by);
    if (user) {
      store.commit('user/ADD_NOTICE', {
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
    store.commit('user/DEL_NOTICE', {
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
    connection = 0;
    loading.instance = ElLoading.service({
      lock: true,
      customClass: 'el-loading',
      text: i18n.global.t('socket.disconnect.loading'),
      background: 'rgba(0, 0, 0, 0.7)',
    });
    loading.count = 0;
    loading.interval = setInterval(() => {
      loading.count += 1;
      loading.instance.text.value = `${i18n.global.t('socket.disconnect.loading')}${loading.count}`;
    }, 1000);
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-lan-disconnect',
        title: i18n.global.t('socket.disconnect.toast.title'),
        text: i18n.global.t('socket.disconnect.toast.text'),
      },
    });
  });
};

export default initSocket;
