import crypto from 'crypto';
import { transform, isEqual } from 'lodash'; // isObject, isArray
import store from '@store';
import { getDataDefault, getDataSource, getDataValue } from '@api/data';
const { BASE_URL } = process.env;

export const isEmpty = (value) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};

export const isMobile = () => {
  const regExp =
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
  return regExp.test(navigator.userAgent);
};

export const generateApiQuery = (params) => {
  let query = '?';
  for (let key in params) {
    query += `${key}=${encodeURIComponent(params[key])}&`;
  }
  return query.substring(0, query.length - 1);
};

export const clearUserData = () => {
  // Remove accessToken from localStorage
  localStorage.removeItem(`${BASE_URL.replace(/\//g, '_')}accessToken`);
  // Remove data from vuex
  store.dispatch('user/setUser', {});
  store.commit('user/SET_FORMS', []);
  store.commit('user/SET_NOTICES', []);
};

export const getUserInfo = (value, key = 'username') => {
  if (key === 'username' && value === '@system') return { username: '@system', fullname: 'System' };
  const userInfo = store.state.org.users.find((user) => user[key] === value);
  return userInfo || { username: value, fullname: value };
};

export const getUserLeaders = (user, leaders = []) => {
  const leader = getUserInfo(user.leader, 'id');
  if (leader) {
    leaders.unshift(leader.username);
    if (leader.id === user.id) {
      return Array.from(new Set(leaders));
    } else {
      leaders.unshift(leader.username);
      return getUserLeaders(leader, leaders);
    }
  } else {
    return leaders;
  }
};

export const listToTree = (list, parent_id = 0) =>
  list
    .filter((item) => item.pid === parent_id)
    .map((item) => {
      const children = listToTree(list, item.id);
      if (children.length) {
        item.children = children;
      }
      return item;
    });

export const getParentsById = (list, id, parents = []) => {
  let parent = list.find((item) => item.id === id);
  if (parent) {
    parents.unshift(parent);
    if (parent.pid === 0) return parents;
    else return getParentsById(list, parent.pid, parents);
  } else return parents;
};

export const getChildrenById = (list, id, children = []) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].pid === id) {
      children.push(list[i]);
      getChildrenById(list, list[i].id, children);
    }
  }
  return children;
};

export const getNodeById = (tree, id) => {
  for (let i in tree) {
    if (tree[i].id == id) {
      return tree[i];
    }
    if (tree[i].children) {
      let node = getNodeById(tree[i].children, id);
      if (node !== undefined) {
        return node;
      }
    }
  }
};

export const getListPath = (path) => {
  let structure = path.split('/');
  if (structure[1] === 'data' && ['view', 'edit'].includes(structure[2])) {
    structure[2] = 'list';
    structure.splice(4, 1);
    return structure.join('/');
  }
  return path;
};

export const randomVariant = () => {
  const variants = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark',
  ];
  return variants[Math.floor(Math.random() * (variants.length - 1))];
};

export const getChanges = (newObj, oldObj) => {
  const changes = (obj1, obj2) => {
    return transform(obj1, (result, value, key) => {
      const val1 = value;
      const val2 = obj2[key];
      if (!isEqual(val1, val2)) {
        result[key] = val1;
        // if (isArray(val1)) result[key] = val1.filter((val) => !val2.includes(val));
        // else if (isObject(val1) && isObject(val2)) result[key] = changes(val1, val2);
        // else result[key] = val1;
      }
    });
  };
  return changes(newObj, oldObj);
};

export const replaceHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]+>|&[^>]+;/g, '').trim();
};

export const size2Str = (size) => {
  if (size < 1024) {
    return size + 'B';
  } else if (size >= 1024 && size < Math.pow(1024, 2)) {
    return parseFloat(size / 1024).toFixed(2) + 'KB';
  } else if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
    return parseFloat(size / Math.pow(1024, 2)).toFixed(2) + 'MB';
  } else if (size > Math.pow(1024, 3)) {
    return parseFloat(size / Math.pow(1024, 3)).toFixed(2) + 'GB';
  } else {
    return 0 + 'B';
  }
};

