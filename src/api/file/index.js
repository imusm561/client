import axios from '@utils/axios';

export const getFileInfo = (params) => {
  return axios.get(`/cor/file/info/${params.uuid}`);
};

export const mergeFile = (data) => {
  return axios.post('/cor/file/merge', data);
};

export const addUpload = (data) => {
  return axios.post('/cor/file/add', data);
};

export const initUploader = (data) => {
  return axios.post('/cor/file/init-uploader', data);
};

export const change = (data) => {
  return axios.post('/cor/file/change', data);
};
