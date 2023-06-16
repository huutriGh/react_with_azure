// import Button from '@mui/material/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Button from 'components/CustomButtons/Button.js';
import Header from 'components/Header/Header.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';
import Logo from 'components/Logo/Logo.js';
import React, { useEffect } from 'react';
//import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  downloadFilePDF,
  setActiveStep,
  setApplyFormValid,
} from './../../redux/claim/claim.actions';
import {
  selectActiveStep,
  selectApplyStatus,
  selectFormApplyStatus,
  selectIsProcessing,
} from './../../redux/claim/claim.selector';
import Benifit from './Benifit.component';
import useStyles from './classes.style';
import CompleteForm from './CompleteForm.component';
import Event from './Event.component';
import Life from './Life.component';
import Medical from './Medical.component';
import OtherInsurance from './OtherInsurance.component';
import PaymentMedthod from './PaymentMethod.component';
import UploadImage from './UploadImage.component';
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const ClaimForm = ({
  match,
  history,
  activeStep,
  applyStatus,
  isProcessing,
  downloadFile,
  changeActiveStep,
  changeFormApplyValid,
  formApplyStatus,
}) => {
  const classes = useStyles();
  //const [t] = useTranslation('translation');
  let stepCount = 0;
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    setOpen(true);
  }, [applyStatus]);
  useEffect(() => {
    if (activeStep === stepCount - 1 && formApplyStatus === false) {
      changeFormApplyValid();
    }
  }, [changeFormApplyValid, activeStep, stepCount, formApplyStatus]);

  const steps =
    match.params.claimId !== 'Clm01'
      ? [
          'Thông tin cá nhân',
          'Loại Quyền lợi',
          'Sự kiện bảo hiểm',
          'Thông tin y khoa',
          'Phương thức thanh toán',
          'Thông tin bảo hiểm khác',
          'Upload chứng từ',
          'Hoàn tất thông tin',
        ]
      : [
          'Thông tin cá nhân',
          'Sự kiện bảo hiểm',
          'Thông tin y khoa',
          'Phương thức thanh toán',
          'Thông tin bảo hiểm khác',
          'Upload chứng từ',
          'Hoàn tất thông tin',
        ];
  stepCount = steps.length;
  const getStepContent = (step, formType) => {
    switch (step) {
      case 0:
        return <Life />;
      case 1:
        return <Benifit />;
      case 2:
        return <Event formType={formType} />;
      case 3:
        return <Medical formType={formType} />;
      case 4:
        return <PaymentMedthod />;
      case 5:
        return <OtherInsurance />;
      case 6:
        return <UploadImage></UploadImage>;
      case 7:
        return <CompleteForm formType={formType} />;

      default:
    }
  };
  const getStepContentWithOutBenifit = (step, formType) => {
    switch (step) {
      case 0:
        return <Life />;
      case 1:
        return <Event formType={formType} />;
      case 2:
        return <Medical formType={formType} />;
      case 3:
        return <PaymentMedthod />;
      case 4:
        return <OtherInsurance />;
      case 5:
        return <UploadImage></UploadImage>;
      case 6:
        return <CompleteForm formType={formType} />;

      default:
    }
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Header
        isTransparent={false}
        color='nonTransparent'
        routes={[]}
        leftLinks={<Logo />}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: 'white',
        }}
      />

      <Container className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h5' align='center'>
            {`ĐƠN YÊU CẦU GIẢI QUYẾT QUYỀN LỢI BẢO HIỂM ${
              match.params.claimId === 'Clm01' ? 'TỬ VONG' : ''
            }`}
          </Typography>
          <Stepper
            activeStep={activeStep}
            className={classes.stepper}
            orientation='vertical'
          >
            {steps.map((label, idx) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <React.Fragment>
                    {match.params.claimId === 'Clm01'
                      ? getStepContentWithOutBenifit(
                          activeStep,
                          match.params.claimId
                        )
                      : getStepContent(activeStep, match.params.claimId)}
                  </React.Fragment>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length && applyStatus ? (
              <React.Fragment>
                <Typography variant='h5' gutterBottom>
                  Cảm ơn quý khách.
                </Typography>
                <Typography variant='subtitle1'>
                  Quý khách vui lòng in đơn yêu cầu, ký tên và gửi về Công ty cổ
                  phần Bảo hiểm nhân thọ Phú Hưng.
                </Typography>
                <Typography variant='subtitle1'>
                  Quý khách có thể download file nếu trình duyệt không tự động
                  mở file hoặc chỉnh sửa lại thông tin trên phiếu in ra bên dưới
                </Typography>

                <Grid container>
                  <Grid Grid item xs={12} sm={6}>
                    <Button variant='contained' onClick={downloadFile}>
                      Tải file
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant='contained'
                      onClick={() => changeActiveStep(0)}
                    >
                      Cập nhật lại thông tin
                    </Button>
                  </Grid>

                  <Grid Grid item xs={12} sm={6}></Grid>
                </Grid>
                <Snackbar
                  open={open}
                  autoHideDuration={10000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert onClose={handleClose} severity='success'>
                    Tạo file yêu cầu thành công
                  </Alert>
                </Snackbar>
              </React.Fragment>
            ) : applyStatus !== true && applyStatus !== undefined ? (
              <React.Fragment>
                <Snackbar
                  open={open}
                  autoHideDuration={10000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert onClose={handleClose} severity='error'>
                    Tạo file yêu cầu thất bại. Quý khách vui lòng thử lại.
                  </Alert>
                </Snackbar>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        </Paper>
        <Dialog open={isProcessing}>
          <Container
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <CircularProgress style={{ margin: '20px 100px' }} />
            </div>
            <Typography
              component='h1'
              variant='h4'
              align='center'
              style={{ marginBottom: '20px' }}
            >
              Vui lòng chờ
            </Typography>
          </Container>
        </Dialog>
        {/** <Copyright /> */}
      </Container>
    </React.Fragment>
  );
};

const mapStateToProp = createStructuredSelector({
  applyStatus: selectApplyStatus,
  activeStep: selectActiveStep,
  isProcessing: selectIsProcessing,
  formApplyStatus: selectFormApplyStatus,
});
const mapDispatchToProps = (dispatch) => ({
  downloadFile: () => dispatch(downloadFilePDF()),
  changeActiveStep: (step) => dispatch(setActiveStep(step)),
  changeFormApplyValid: () => dispatch(setApplyFormValid()),
});

export default connect(mapStateToProp, mapDispatchToProps)(ClaimForm);