export const getFileSuffix = (str) => {
  if (!str) return '';
  else
    return str
      .substring(str.lastIndexOf('.') + 1)
      .toLocaleLowerCase()
      .trim();
};

export const hashData = (string) => {
  return crypto.createHash('md5').update(string).digest('hex');
};

export const encryptData = (data, public_key = store.state.sys.public_key) => {
  let hash = crypto.createHash('md5').update(public_key).digest('hex');
  let key = hash.substring(0, 16);
  let iv = hash.substring(hash.length - 16, hash.length);
  let cipherChunks = [];
  let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
  cipherChunks.push(cipher.final('base64'));
  return cipherChunks.join('');
};

export const decryptData = (data, public_key = store.state.sys.public_key) => {
  let hash = crypto.createHash('md5').update(public_key).digest('hex');
  let key = hash.substring(0, 16);
  let iv = hash.substring(hash.length - 16, hash.length);
  let cipherChunks = [];
  let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
  cipherChunks.push(decipher.final('utf8'));
  return cipherChunks.join('');
};

export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) return;
  return await navigator.clipboard.writeText(text);
};

export const pasteFromClipboard = async () => {
  if (!navigator.clipboard) return;
  return await navigator.clipboard.readText();
};

export const base64ToFile = (base64, filename) => {
  let arr = base64.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const isLngLat = (lnglat) => {
  if (!lnglat) return false;
  lnglat = lnglat.toString();
  const lngExp =
    /* eslint-disable-next-line no-useless-escape */
    /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
  const latExp =
    /* eslint-disable-next-line no-useless-escape */
    /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
  let position = lnglat.split(',');
  if (position.length == 2 && lngExp.test(position[0]) && latExp.test(position[1])) return true;
  else return false;
};

export const getChartColorsArray = (colors) => {
  colors = JSON.parse(colors);
  return colors.map((value) => {
    let newValue = value.replace(' ', '');
    if (newValue.indexOf(',') === -1) {
      let color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
      if (color) {
        color = color.replace(' ', '');
        return color;
      } else return newValue;
    } else {
      let val = value.split(',');
      if (val.length == 2) {
        let rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
        rgbaColor = 'rgba(' + rgbaColor + ',' + val[1] + ')';
        return rgbaColor;
      } else {
        return newValue;
      }
    }
  });
};

export const replaceVariables = (expr, alias) => {
  const variables = expr?.match(/\{[A-Za-z]+\}/g);
  if (variables && variables.length) {
    variables.forEach((item) => {
      const variable = item.replace('{', '').replace('}', '');
      expr = expr.replace(
        new RegExp(item, 'g'),
        alias?.[variable]
          ? `data.${alias[variable]}`
          : variable === 'username' || variable === 'fullname'
          ? sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubun`) ||
            store.state.user.data?.[variable] ||
            item
          : store.state.user.data?.[variable] || store.state.sys?.[variable] || item,
      );
    });
  }
  return expr;
};

export const resolveColumnTitle = (column) => {
  let title = column.field;
  if (column.alias) title += `|${column.alias}`;
  if (column.default) title += `|${column.default}`;
  if (column.cfg?.source) title += `|${column.cfg.source}`;
  return title;
};

export const parseExpr2Params = (data, expr) => {
  const params = {};
  const TIDORSCRIPT_RIDORFUNCTION_COLORQUERY = expr.split(':');
  const TIDORSCRIPT_RIDORFUNCTION = TIDORSCRIPT_RIDORFUNCTION_COLORQUERY[0].split('.');
  const TIDORSCRIPT = TIDORSCRIPT_RIDORFUNCTION.shift();
  const RIDORFUNCTION = TIDORSCRIPT_RIDORFUNCTION.join('.');
  const COLORQUERY = TIDORSCRIPT_RIDORFUNCTION_COLORQUERY[1];
  if (Number(TIDORSCRIPT)) {
    // 7 | 7.{ID} | 7:AA_AB | 7.{ID}:AA_AB
    params.tid = TIDORSCRIPT;
    if (RIDORFUNCTION)
      params.rid = RIDORFUNCTION.includes('data.')
        ? data?.[RIDORFUNCTION.replace('data.', '')]
        : RIDORFUNCTION;
    if (COLORQUERY) params.col = COLORQUERY;
  } else {
    // script.function | script.function:{AA},{AB},data.id,foo,bar
    params.script = TIDORSCRIPT;
    params.function = RIDORFUNCTION;
    if (COLORQUERY) {
      COLORQUERY.split(',').forEach((param, index) => {
        if (param.includes('data.'))
          params[`val_${index + 1}`] = data?.[param.replace('data.', '')];
        else params[`val_${index + 1}`] = param;
      });
    }
  }
  return params;
};

export const getDataByFormula = async (
  data,
  expr,
  options = { view: false, value: undefined, search: undefined },
) => {
  const type = Array.isArray(options.value) ? 'Multiple' : 'Single';
  if (options.view) {
    if (expr == '*==userlist') {
      if (type === 'Single') {
        const user = getUserInfo(options.value);
        return user.fullname;
      } else {
        const users = options.value.map((item) => {
          const user = getUserInfo(item);
          return user.fullname;
        });
        return users;
      }
    } else if (expr == '*==deptlist') {
      if (type === 'Single') {
        const dept = store.state.org.depts.find((dept) => dept.id == options.value);
        return dept?.name || options.value;
      } else {
        const depts = options.value.map((item) => {
          const dept = store.state.org.depts.find((dept) => dept.id == item);
          return dept?.name || item;
        });
        return depts;
      }
    } else if (expr == '*==rolelist') {
      if (type === 'Single') {
        const role = store.state.org.roles.find((role) => role.id == options.value);
        return role?.name || options.value;
      } else {
        const roles = options.value.map((item) => {
          const role = store.state.org.roles.find((role) => role.id == item);
          return role?.name || item;
        });
        return roles;
      }
    } else {
      const params = parseExpr2Params(data, expr.replace('*==', ''));
      if (params.tid) {
        params.value = type === 'Single' ? (options.value ? [options.value] : []) : options.value;
        if (params.value.length) {
          const res = await getDataValue(params);
          if (res.code === 200) {
            return params.value.map((v) => {
              const item = res.data.find((item) => item.value == Number(v));
              return item || v;
            });
          } else return options.value;
        }
      } else return options.value;
    }
  } else {
    if (expr.substring(0, 3) == '===') {
      expr = expr.replace('===', '');
      try {
        let fn = new Function('data', 'return ' + expr);
        return fn(data);
      } catch (error) {
        return error.message;
      }
    } else if (expr.substring(0, 3) == '@==') {
      const params = parseExpr2Params(data, expr.replace('@==', ''));
      if (options.search) params.search = options.search;
      const res = await getDataDefault(params);
      if (res.code === 200) return res.data;
      else return `Error: ${res.msg}`;
    } else if (expr.substring(0, 3) == '*==') {
      if (expr == '*==userlist') {
        if (store.state.org.users.length) {
          return store.state.org.users.map((user) => {
            return { text: user.fullname, value: user.username };
          });
        } else if (sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubun`)) {
          return [
            {
              text: sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubun`),
              value: sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubun`),
            },
          ];
        } else {
          return [];
        }
      } else if (expr == '*==deptlist') {
        return store.state.org.depts.map((dept) => {
          return { text: dept.name, value: dept.id };
        });
      } else if (expr == '*==rolelist') {
        return store.state.org.roles.map((role) => {
          return { text: role.name, value: role.id };
        });
      } else {
        const params = parseExpr2Params(data, expr.replace('*==', ''));
        if (options.search) params.search = options.search;
        let existed_options = [];
        if (options.value) {
          if (params.tid) {
            const _params = JSON.parse(JSON.stringify(params));
            _params.value =
              type === 'Single' ? (options.value ? [options.value] : []) : options.value;
            if (_params.value.length) {
              const { data } = await getDataValue(_params);
              existed_options = data;
            }
          } else if (params.script) {
            existed_options =
              type === 'Single'
                ? [{ text: options.value, value: options.value }]
                : options.value.map((item) => {
                    return { text: item, value: item };
                  });
          }
        }
        const res = await getDataSource(params);
        if (res.code === 200) {
          if (typeof res.data === 'object' && Array.isArray(res.data))
            return [
              ...res.data,
              ...existed_options.filter(
                (item) =>
                  !res.data
                    .map((i) => {
                      return i.value;
                    })
                    .includes(item.value),
              ),
            ];
          else
            return [{ text: `Error: expected array, got ${typeof res.data}.`, value: 'Error: ' }];
        } else return [{ text: res.msg, value: 'Error: ' }];
      }
    } else {
      return expr;
    }
  }
};

