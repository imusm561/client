import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getCustomFilter = (params) => {
  return axios.get('/cor/custom/filter' + generateApiQuery(params));
};

export const createCustomFilter = (data) => {
  return axios.post('/cor/custom/filter/create', data);
};

export const updateCustomFilter = (data) => {
  return axios.post('/cor/custom/filter/update', data);
};

export const getCustomColumn = (params) => {
  return axios.get('/cor/custom/column' + generateApiQuery(params));
};

export const createCustomColumn = (data) => {
  return axios.post('/cor/custom/column/create', data);
};

export const updateCustomColumn = (data) => {
  return axios.post('/cor/custom/column/update', data);
};

export const getCustomTheme = (params) => {
  return axios.get('/cor/custom/theme' + generateApiQuery(params));
};

export const createCustomTheme = (data) => {
  return axios.post('/cor/custom/theme/create', data);
};

export const updateCustomTheme = (data) => {
  return axios.post('/cor/custom/theme/update', data);
};

export const getCustomPagination = (params) => {
  return axios.get('/cor/custom/pagination' + generateApiQuery(params));
};

export const createCustomPagination = (data) => {
  return axios.post('/cor/custom/pagination/create', data);
};

export const updateCustomPagination = (data) => {
  return axios.post('/cor/custom/pagination/update', data);
};
