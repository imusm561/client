import { listToTree, getUserInfo } from '@utils';
import { setWatermark, removeWatermark } from '@utils/watermark';
import store from '@store';
import app from '../menu/app';
import data from '../menu/data';
export default {
  namespaced: true,
  state: {
    data: {},
    forms: [],
    files: [],
    notices: {},
  },
  getters: {
    menu: (state) => {
      // [vuex] do not mutate vuex store state outside mutation handlers.
      const forms = JSON.parse(JSON.stringify(state.forms));
      return listToTree([...app, ...(forms.length ? [...data, ...forms] : [])]);
    },
    chat_notices: (state) => {
      let chat_notices = JSON.parse(JSON.stringify(state.notices.chat || []));
      chat_notices = chat_notices.map((item) => {
        item.user = getUserInfo(item.username);
        return item;
      });
      return chat_notices;
    },
    mail_notices: (state) => {
      let mail_notices = JSON.parse(JSON.stringify(state.notices.mail || []));
      return mail_notices;
    },
    comment_notices: (state) => {
      let comment_notices = JSON.parse(JSON.stringify(state.notices.comment || []));
      return comment_notices;
    },
    flow_notices: (state) => {
      let flow_notices = JSON.parse(JSON.stringify(state.notices.flow || []));
      return flow_notices;
    },
  },
  mutations: {
    SET_USER(state, value) {
      const moment = window.moment;
      if (store.state.sys.cfg.water_mark && value.id)
        setWatermark(`${value.username} - ${value.fullname}`, moment().format('ll'));
      else removeWatermark();
      state.data = value;
      // window.user = value;
    },
    SET_FORMS(state, value) {
      state.forms = value;
      // window.forms = value;
    },
    SET_NOTICES(state, value) {
      state.notices = value;
      // window.notices = value;
    },
    ADD_NOTICE(state, value) {
      if (value.app == 'chat') {
        const idx = state.notices.chat.findIndex((item) => item.username == value.data.sender);
        if (idx != -1) {
          state.notices.chat[idx].chat_data.unshift(value.data);
        } else {
          state.notices.chat.unshift({
            username: value.data.sender,
            chat_data: [value.data],
          });
        }
      } else if (value.app == 'mail') {
        state.notices.mail.unshift(value.data);
      } else if (value.app == 'comment') {
        state.notices.comment.unshift(value.data);
      } else if (value.app == 'flow') {
        state.notices.flow.unshift(value.data);
      }
      // window.notices = state.notices;
    },
    DEL_NOTICE(state, value) {
      if (value.app == 'chat') {
        const idx = state.notices.chat.findIndex(
          (chat) => chat.username == value.data.user.username,
        );
        if (idx !== -1) {
          if (value.data.id) {
            const index = state.notices.chat[idx].chat_data.findIndex(
              (item) => item.id === value.data.id,
            );
            if (index !== -1) state.notices.chat[idx].chat_data.splice(index, 1);
          } else state.notices.chat.splice(idx, 1);
        }
      } else if (value.app == 'mail') {
        const idx = state.notices.mail.findIndex((mail) => mail.id == value.data.id);
        if (idx !== -1) state.notices.mail.splice(idx, 1);
      } else if (value.app == 'comment') {
        const idx = state.notices.comment.findIndex((comment) => comment.id == value.data.id);
        if (idx !== -1) state.notices.comment.splice(idx, 1);
      } else if (value.app == 'flow') {
        const idx = state.notices.flow.findIndex((flow) => flow.id == value.data.id);
        if (idx !== -1) state.notices.flow.splice(idx, 1);
      }
      // window.notices = state.notices;
    },
  },
  actions: {},
};
