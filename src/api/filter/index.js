import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getFilters = (params) => {
  return axios.get('/cor/filter/list' + generateApiQuery(params));
};

export const createFilter = (data) => {
  return axios.post('/cor/filter/create', data);
};

export const updateFilter = (data) => {
  return axios.post('/cor/filter/update', data);
};
