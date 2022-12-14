import axios from '@utils/axios';

export const getForms = () => {
  return axios.get('/cor/form/list');
};

export const createForm = (data) => {
  return axios.post('/cor/form/create', data);
};

export const updateForm = (data) => {
  return axios.post('/cor/form/update', data);
};

export const dropForm = (data) => {
  return axios.post('/cor/form/drop', data);
};

export const backupForm = (data) => {
  return axios.post('/cor/form/backup', data);
};

export const truncateForm = (data) => {
  return axios.post('/cor/form/truncate', data);
};
