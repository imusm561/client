const scriptParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
const appid = scriptParams.get('appid');
const scope = scriptParams.get('scope');

const searchParams = new URLSearchParams(window.location.search);
const code = searchParams.get('code');
const state = searchParams.get('state');

const redirect = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  const redirect_uri = encodeURIComponent(url.toString());
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
};

if (appid !== null && scope !== null && (code === null || state === null)) redirect();

const getWeixinUserInfo = (callback) => {
  if (appid !== null && scope !== null && code !== null && state !== null) {
    const apiURL = 'https://www.imusm.cn/lcdp/cor/weixin/auth/web';
    const params = new URLSearchParams();
    params.append('appid', appid);
    params.append('code', code);
    fetch(`${apiURL}?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) callback && callback(data.data);
        else console.log(data), redirect();
      })
      .catch((error) => {
        console.error(error);
        redirect();
      });
  } else redirect();
};

// getWeixinUserInfo((res) => {
//   console.log(res)
// })
