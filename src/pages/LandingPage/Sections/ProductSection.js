// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import styles from 'assets/jss/material-kit-react/views/landingPageSections/productStyle.js';
// core components
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import InfoArea from 'components/InfoArea/InfoArea.js';
import React from 'react';

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justifyContent='center'>
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>
            Dịch vụ khách hàng tại Phú Hưng Life
          </h2>
          <h5 className={classes.description}>
            This is the paragraph where you can write more details about your
            product. Keep you user engaged by providing meaningful information.
            Remember that by this time, the user is curious, otherwise he wouldn
            {"'"}t scroll to get here. Add a button if you want the user to see
            more.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title='Giải Quyết Quyền Lợi
              Bảo Hiểm'
              description='Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.'
              icon={MonetizationOnTwoToneIcon}
              iconColor='info'
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title='Thay đổi thông tin hợp đồng'
              description='Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.'
              icon={PublishedWithChangesIcon}
              iconColor='success'
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title='Biểu Mẫu Thông Dụng'
              description='Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.'
              icon={ArticleTwoToneIcon}
              iconColor='danger'
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
