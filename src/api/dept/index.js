import axios from '@utils/axios';
import store from '@store';

export const getDepts = () => {
  return axios.get('/cor/dept/list').then(({ code, data }) => {
    if (code === 200) {
      store.commit('org/SET_DEPTS', data);
    }
  });
};

export const createDept = (data) => {
  return axios.post('/cor/dept/create', data).then(async () => {
    await getDepts();
  });
};

export const updateDept = (data) => {
  return axios.post('/cor/dept/update', data).then(async () => {
    await getDepts();
  });
};

export const dropDept = (data) => {
  return axios.post('/cor/dept/drop', data);
};
