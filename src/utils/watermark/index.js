import { Watermark } from 'watermark-js-plus';
import dayjs from '@utils/dayjs';
import store from '@store';

let watermark;

export const createWatermark = (userinfo) => {
  watermark?.destroy();
  watermark = new Watermark({
    parent: '#app',
    width: 320,
    height: 150,
    rotate: 32,
    contentType: 'rich-text',
    content: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        color: ${store.state.sys.theme === 'dark' ? '#fff' : '#000'};
        font-size: 14px;
        opacity: 0.25;
        white-space: nowrap;
      ">
        <span>${userinfo.fullname}</span>
        <span>${userinfo.username}</span>
        <span>${userinfo.post}</span>
        <span>${dayjs().format('ll')}</span>
      </div>`,
  });
  watermark.create();
};

export const destroyWatermark = () => {
  watermark?.destroy();
};
