import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import Client from "../Client";
import '../styles/masonry.css';

var masonryOptions = {
    transitionDuration: 0
};

class MasonryWall extends Component{
  constructor(props) {
		super(props);

  }
  state = {
    images:[]
  }

  componentDidMount(){
    Client.search(this.props.category, images => {
      this.setState({
        images: images
      })
    })
  }
  render() {
    const childElements = this.state.images.map((item, key) => {
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

export default MasonryWall;
