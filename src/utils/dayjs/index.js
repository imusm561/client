import dayjs from 'dayjs';
require('dayjs/locale/zh-cn');

var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

// window.dayjs = dayjs;

export default dayjs;
