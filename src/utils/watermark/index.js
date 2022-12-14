export const setWatermark = (userinfo, dateinfo) => {
  removeWatermark();

  const canvas = document.createElement('canvas');
  canvas.width = document.documentElement.clientWidth / Math.ceil(document.documentElement.clientWidth / 400);
  canvas.height = document.documentElement.clientHeight / Math.ceil(document.documentElement.clientHeight / 200);

  const ctx = canvas.getContext('2d');
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.font = '14px Vedana';
  ctx.fillStyle = 'gray';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'Middle';
  ctx.fillText(userinfo, canvas.width / 3, canvas.height / 2 + 70);
  ctx.fillText(dateinfo, canvas.width / 3, canvas.height / 2 + 85);

  const div = document.createElement('div');
  div.id = 'water-mark';
  div.style.pointerEvents = 'none';
  div.style.position = 'fixed';
  div.style.top = 0;
  div.style.left = 0;
  div.style.opacity = 0.25;
  div.style.zIndex = 99999999;
  div.style.width = `${document.documentElement.clientWidth}px`;
  div.style.height = `${document.documentElement.clientHeight}px`;
  div.style.background = `url('${canvas.toDataURL('image/png')}') left top repeat`;
  document.body.appendChild(div);
};

export const removeWatermark = () => {
  const watermark = document.getElementById('water-mark');
  if (watermark) document.body.removeChild(watermark);
};
