import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getFilters = (params) => {
  return axios.get('/cor/custom/filters' + generateApiQuery(params));
};

export const createFilter = (data) => {
  return axios.post('/cor/custom/filter/create', data);
};

export const updateFilter = (data) => {
  return axios.post('/cor/custom/filter/update', data);
};
