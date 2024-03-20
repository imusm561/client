import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const uploadSysFile = (data) => {
  return axios.post('/cor/sys/upload', data);
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
