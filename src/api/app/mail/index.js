import axios from '@utils/axios';

export const getMails = () => {
  return axios.get('/cor/app/mail/list');
};

export const createMail = (data) => {
  return axios.post('/cor/app/mail/create', data);
};

export const updateMail = (data) => {
  return axios.post('/cor/app/mail/update', data);
};
