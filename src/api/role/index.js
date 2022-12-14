import axios from '@utils/axios';
import store from '@store';

export const getRoles = () => {
  return axios.get('/cor/role/list').then(({ code, data }) => {
    if (code === 200) {
      store.commit('org/SET_ROLES', data);
    }
  });
};

export const createRole = (data) => {
  return axios.post('/cor/role/create', data).then(async () => {
    await getRoles();
  });
};

export const updateRole = (data) => {
  return axios.post('/cor/role/update', data).then(async () => {
    await getRoles();
  });
};