export const getRulesByFormula = (data, column) => {
  const res = {
    visible: true,
    required: false,
    editable: true,
  };
  for (let key in res) {
    if (column[key]) {
      try {
        let fn = new Function('data', 'return ' + column[key]);
        res[key] = !!fn(data);
      } catch (error) {
        res[key] = !res[key];
      }
    }
  }
  return res;
};

export const generateFlowByCurrentUser = (flow) => {
  if (flow && flow.length) {
    const temp_flow = JSON.parse(JSON.stringify(flow));
    // generate leader
    for (let index = 0; index < temp_flow.length; index++) {
      for (let idx = 0; idx < temp_flow[index].users.length; idx++) {
        if (temp_flow[index].users[idx] === store.state.org.leader.username) {
          temp_flow[index].users.splice(idx, 1);
          const leaders = store.state.org.users
            .filter((user) =>
              index === 0
                ? user.id === store.state.user.data.leader
                : store.state.org.users
                    .filter((user) => temp_flow[index - 1].users.includes(user.username))
                    .map((user) => {
                      return user.leader;
                    })
                    .includes(user.id),
            )
            .map((user) => {
              return user.username;
            });
          temp_flow[index].users = Array.from(new Set([...temp_flow[index].users, ...leaders]));
        }
      }
      // skip current user
      if (
        (temp_flow[index].logic === 0 ||
          (temp_flow[index].logic === 1 && temp_flow[index].users.length === 1)) &&
        temp_flow[index].users.includes(store.state.user.data.username)
      )
        temp_flow[index].skip = true;
      const current_user_index = temp_flow[index].users.findIndex(
        (username) => username === store.state.user.data.username,
      );
      if (current_user_index != -1) temp_flow[index].users.splice(current_user_index, 1);
    }

    // delete duplicate flow
    for (let index = 0; index < temp_flow.length; index++) {
      for (let idx = 0; idx < temp_flow[index].users.length; idx++) {
        const count = temp_flow.filter((item) =>
          item.users.includes(temp_flow[index].users[idx]),
        ).length;
        if (count > 1) temp_flow[index].users.splice(idx, 1);
      }
    }

    // generate form
    for (let index = 0; index < temp_flow.length; index++) {
      for (let idx = 0; idx < temp_flow[index].users.length; idx++) {
        temp_flow[index].users[idx] = {
          username: temp_flow[index].users[idx],
          pass: undefined,
          comment: undefined,
        };
      }
    }

    return temp_flow
      .slice(
        temp_flow
          .map((item) => {
            return item.skip;
          })
          .lastIndexOf(true) + 1,
      )
      .filter((item) => item.users.length);
  } else {
    return [];
  }
};

export const debounce = (fn, delay) => {
  let timer = null;
  return (...param) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...param);
    }, delay);
  };
};

export const throttle = (fn, delay) => {
  let timer = null;
  return (...params) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...params);
        timer = null;
      }, delay);
    }
  };
};
