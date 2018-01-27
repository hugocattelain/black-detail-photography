import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import '../styles/masonry.css';

var masonryOptions = {
    transitionDuration: 0
};

class MasonryWall2 extends Component{
  constructor() {
		super();
		this.state = {
			items:[
        {
          src:'https://i.ytimg.com/vi/MYGcrULkmXY/maxresdefault.jpg'
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
          src:'https://i.imgur.com/nFyMv.jpg'
        },
        {
          src:'https://res.cloudinary.com/dmdkvle30/image/upload/v1515940189/basic/iyui58fj9ktpottrqmk3.jpg'
        },
        {
          src:'https://i.ytimg.com/vi/MYGcrULkmXY/maxresdefault.jpg'
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
          src:'https://i.imgur.com/nFyMv.jpg'
        },
        {
          src:'https://i.ytimg.com/vi/MYGcrULkmXY/maxresdefault.jpg'
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
          src:'https://i.imgur.com/nFyMv.jpg'
        },
        {
          src:'https://i.ytimg.com/vi/MYGcrULkmXY/maxresdefault.jpg'
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
          src:'https://i.imgur.com/nFyMv.jpg'
        }
      ]
		}
  }

  render() {
    const childElements = this.state.items.map((item, key) => {
            return(<li key={key} className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img src={item.src} />
            </li>);
    });

    return (
        <Masonry
            className="masonry-wall row"
            elementType="ul"
            options={masonryOptions}
            disableImagesLoaded={false}
            updateOnEachImageLoad={false}
        >
            {childElements}
        </Masonry>
    );
  }
}

export default MasonryWall2;
