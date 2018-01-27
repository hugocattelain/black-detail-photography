import React, { Component } from 'react';
import Gallery from './Gallery';

class PhotoCategories extends Component {
  constructor(props){
    super(props);
    this.state={imageList: null};
  }

  componentDidMount(){
    this.setState({imageList : [
      {
        src:'https://i.ytimg.com/vi/MYGcrULkmXY/maxresdefault.jpg',
        caption: 'Holy fucking beauties'
      },
      {
        src:'https://cdn.shopify.com/s/files/1/0747/3829/products/mHP1286_1024x1024.jpeg?v=1485014806'
      },
      {
        src:'https://lh3.googleusercontent.com/-PhLh1zSIYI8/U2fZKuTNCDI/AAAAAAAAJtU/4yVrIyOBbK4/w600-h900/Jamie-Sanna-Hot-Redhead-Girl.jpg 1024w'
      },
      {
        src:'http://www.xdtalk.com/attachments/sa2-jpg.210729'
      },
      {
        src:'https://i.imgur.com/nFyMv.jpg 500w'
      },
      {
        src:'https://res.cloudinary.com/dmdkvle30/image/upload/v1515940189/basic/iyui58fj9ktpottrqmk3.jpg'
      }
    ]})
  }
  render() {
    return (
      <div className="category__container">
        <Gallery
          images={this.state.imagesList}
          heading="JAI DIT PUTEUH"/>
      </div>
    );
  }
}

export default PhotoCategories;
