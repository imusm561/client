import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getComments = (params) => {
  return axios.get('/cor/com/comment/list' + generateApiQuery(params));
};

export const createComment = (data) => {
  return axios.post('/cor/com/comment/create', data);
};

export const updateComment = (data) => {
  return axios.post('/cor/com/comment/update', data);
};
