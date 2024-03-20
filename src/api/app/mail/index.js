import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getMail = (params) => {
  return axios.get('/cor/app/mail/data' + generateApiQuery(params));
};

export const getMails = (params) => {
  return axios.get('/cor/app/mail/list' + generateApiQuery(params));
};

export const createMail = (data) => {
  return axios.post('/cor/app/mail/create', data);
};

export const updateMail = (data) => {
  return axios.post('/cor/app/mail/update', data);
};
