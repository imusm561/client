import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getJobs = () => {
  return axios.get('/cor/job/list');
};

export const createJob = (data) => {
  return axios.post('/cor/job/create', data);
};

export const updateJob = (data) => {
  return axios.post('/cor/job/update', data);
};

export const getJobDetail = (params) => {
  return axios.get('/cor/job/detail' + generateApiQuery(params));
};

export const getJobLog = (params) => {
  return axios.get('/cor/job/log' + generateApiQuery(params));
};

export const executeJob = (data) => {
  return axios.post('/cor/job/execute', data);
};
