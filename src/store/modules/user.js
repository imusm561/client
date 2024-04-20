import { listToTree, getUserInfo } from '@utils';
import dayjs from '@utils/dayjs';
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
    SET_NOTICE(state, value) {
      state.notices[value.app] = value.data;
      // window.notices = state.notices;
    },
  },
  actions: {
    setUser({ commit }, value) {
      commit('SET_USER', value);
      if (store.state.sys.cfg.waterMark && value.id)
        setWatermark(`${value.username} - ${value.fullname}`, dayjs().format('ll'));
      else removeWatermark();
    },
    addNotice({ commit, state }, value) {
      const val = {
        app: value.app,
        data: JSON.parse(JSON.stringify(state.notices[value.app])),
      };
      if (val.app == 'chat') {
        const idx = val.data.findIndex((item) => item.username == value.data.sender);
        if (idx !== -1) {
          val.data[idx].chat_data.unshift(value.data);
        } else {
          val.data.unshift({
            username: value.data.sender,
            chat_data: [value.data],
          });
        }
      } else {
        val.data.unshift(value.data);
      }
      commit('SET_NOTICE', val);
    },
    delNotice({ commit, state }, value) {
      const val = {
        app: value.app,
        data: JSON.parse(JSON.stringify(state.notices[value.app])),
      };
      if (val.app == 'chat') {
        const idx = val.data.findIndex((item) => item.username == value.data.user.username);
        if (idx !== -1) {
          if (value.data.id) {
            // withdraw
            const index = val.data[idx].chat_data.findIndex((item) => item.id === value.data.id);
            if (index !== -1) val.data[idx].chat_data.splice(index, 1);
          } else val.data.splice(idx, 1);
        }
      } else {
        const idx = val.data.findIndex((item) => item.id == value.data.id);
        if (idx !== -1) val.data.splice(idx, 1);
      }
      commit('SET_NOTICE', val);
    },
  },
};
