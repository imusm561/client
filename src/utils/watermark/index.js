import { Watermark } from 'watermark-js-plus';
import dayjs from '@utils/dayjs';

let watermark;

export const createWatermark = (userinfo) => {
  watermark?.destroy();
  watermark = new Watermark({
    width:
      document.documentElement.clientWidth / Math.ceil(document.documentElement.clientWidth / 360),
    height:
      document.documentElement.clientHeight /
      Math.ceil(document.documentElement.clientHeight / 180),
    rotate: 36,
    contentType: 'rich-text',
    content: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        color: gray;
        font-size: 14px;
        opacity: 0.5;
      ">
        <span>${userinfo.fullname}</span>
        <span>${userinfo.username}</span>
        <span>${dayjs().format('ll')}</span>
      </div>`,
  });
  watermark.create();
};

export const destroyWatermark = () => {
  watermark?.destroy();
};
