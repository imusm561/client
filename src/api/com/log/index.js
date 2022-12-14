import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getLogs = (params) => {
  return axios.get('/cor/com/log/list' + generateApiQuery(params));
};
