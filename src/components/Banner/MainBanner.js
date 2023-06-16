import * as React from 'react';
import MainLayout from '../Layout/MainLayout';
import Login from '../Login/Login';

const backgroundImage = '/Images/teahub.io-blue-wallpaper-hd-83222.png';
  //'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80'; 

export default function MainBanner() {
  return (
    <MainLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
        height: '100%',
      }}
    >
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt='increase priority'
      />
      <Login />
    </MainLayout>
  );
}
