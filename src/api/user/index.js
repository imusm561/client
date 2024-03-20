import { generateApiQuery, decryptData } from '@utils';
import axios from '@utils/axios';
import store from '@store';

export const userLogin = (data) => {
  return axios.post('/cor/user/login', data);
};

export const userLogout = () => {
  return axios.post('/cor/user/logout');
};

const { BASE_URL } = process.env;

export const getUserData = () => {
  if (sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubtk`)) return new Promise.resolve();
  return axios.get('/cor/user/data').then(({ code, data }) => {
    if (code === 200) {
      const { depts, roles, users, onlines, user, forms, notices } = JSON.parse(decryptData(data));
      // Store received data in vuex for global use
      store.commit('org/SET_DEPTS', depts);
      store.commit('org/SET_ROLES', roles);
      store.commit('org/SET_USERS', users);
      store.commit('org/SET_ONLINES', onlines);
      store.dispatch('user/setUser', user);
      store.commit('user/SET_FORMS', forms);
      store.commit('user/SET_NOTICES', notices);
    }
  });
};

export const getUserLogs = (params) => {
  return axios.get('/cor/user/logs' + generateApiQuery(params));
};

export const getUserFiles = (params) => {
  return axios.get('/cor/user/files' + generateApiQuery(params));
};

export const resetPassword = (data) => {
  return axios.post('/cor/user/password/reset', data);
};

export const getUserList = (params) => {
  return axios.get('/cor/user/list' + generateApiQuery(params));
};

export const uploadAvatar = (data) => {
  return axios.post('/cor/user/avatar/upload', data);
};

export const changePassword = (data) => {
  return axios.post('/cor/user/password/change', data);
};

export const updateUser = (data) => {
  return axios.post('/cor/user/update', data);
};

export const createUser = (data) => {
  return axios.post('/cor/user/create', data);
};

export const getUserHome = () => {
  return axios.get('/cor/user/home');
};
