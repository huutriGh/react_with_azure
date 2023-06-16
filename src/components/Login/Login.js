import AccountCircle from '@mui/icons-material/AccountCircle';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import { Container, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../assets/phl.svg';

const CustomPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  opacity: 0.85,
}));

export default function Login() {
  const [t] = useTranslation('translation');

  return (
    <Container
      style={{ maxWidth: '500px', marginTop: '150px' }}
    >
      <CustomPaper>
        <Grid
          container
          spacing={0}
          direction='column'
          alignItems='center'
          justifyContent='center'
          
        >
          <Logo width='100px' height='80px' />
        </Grid>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              marginLeft: '20px',
              marginRight: '20px',
            }}
          >
            <AccountCircle sx={{ color: 'goldenrod', mr: 1, my: 0.5 }} />
            <TextField
              style={{ opacity: 'unset' }}
              label={t('login.userId')}
              variant='standard'
              size='small'
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              marginLeft: '20px',
              marginRight: '20px',
            }}
          >
            <PasswordRoundedIcon sx={{ color: 'goldenrod', mr: 1, my: 0.5 }} />
            <TextField
              style={{ opacity: 'unset' }}
              label={t('login.password')}
              variant='standard'
              type='password'
              size='small'
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
           
          >
            <Grid
              container
              direction='column'
              alignItems='center'
              justifyContent='center'
            >
              <Button variant='contained' size='medium' color='secondary' sx={{mt:3, mb:2 }}>
                {t('login.signin')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} >
              <Typography variant='subtitle1' align='center' sx={{ fontSize: 13,mb:-1, mt:3 }}>
                Quên
                <Button variant='text' size='small' color='secondary'>
                  {`tên ${t('login.signin')}`}
                </Button>
                hoặc
                <Button variant='text' size='small' color='secondary'>
                  {`${t('login.password')}`}
                </Button>
                ?

              </Typography>
              <Typography
                variant='subtitle1'
                align='center'
                sx={{ fontSize: 13 }}
              >
                Quý khách chưa đăng ký tài khoản?
                <Button variant='text' size='small' color='secondary'>
                  {`${t('login.signup')}`}
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CustomPaper>
    </Container>
  );
}
