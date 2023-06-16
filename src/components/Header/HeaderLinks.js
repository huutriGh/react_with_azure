/*eslint-disable*/
import { useMsal } from '@azure/msal-react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
// @material-ui/icons
import { Apps, Language, People } from '@mui/icons-material';
import styles from 'assets/jss/material-kit-react/components/headerLinksStyle.js';
import { loginRequest } from 'azure/authConfig';
import Button from 'components/CustomButtons/Button.js';
// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// react components for routing our app without refresh
import { Link } from 'react-router-dom';
import { changeLanguageStart } from 'redux/languages/lang.action';
import { selectCurrentUser } from 'redux/user/user.selector';
import { createStructuredSelector } from 'reselect';
import {
  signinFailure,
  signinStart,
  signinSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess
} from './../../redux/user/user.action';

const useStyles = makeStyles(styles);

function HeaderLinks({
  changeLanguage,
  signInStart,
  signInSuccess,
  signInFail,
  signOutStart,
  signOutSuccess,
  signOutFail,
  user,
}) {
  const classes = useStyles();
  const { instance, accounts, inProgress } = useMsal();

  const [name, setName] = useState(null);
  const [t] = useTranslation('translation');
  useEffect(() => {
    if (accounts.length > 0) {
      setName(accounts[0].name);
    } else {
      setName(null);
    }
  }, [accounts]);

  const handleLogout = (logoutType = 'popup') => {
    signOutStart();
    if (logoutType === 'popup') {
      instance
        .logoutPopup()
        .then((res) => signOutSuccess())
        .catch((error) => signOutFail(error));
    } else if (logoutType === 'redirect') {
      instance
        .logoutRedirect()
        .then((res) => signOutSuccess())
        .catch((error) => signOutFail(error));
    }
  };
  const handleLogin = (loginType) => {
    signInStart();
    if (loginType === 'popup') {
      instance
        .loginPopup(loginRequest)
        .then((res) => signInSuccess(res))
        .catch((err) => signInFail(err));
    } else if (loginType === 'redirect') {
      instance
        .loginRedirect(loginRequest)
        .then((res) => signInSuccess(res))
        .catch((err) => signInFail(err));
    }
  };
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText='YÊU CẦU'
          buttonProps={{
            className: classes.navLink,
            color: 'transparent',
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to='/claim/Clm01' className={classes.dropdownLink}>
              Quyền lợi bảo hiểm - Tử vong
            </Link>,
            <Link to='/claim/Clm02' className={classes.dropdownLink}>
              Quyền lợi bảo hiểm - Khác
            </Link>,
            // <a
            //   href='https://creativetimofficial.github.io/material-kit-react/#/documentation?ref=mkr-navbar'
            //   target='_blank'
            //   className={classes.dropdownLink}
            // >
            //   Documentation
            // </a>,
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText={t('header.language')}
          buttonProps={{
            className: classes.navLink,
            color: 'transparent',
          }}
          buttonIcon={Language}
          dropdownList={[
            <Button
              color='transparent'
              className={classes.dropdownLink}
              onClick={() => changeLanguage('vn')}
            >
              Tiếng Việt
            </Button>,
            <Button
              color='transparent'
              className={classes.dropdownLink}
              onClick={() => changeLanguage('en')}
            >
              English
            </Button>,
          ]}
        />
      </ListItem>

      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText={name ? name : t('header.account')}
          buttonProps={{
            className: classes.navLink,
            color: 'transparent',
          }}
          buttonIcon={People}
          dropdownList={
            name
              ? [
                  <Button
                    color='transparent'
                    className={classes.dropdownLink}
                    onClick={() => handleLogout('popup')}
                  >
                    {t('login.signout')}
                  </Button>,
                ]
              : [
                  <Button
                    color='transparent'
                    className={classes.dropdownLink}
                    onClick={() => handleLogin('popup')}
                  >
                    {t('login.signin')}
                  </Button>,
                ]
          }
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id='instagram-facebook'
          title='Follow us on facebook'
          placement={window.innerWidth > 959 ? 'top' : 'left'}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color='transparent'
            href='https://www.facebook.com/PhuHungLifeOfficial'
            target='_blank'
            className={classes.navLink}
          >
            <i className={classes.socialIcons + ' fab fa-facebook'} />
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});
const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (lang) => dispatch(changeLanguageStart(lang)),
  signInStart: () => dispatch(signinStart()),
  signInSuccess: (user) => dispatch(signinSuccess(user)),
  signInFail: (error) => dispatch(signinFailure(error)),

  signOutStart: () => dispatch(signOutStart()),
  signOutSuccess: () => dispatch(signOutSuccess()),
  signOutFail: (error) => dispatch(signOutFailure(error)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderLinks);
