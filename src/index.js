import { EventType, PublicClientApplication } from '@azure/msal-browser';
import msalConfig from 'azure/authConfig';
import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import '../src/assets/scss/material-kit-react.scss?v=1.10.0';
import App from './App';
import eng from './languages/eng.json';
import vn from './languages/vn.json';
import { persistor, store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { MsalProvider } from '@azure/msal-react';
import "assets/scss/material-kit-react.scss?v=1.10.0";
//import { StyledEngineProvider } from '@mui/material/styles';

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'vn',
  resources: {
    en: { translation: eng },
    vn: { translation: vn },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MsalProvider instance={msalInstance}>
      <Router>
        <I18nextProvider i18n={i18next}>
          <PersistGate persistor={persistor}>
            <App pca={msalInstance} />
          </PersistGate>
        </I18nextProvider>
      </Router>
    </MsalProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
