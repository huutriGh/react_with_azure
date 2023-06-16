import ImageList from '@mui/material/ImageList';
import React, { useState } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import SubmitButton from './SubmitButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@material-ui/core/Button';
import { createStructuredSelector } from 'reselect';
import { selectImages } from 'redux/claim/claim.selector';
import { connect } from 'react-redux';
import { addImages } from './../../redux/claim/claim.actions';
const UploadImage = ({ addImages, initImages }) => {
  const [images, setImages] = useState([]);

  const handleChane = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const arrImg = [...images];
      for (let i = 0; i < event.target.files.length; i++) {
        //arrImg.push(URL.createObjectURL(event.target.files[i]));

        const file = arrImg.filter(
          (img) => img.name === event.target.files[i].name
        );
        if (file.length > 0) {
          continue;
        }

        arrImg.push(event.target.files[i]);
      }

      setImages(arrImg);
    }
  };

  const handleAction = () => {
    addImages(images);
  };
  return (
    <React.Fragment>
      <Button variant='contained' component='label' fullWidth>
        Chứng từ ban đầu
        <input
          type='file'
          hidden
          multiple
          accept='image/png, image/jpeg'
          onChange={handleChane}
          name='firstDocument'
        />
      </Button>
      {
        <ImageList sx={{ height: 164 }} cols={6} rowHeight={164}>
          {images.map((item) => (
            <ImageListItem key={item.name}>
              <img
                src={URL.createObjectURL(item)}
                srcSet={URL.createObjectURL(item)}
                alt={item.name}
                loading='lazy'
              />
            </ImageListItem>
          ))}
        </ImageList>
      }
      <Typography gutterBottom component='div'>
        <Divider />
      </Typography>

      {
        //   <Button variant='contained' component='label' fullWidth>
        //   Chứng từ bổ sung
        //   <input type='file' hidden />
        // </Button>
        //   <ImageList sx={{ height: 164 }} cols={6} rowHeight={164}>
        //     {itemData.map((item) => (
        //       <ImageListItem key={item.img}>
        //         <img
        //           src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
        //           srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        //           alt={item.title}
        //           loading='lazy'
        //         />
        //       </ImageListItem>
        //     ))}
        //   </ImageList>
        // <Typography gutterBottom component='div'>
        //   <Divider />
        // </Typography>
      }

      <SubmitButton
        isValid={images.length === 0}
        actionNext={handleAction}
        actionBack={handleAction}
      />
    </React.Fragment>
  );
};

// const itemData = [
//   {
//     img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
//     title: 'Breakfast',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
//     title: 'Burger',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//     title: 'Camera',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//     title: 'Coffee',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//     title: 'Hats',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
//     title: 'Honey',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
//     title: 'Basketball',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
//     title: 'Fern',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
//     title: 'Mushrooms',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
// ];
const mapStateToProps = createStructuredSelector({
  initImages: selectImages,
});
const mapDispatchToProps = (dispatch) => ({
  addImages: (images) => dispatch(addImages(images)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage);
