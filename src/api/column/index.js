import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getColumns = (params) => {
  return axios.get('/cor/column/list' + generateApiQuery(params));
};

// export const createColumns = (data) => {
//   return axios.post('/cor/column/create', data);
// };

// export const updateColumns = (data) => {
//   return axios.post('/cor/column/update', data);
// };

export const syncColumns = (data) => {
  return axios.post('/cor/column/sync', data);
};
