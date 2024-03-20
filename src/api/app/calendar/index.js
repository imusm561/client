import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getEvents = (params) => {
  return axios.get('/cor/app/calendar/list' + generateApiQuery(params));
};

export const createEvent = (data) => {
  return axios.post('/cor/app/calendar/create', data);
};

export const updateEvent = (data) => {
  return axios.post('/cor/app/calendar/update', data);
};
