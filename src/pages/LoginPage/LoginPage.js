import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons
import People from '@mui/icons-material/People';
import image from 'assets/img/bg7.jpg';
import styles from 'assets/jss/material-kit-react/views/loginPage.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import CardHeader from 'components/Card/CardHeader.js';
import Button from 'components/CustomButtons/Button.js';
import CustomInput from 'components/CustomInput/CustomInput.js';
import Footer from 'components/Footer/Footer.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
// core components
import Header from 'components/Header/Header.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { signIn } from './../../azure/authPopup.js';
import { signinStart, signOutStart } from './../../redux/user/user.action';


const useStyles = makeStyles(styles);

function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState('cardHidden');
  const [t] = useTranslation('translation');
  // const [img, setImg] = React.useState([]);
  setTimeout(function () {
    setCardAnimation('');
  }, 700);
  const classes = useStyles();
  const { signin, signout, ...rest } = props;
  const [state, setState] = React.useState({
    values: { userId: '', password: '' },
  });

  const handleSignInWithAzure = async () => {
    try {
      signIn();
    } catch (err) {
      console.log('handleSignInWithAzure', err);
    }
  };

  const handleChange = (event) => {
    event.persist();

    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
    }));
  };

  // const handleChane = (event) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const arrImg = [];
  //     for (let i = 0; i < event.target.files.length; i++) {
  //       arrImg.push(URL.createObjectURL(event.target.files[i]));
  //     }
  //     setImg(arrImg);
  //   }
  // };

  return (
    <div>
      <Header
        absolute
        color='transparent'
        brand='Phu Hung Life'
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: 'url(' + image + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className={classes.container}>
          <GridContainer justifyContent='center'>
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color='primary' className={classes.cardHeader}>
                    <h4>{t('login.signin')}</h4>
                  </CardHeader>
                  <p className={classes.divider}>
                    <Button simple color='danger' size='lg'>
                      {t('login.forgotPassword')}
                    </Button>
                    <Button simple color='danger' size='lg'>
                      {t('login.signup')}
                    </Button>
                  </p>
                  <CardBody>
                    <CustomInput
                      labelText={t('login.userId')}
                      id='userId'
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: 'text',
                        endAdornment: (
                          <InputAdornment position='end'>
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleChange,
                        name: 'userId',
                        value: state.values.userId,
                      }}
                    />

                    <CustomInput
                      labelText={t('login.password')}
                      id='pass'
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: 'password',
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: 'off',
                        onChange: handleChange,
                        name: 'password',
                        value: state.values.password,
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <p className={classes.divider}>
                      <Button
                        color='primary'
                        size='lg'
                        onClick={handleSignInWithAzure}
                      >
                        {t('login.signin')}
                      </Button>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => ({
  signin: (user) => dispatch(signinStart(user)),
  signout: () => dispatch(signOutStart()),
});
export default connect(null, mapDispatchToProps)(LoginPage);
