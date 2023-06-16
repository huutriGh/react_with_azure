// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import styles from 'assets/jss/material-kit-react/views/landingPage.js';
// nodejs library that concatenates classes
import classNames from 'classnames';
import Button from 'components/CustomButtons/Button.js';
import Footer from 'components/Footer/Footer.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
// @material-ui/icons
// core components
import Header from 'components/Header/Header.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';
import Logo from 'components/Logo/Logo.js';
import Parallax from 'components/Parallax/Parallax.js';
import React from 'react';
// Sections for this page
import ProductSection from './Sections/ProductSection.js';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        isTransparent={true}
        color='transparent'
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        leftLinks={<Logo />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: 'black',
        }}
        {...rest}
      />
      <Parallax filter image={require('assets/img/banner.png').default}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>Cổng Chăm sóc Khách hàng</h1>
              <h4>
                Chúng tôi đảm bảo mỗi khách hàng luôn được tôn trọng và phục vụ
                trong thời gian ngắn nhất. Đây chính là cam kết lâu dài mà mỗi
                cá nhân tại Phú Hưng Life sẽ không ngừng hoàn thiện để phục vụ
                khách hàng.
              </h4>
              <br />
              <Button
                color='danger'
                size='lg'
                href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-play' />
                Watch video
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
          {
            // <TeamSection />
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}
