import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const uploadFavicon = (data) => {
  return axios.post('/cor/sys/favicon/upload', data);
};

export const uploadLogo = (data) => {
  return axios.post('/cor/sys/logo/upload', data);
};

export const getSysInfo = () => {
  return axios.get('/cor/sys/info');
};

export const getSysUrl = () => {
  return axios.get('/cor/sys/url');
};

export const getSysLog = (params) => {
  return axios.get('/cor/sys/log' + generateApiQuery(params));
};
