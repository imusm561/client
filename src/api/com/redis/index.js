import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getKeys = () => {
  return axios.get('/cor/com/redis/keys');
};

export const getKey = (params) => {
  return axios.get('/cor/com/redis/key' + generateApiQuery(params));
};

export const delKey = (data) => {
  return axios.post('/cor/com/redis/del', data);
};
