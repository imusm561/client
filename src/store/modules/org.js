export default {
  namespaced: true,
  state: {
    depts: [],
    roles: [],
    users: [],
    leader: { username: '@leader', fullname: '@leader' },
    onlines: [],
  },
  getters: {},
  mutations: {
    SET_DEPTS(state, value) {
      state.depts = value;
      window.depts = value;
    },
    SET_ROLES(state, value) {
      state.roles = value;
      window.roles = value;
    },
    SET_USERS(state, value) {
      state.users = value;
      window.users = value;
    },
    SET_ONLINES(state, value) {
      state.onlines = value;
      window.onlines = value;
    },
  },
  actions: {},
};
