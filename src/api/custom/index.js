import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getCustomFilters = (params) => {
  return axios.get('/cor/custom/filters' + generateApiQuery(params));
};

export const createCustomFilter = (data) => {
  return axios.post('/cor/custom/filter/create', data);
};

export const updateCustomFilter = (data) => {
  return axios.post('/cor/custom/filter/update', data);
};

export const getCustomColumns = (params) => {
  return axios.get('/cor/custom/columns' + generateApiQuery(params));
};

export const createCustomColumns = (data) => {
  return axios.post('/cor/custom/columns/create', data);
};

export const updateCustomColumns = (data) => {
  return axios.post('/cor/custom/columns/update', data);
};
