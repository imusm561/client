import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getDataForm = (params) => {
  return axios.get('/cor/data/form' + generateApiQuery(params));
};

export const getDataList = (data) => {
  return axios.post('/cor/data/list', data);
};

export const getDataSets = (params) => {
  return axios.get('/cor/data/sets' + generateApiQuery(params));
};

export const getDataTemplate = (params) => {
  return axios({
    method: 'get',
    url: '/cor/data/template' + generateApiQuery(params),
    responseType: 'blob',
  });
};

export const importData = (data) => {
  return axios.post('/cor/data/import', data);
};

export const getDataView = (params) => {
  return axios.get('/cor/data/view' + generateApiQuery(params));
};

export const getDataEdit = (params) => {
  return axios.get('/cor/data/edit' + generateApiQuery(params));
};

export const getDataTitle = (params) => {
  return axios.get('/cor/data/title' + generateApiQuery(params));
};

export const getDataDefault = (params) => {
  return axios.get('/cor/data/default' + generateApiQuery(params));
};

export const getDataSource = (params) => {
  return axios.get('/cor/data/source' + generateApiQuery(params));
};

export const getDataValue = (params) => {
  return axios.get('/cor/data/value' + generateApiQuery(params));
};

export const createData = (data) => {
  return axios.post('/cor/data/create', data);
};

export const updateData = (data) => {
  return axios.post('/cor/data/update', data);
};

export const updateFlow = (data) => {
  return axios.post('/cor/data/flow', data);
};
