import React, { Component } from 'react';
import { withRouter } from 'react-router';
import LB from 'lightbox-react';
import Client from "../Client";
import '../styles/lightbox.scss';
import findIndex from 'lodash/findIndex';
import { getCategoryName } from '../Utils';
import $ from "jquery";

class Lightbox extends Component {
  state= {
      photoIndex:0,
      isOpen: false,
      images: [],
  }

  componentDidMount = () => {
    const id = this.props.match.params.id;
    const category = getCategoryName(this.props.match.params.category);

    Client.getImages(category, images => {
      this.setState({
        images: images,
        photoIndex: findIndex(images, el => { return el.id == id}), // eslint-disable-line
        isOpen: true
      })
    });
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if(nextState.photoIndex !== this.state.photoIndex){
      return true;
    }
    if(nextState.images !== this.state.images){
      return true;
    }
    return false;
  }

  componentWillUnmount = () => {
      this.setState({ isOpen: false });
  }

  closeLightbox = () => {
    $(".hamburger").removeClass("gone");
    $(".mini-navbar").removeClass("gone");
    this.setState({ isOpen: false });
    const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
    const route = category === 'home' ? '/' : `/${category}` ;
    this.props.history.push(route);
  }

  prevPhoto = () => {
    const newIndex = this.state.photoIndex - 1;
    const images = this.state.images;
    if(newIndex >= 0){
      const id = images[newIndex].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: newIndex});
      this.props.history.push(`/${category}/${id}`);
    }
    else {
      const id = images[images.length-1].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: images.length-1});
      this.props.history.push(`/${category}/${id}`);
    }
  }

  nextPhoto = () => {
    const newIndex = this.state.photoIndex + 1;
    const images = this.state.images;
    if(newIndex < images.length){
      const id = images[newIndex].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: newIndex});
      this.props.history.push(`/${category}/${id}`);
    }
    else{
      const id = images[0].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: 0});
      this.props.history.push(`/${category}/${id}`);
    }
  }

  render() {
    const images = this.state.images;
    if(images.length<1){return null;}
    const photoIndex = this.state.photoIndex;
    const isOpen = this.state.isOpen;
    // console.log(photoIndex);
    // console.log(images[photoIndex]);
    const src = images[photoIndex].src ;
    return (
      <div>
        {isOpen &&
          <LB
            mainSrc={src}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.closeLightbox()}
            onMovePrevRequest={() => this.prevPhoto()}
            onMoveNextRequest={() => this.nextPhoto()}
            discourageDownloads={true}
            enableZoom={false}
          />
        }
      </div>
    );
  }
}

export default withRouter(Lightbox);
