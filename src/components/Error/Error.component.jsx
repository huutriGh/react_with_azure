import Button from 'components/CustomButtons/Button.js';
import Typography from '@mui/material/Typography';
import { NotFoundContainer } from 'assets/jss/material-kit-react/components/NotFound.styles';
import React from 'react';
import { useHistory } from 'react-router-dom';
const ErrorDetail = ({ errorCode, errorDetail, redirectLink, redirectPage }) => {
  let history = useHistory();
  const handleClick = () => {
    history.push(redirectLink);
  };
  return (
    <NotFoundContainer>
      <Typography component='h1' variant='h1' align='center' display='block'>
        {errorCode}
      </Typography>
      <Typography component='h6' variant='h6' align='center'>
        {errorDetail}
      </Typography>
      <Typography align='center' style={{ marginTop: '30px' }}>
        <Button color='primary' size='sm' onClick={handleClick}>
          {redirectPage}
        </Button>
      </Typography>
    </NotFoundContainer>
  );
};

export default ErrorDetail;
