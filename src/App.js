import { EventType, InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { ThemeProvider } from '@material-ui/styles';
import { CustomNavigationClient } from 'azure/NavigationClient';
import b2cPolicies from 'azure/policies';
import AuthorizeRoute from 'components/AuthorizeRoute/AuthorizeRoute';
import ErrorBoundary from 'components/error-boundary/error-boundary.component';
import Spinner from 'components/spinner/spinner.component';
import React, { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { selectCurrentLang } from 'redux/languages/lang.selector';
import {
  signinFailure,
  signinStart,
  signinSuccess,
} from 'redux/user/user.action';
import { selectCurrentUser } from 'redux/user/user.selector';
import { createStructuredSelector } from 'reselect';
import themes from 'themes/theme';

const ClaimFormPage = lazy(() => import('./pages/Claim/ClaimForm.component'));
const LandingPage = lazy(() => import('pages/LandingPage/LandingPage.js'));

// LandingPage from 'pages/LandingPage/LandingPage.js';
const LoginPage = lazy(() => import('pages/LoginPage/LoginPage.js'));
const ErrorPage = lazy(() => import('pages/ErrorPage/ErrorPage'));
//const ProtectedPage = lazy(() => import('pages/ProtectedPage/ProtectedPage'));

function App(props) {
  const { i18n } = useTranslation('translation');
  const { lang } = props;
  //const [locale, setLocale] = React.useState('viVN');
  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance } = useMsal();

  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  instance.setNavigationClient(navigationClient);

  /**
   * Using the event API, you can register an event callback that will do something when an event is emitted.
   * When registering an event callback in a react component you will need to make sure you do 2 things.
   * 1) The callback is registered only once
   * 2) The callback is unregistered before the component unmounts.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
   */
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (
          event.error &&
          event.error.errorMessage.indexOf('AADB2C90118') > -1
        ) {
          if (event.interactionType === InteractionType.Redirect) {
            instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
          } else if (event.interactionType === InteractionType.Popup) {
            instance
              .loginPopup(b2cPolicies.authorities.forgotPassword)
              .catch((e) => {
                return;
              });
          }
        }
      }

      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        if (event?.payload) {
          /**
           * We need to reject id tokens that were not issued with the default sign-in policy.
           * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          if (
            event.payload.idTokenClaims['acr'] ===
            b2cPolicies.names.forgotPassword
          ) {
            window.alert(
              'Password has been reset successfully. \nPlease sign-in with your new password.'
            );
            return instance.logout();
          } else if (
            event.payload.idTokenClaims['acr'] === b2cPolicies.names.editProfile
          ) {
            window.alert(
              'Profile has been edited successfully. \nPlease sign-in again.'
            );
            return instance.logout();
          }
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  // useEffect(() => {
  //   if (!user) {
  //     const accessTokenRequest = {
  //       ...loginRequest,
  //       account,
  //     };
  //     instance
  //       .acquireTokenSilent(accessTokenRequest)
  //       .then((accessTokenResponse) => {
  //         signInSuccess(accessTokenResponse);
  //       })
  //       .catch((error) => {
  //         if (error instanceof InteractionRequiredAuthError) {
  //           instance
  //             .acquireTokenPopup(accessTokenRequest)
  //             .then(function (accessTokenResponse) {
  //               signInSuccess(accessTokenResponse);
  //             })
  //             .catch(function (error) {
  //               // Acquire token interactive failure
  //               // signInFail(error);
  //             });
  //         }
  //         // signInFail(error);
  //       });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    i18n.changeLanguage(lang);
    //setLocale(lang === 'vn' ? 'viVN' : 'enUS');
  }, [lang, i18n]);

  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary>
        <ThemeProvider theme={themes}>
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <AuthorizeRoute path='/claim/:claimId' component={ClaimFormPage} />
            <AuthorizeRoute exact path='/Login' component={LoginPage} />
            <Route exact path='/not-found'>
              <ErrorPage
                errorCode='404'
                errorDetail='Không tìm thấy trang yêu cầu'
                redirectLink='/'
                redirectPage='Trang chủ'
              />
            </Route>
            <Redirect to='/not-found' />
          </Switch>
        </ThemeProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

const mapStateToProps = createStructuredSelector({
  lang: selectCurrentLang,
  user: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: () => dispatch(signinStart()),
  signInSuccess: (user) => dispatch(signinSuccess(user)),
  signInFail: (error) => dispatch(signinFailure(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
