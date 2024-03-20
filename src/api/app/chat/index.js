import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getChats = () => {
  return axios.get('/cor/app/chat/list');
};

export const getChatData = (params) => {
  return axios.get('/cor/app/chat/data' + generateApiQuery(params));
};

export const sendMsg = (data) => {
  return axios.post('/cor/app/chat/send', data);
};

export const withdrawMsg = (data) => {
  return axios.post('/cor/app/chat/withdraw', data);
};

export const readMsg = (data) => {
  return axios.post('/cor/app/chat/read', data);
};

export const delChat = (data) => {
  return axios.post('/cor/app/chat/del', data);
};
