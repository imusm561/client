import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);
moment.locale(['en-us', 'zh-cn']);

export default moment;
