import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Masonry from 'react-masonry-component';
import { getCategoryName } from '../Utils';
import Client from "../Client";
import '../styles/masonry.scss';

var masonryOptions = {
    transitionDuration: 0
};

class MasonryWall extends Component{
  constructor(props){
    super(props);

    this.state = {
      images:[],
      photoIndex : 0,
      lightboxIsOpen: false,
    };
  }

  componentDidMount = () => {

    const param = getCategoryName(this.props.match.params.category);
    Client.getAllImages(param, images => {
      this.setState({
        images: images
      })
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const nextCategory = getCategoryName(nextProps.match.params.category);
    const currentCategory = getCategoryName(this.props.match.params.category);
    if(nextCategory !== currentCategory){
      const param = nextCategory;
      Client.getAllImages(param, images => {
        this.setState({
          images: images
        })
      });
    }
  }

  openLightbox = (index) => {
    const id = this.state.images[index].id;
    const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
    this.props.history.push(`/${category}/${id}`);
  }

  render() {
    const images = this.state.images.map( image => {
      return image.src;
    });
    const { photoIndex, lightboxIsOpen } = this.state;
    const childElements = this.state.images.map((item, key) => {
      const index = key;
      return(
        <li key={key} className="masonry-brick__container col-lg-3 col-md-4 col-sm-6 col-xs-6" onClick={() => this.openLightbox(index)}>
          <img src={item.src} alt={item.title || 'Black Detail Photography'} className="masonry-brick__image"/>
        </li>
      );
    });

    return (
      <div className="outer__container">
        <div className="container">
          <Masonry
              className="masonry-wall row"
              elementType="ul"
              options={masonryOptions}
              disableImagesLoaded={false}
              updateOnEachImageLoad={false}
          >
              {childElements}
          </Masonry>
          {/* <Diaporama images={images} />*/}
        </div>
      </div>
    );
  }
}

// MasonryWall.defaultProps = {
//   category: 'home',
// }

export default withRouter(MasonryWall);
