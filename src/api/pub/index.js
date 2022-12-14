import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getPubs = (params) => {
  return axios.get('/cor/pub/list' + generateApiQuery(params));
};

export const createPub = (data) => {
  return axios.post('/cor/pub/create', data);
};

export const updatePub = (data) => {
  return axios.post('/cor/pub/update', data);
};

export const getPubForm = (params) => {
  return axios.get('/cor/pub/form' + generateApiQuery(params));
};
