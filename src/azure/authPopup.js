import * as msal from '@azure/msal-browser';
import apiConfig from './apiConfig';
import msalConfig, { loginRequest, tokenRequest } from './authConfig';
import b2cPolicies from './policies';
// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let accountId = '';

function setAccount(account) {
  accountId = account.homeAccountId;
}

export function selectAccount() {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = myMSALObj.getAllAccounts();

  if (currentAccounts.length < 1) {
    return;
  } else if (currentAccounts.length > 1) {
    /**
     * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
     * is cached as a new account, which results in more than one account in the cache. Here we make
     * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow,
     * as this is the default flow the user initially signed-in with.
     */
    const accounts = currentAccounts.filter(
      (account) =>
        account.homeAccountId
          .toUpperCase()
          .includes(b2cPolicies.names.signUpSignIn.toUpperCase()) &&
        account.idTokenClaims.iss
          .toUpperCase()
          .includes(b2cPolicies.authorityDomain.toUpperCase()) &&
        account.idTokenClaims.aud === msalConfig.auth.clientId
    );

    if (accounts.length > 1) {
      // localAccountId identifies the entity for which the token asserts information.
      if (
        accounts.every(
          (account) => account.localAccountId === accounts[0].localAccountId
        )
      ) {
        // All accounts belong to the same user
        return accounts[0];
      } else {
        // Multiple users detected. Logout all to be safe.
        signOut();
      }
    } else if (accounts.length === 1) {
      return accounts[0];
    }
  } else if (currentAccounts.length === 1) {
    return currentAccounts[0];
  }
}

// in case of page refresh
selectAccount();

export function handleResponse(response) {
  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  //console.log(response);
  if (response !== null) {
    setAccount(response.account);
  } else {
    selectAccount();
  }
  return response;
}

export function signIn() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */
  return myMSALObj
    .loginPopup(loginRequest)
    .then((response) => {
      handleResponse(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function signOut() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  const logoutRequest = {
    postLogoutRedirectUri: msalConfig.auth.redirectUri,
    mainWindowRedirectUri: msalConfig.auth.redirectUri,
  };

  myMSALObj.logoutPopup(logoutRequest);
}

export async function getTokenPopup(request) {
  /**
   * See here for more information on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  console.log('accountId: ', accountId);
  request.account = myMSALObj.getAccountByHomeId(accountId);

  /**
   *
   */
  try {
    const response = await myMSALObj.acquireTokenSilent(request);
    // In case the response from B2C server has an empty accessToken field
    // throw an error to initiate token acquisition
    if (!response.accessToken || response.accessToken === '') {
      throw new msal.InteractionRequiredAuthError();
    }
    return response;
  } catch (error) {
    console.log(
      'Silent token acquisition fails. Acquiring token using popup. \n',
      error
    );
    if (error instanceof msal.InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return myMSALObj
        .acquireTokenPopup(request)
        .then((response_1) => {
          console.log(response_1);
          return response_1;
        })
        .catch((error_1) => {
          console.log(error_1);
        });
    } else {
      console.log(error);
    }
  }
}
export function callApi(endpoint, token) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  console.log('Calling web API...');

  fetch(endpoint, options)
    .then((response) => response.json())
    .then((response) => {
      if (response) {
        console.log('Web API responded: ' + response.name);
      }

      return response;
    })
    .catch((error) => {
      console.error(error);
    });
}
export function passTokenToApi() {
  getTokenPopup(tokenRequest).then((response) => {
    if (response) {
      console.log('access_token acquired at: ' + new Date().toString());
      try {
        callApi(apiConfig.webApi, response.accessToken);
      } catch (error) {
        console.log(error);
      }
    }
  });
}
export async function checkSession() {
  console.log('Before: ');
  const response = await getTokenPopup(tokenRequest);
  console.log('fdsfdsfdsfdsa: ', response);
  return response;
}

/**
 * To initiate a B2C user-flow, simply make a login request using
 * the full authority string of that user-flow e.g.
 * https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_edit_profile_v2
 */
export function editProfile() {
  const editProfileRequest = b2cPolicies.authorities.editProfile;
  editProfileRequest.loginHint =
    myMSALObj.getAccountByHomeId(accountId).username;

  myMSALObj.loginPopup(editProfileRequest).catch((error) => {
    console.log(error);
  });
}
