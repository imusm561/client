import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getQRCode = (params) => {
  const soid = params.soid;
  delete params.soid;
  return axios.get(`/cor/weixin/${soid}/qrcode` + generateApiQuery(params));
};

export const getAccounts = () => {
  return axios.get('/cor/weixin/list');
};

export const createAccount = (data) => {
  return axios.post('/cor/weixin/create', data);
};

export const updateAccount = (data) => {
  return axios.post('/cor/weixin/update', data);
};

export const getAccountDetail = (params) => {
  return axios.get('/cor/weixin/detail' + generateApiQuery(params));
};

export const getBindUsers = (params) => {
  return axios.get('/cor/weixin/users' + generateApiQuery(params));
};

export const unBindUser = (data) => {
  return axios.post('/cor/weixin/user/unbind', data);
};

export const getReplyScripts = (params) => {
  return axios.get('/cor/weixin/scripts' + generateApiQuery(params));
};

export const createReplyScript = (data) => {
  return axios.post('/cor/weixin/script/create', data);
};

export const updateReplyScript = (data) => {
  return axios.post('/cor/weixin/script/update', data);
};
