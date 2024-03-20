import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getCodeDirs = (params) => {
  return axios.get('/cor/code/dirs' + generateApiQuery(params));
};

export const getCodeData = (params) => {
  return axios.get('/cor/code/data' + generateApiQuery(params));
};

export const createCode = (data) => {
  return axios.post('/cor/code/create', data);
};

export const uploadCode = (data) => {
  return axios.post('/cor/code/upload', data);
};

export const installPackage = (data) => {
  return axios.post('/cor/code/install', data);
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

export const dropCode = (data) => {
  return axios.post('/cor/code/drop', data);
};
