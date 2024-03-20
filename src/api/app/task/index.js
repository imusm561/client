import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getTasks = (params) => {
  return axios.get('/cor/app/task/list' + generateApiQuery(params));
};

export const createTask = (data) => {
  return axios.post('/cor/app/task/create', data);
};

export const updateTask = (data) => {
  return axios.post('/cor/app/task/update', data);
};

export const sortTask = (data) => {
  return axios.post('/cor/app/task/sort', data);
};
