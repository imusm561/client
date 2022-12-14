import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getCodeDirs = (params) => {
  return axios.get('/cor/code/dirs' + generateApiQuery(params));
};

export const getCodeData = (params) => {
  return axios.get('/cor/code/data' + generateApiQuery(params));
};

export const createCode = (data) => {
  return axios.post('/cor/code/create', data);
};

export const deleteCode = (data) => {
  return axios.post('/cor/code/delete', data);
};

export const renameCode = (data) => {
  return axios.post('/cor/code/rename', data);
};

export const saveCode = (data) => {
  return axios.post('/cor/code/save', data);
};
