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

export const getBinds = (params) => {
  return axios.get('/cor/weixin/binds' + generateApiQuery(params));
};

export const unbindUser = (data) => {
  return axios.post('/cor/weixin/unbind', data);
};

export const getStrategies = (params) => {
  return axios.get('/cor/weixin/strategies' + generateApiQuery(params));
};

export const createStrategy = (data) => {
  return axios.post('/cor/weixin/strategy/create', data);
};

export const updateStrategy = (data) => {
  return axios.post('/cor/weixin/strategy/update', data);
};

export const refreshAccount = (data) => {
  return axios.post('/cor/weixin/refresh', data);
};

export const getAuthUrl = (params) => {
  return axios.get('/cor/weixin/auth/url' + generateApiQuery(params));
};
