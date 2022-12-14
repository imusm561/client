import authentication from './authentication';
import exception from './exception';
import form from './form';
import preview from './preview';
import uploader from './uploader';

export default [
  // Public
  ...authentication,
  ...exception,
  ...form,
  ...preview,
  ...uploader,
];
