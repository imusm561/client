import axios from '@utils/axios';

export const query = (data) => {
  return axios.post('/cor/com/sql/query', data);
};
