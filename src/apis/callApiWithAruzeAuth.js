import axios from 'axios';
import { msalInstance } from '../index';
import { loginRequest } from './../azure/authConfig';
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_UAT,
});

const getAccessToken = async () => {
  const account = msalInstance.getAllAccounts()[0];
  const accessTokenRequest = {
    ...loginRequest,
    account,
  };
  const token = await msalInstance
    .acquireTokenSilent(accessTokenRequest)
    .then((res) => res);
  return token.accessToken;
};
const accessTokenHoc = (previousAPI) => {
  const innerAccessToken = async () => {
    const account = msalInstance.getAllAccounts()[0];
    const accessTokenRequest = {
      ...loginRequest,
      account,
    };
    msalInstance
      .acquireTokenSilent(accessTokenRequest)
      .then((accessTokenResponse) => {
        let accessToken = accessTokenResponse.accessToken;
        previousAPI.headers.Authorization = `Bearer ${accessToken}`;
        return instance.request(previousAPI);
      });
  };
  return innerAccessToken;
};
instance.interceptors.request.use(
  async function (config) {
    const token = await getAccessToken();

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
