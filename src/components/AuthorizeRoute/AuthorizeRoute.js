/*eslint-disable*/
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated } from '@azure/msal-react';
import ErrorPage from 'pages/ErrorPage/ErrorPage';
import React from 'react';
import { Route } from 'react-router-dom';
import { selectCurrentUser } from 'redux/user/user.selector';
import { createStructuredSelector } from 'reselect';
function AuthorizeRoute({ component: Component, ...rest }) {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <ErrorPage
              errorCode='401'
              errorDetail='Vui lòng đăng nhập'
              redirectLink='/'
              redirectPage='Trang chủ'
            />
          );
        }
      }}
    />
  );
}
const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});

export default AuthorizeRoute;
