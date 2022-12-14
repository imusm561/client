import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getEvents = (params) => {
  return axios.get('/cor/app/calendar/list' + generateApiQuery(params));
};

export const createEvent = (data) => {
  return axios.post('/cor/app/calendar/create', data);
};

export const updateEvent = (data) => {
  return axios.post('/cor/app/calendar/update', data);
};
