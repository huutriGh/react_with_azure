import axios from 'axios';
import { store } from 'redux/store';
import {
  renewStokenStart,
  renewStokenFailure,
  renewStokenSuccess,
} from 'redux/user/user.action';
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

const privateKey =
  'LA6SSF5M2AUN30JCHNYUYQ3XHM444XS0S3X7bdd715e-ba83-47cb-9588-72bbe8f4e8ed';
const encryptTokenKey = 'U2FsdGVkX1/x2yrabCsZDYzIblVg9n9tni0hEp/RnC8=';
const encryptCountKey = 'U2FsdGVkX1+kdchApsjP0O2uOMGQDz1XXoQhY4wmA88=';
const encryptRefreshTokenKey = 'U2FsdGVkX1/ehw1NHGFbEdIyAj08d8VyGYFBheLWPe4=';

export const saveTokenToLocalStorage = (token, refreshToken) => {
  const encryptTokenData = CryptoAES.encrypt(token, privateKey);
  const encryptRefreshTokenData = CryptoAES.encrypt(refreshToken, privateKey);

  localStorage.setItem(encryptTokenKey, encryptTokenData);
  localStorage.setItem(encryptRefreshTokenKey, encryptRefreshTokenData);
};
export const getDataFromLocalStorage = (key) => {
  const storageKey = localStorage.getItem(key);

  if (storageKey) {
    const _ciphertext = CryptoAES.decrypt(storageKey.toString(), privateKey);
    return _ciphertext.toString(CryptoENC);
  }
  return null;
};

let totalTabs = 0;
window.onload = function (e) {
  if (getDataFromLocalStorage(encryptCountKey) === null) {
    totalTabs = 0;
  } else {
    totalTabs = parseInt(getDataFromLocalStorage(encryptCountKey));
  }

  totalTabs++;

  localStorage.setItem(
    encryptCountKey,
    CryptoAES.encrypt(totalTabs.toString(), privateKey)
  );
};

window.onbeforeunload = function (e) {
  if (getDataFromLocalStorage(encryptCountKey) === null) {
    totalTabs = 1;
  } else {
    totalTabs = parseInt(getDataFromLocalStorage(encryptCountKey));
  }
  totalTabs--;
  localStorage.setItem(
    encryptCountKey,
    CryptoAES.encrypt(totalTabs.toString(), privateKey)
  );

  if (totalTabs < 1) {
    localStorage.removeItem(encryptTokenKey);
    localStorage.removeItem(encryptRefreshTokenKey);
    localStorage.removeItem(encryptCountKey);
  }
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_UAT,
});

const accessTokenHoc = (previousAPI) => {
  const innerAccessToken = async () => {
    store.dispatch(renewStokenStart());
    const refreshToken = getDataFromLocalStorage(encryptRefreshTokenKey);
    const token = getDataFromLocalStorage(encryptTokenKey);
    const res = await instance.post(`Auth/RefreshToken`, {
      token,
      refreshToken,
    });

    if (res) {
      if (res.data.token && res.data.refreshToken) {
        store.dispatch(renewStokenSuccess(res.data));
        saveTokenToLocalStorage(res.data.token, res.data.refreshToken);
        previousAPI.headers.Authorization = `Bearer ${token}`;
        return instance.request(previousAPI);
      } else {
        store.dispatch(renewStokenFailure(res.data.errors[0]));
        saveTokenToLocalStorage('', '');
      }
    }
  };
  return innerAccessToken;
};

instance.interceptors.request.use(
  function (config) {
    const token = getDataFromLocalStorage(encryptTokenKey);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(null, function (error) {
  if (
    error.config &&
    error.response?.status === 401 &&
    !error.config.__isRetry
  ) {
    return new Promise((resolve, reject) => {
      const callAccess = accessTokenHoc(error.config);
      callAccess(error.config)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return Promise.reject(error);
});

export default instance;
