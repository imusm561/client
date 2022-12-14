import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getColumns = (params) => {
  return axios.get('/cor/column/list' + generateApiQuery(params));
};

export const createColumns = (data) => {
  return axios.post('/cor/column/create', data);
};

export const updateColumns = (data) => {
  return axios.post('/cor/column/update', data);
};
