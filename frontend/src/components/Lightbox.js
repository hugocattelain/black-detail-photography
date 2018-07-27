import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import LB from 'lightbox-react';
import findIndex from 'lodash/findIndex';
import $ from "jquery";

import '../styles/lightbox.css';

class Lightbox extends Component {
  state= {
      photoIndex:0,
      isOpen: false,
      images: [],
  }

  static propTypes = {
    images: PropTypes.array.isRequired,
    id: PropTypes.number

  }

  static defaultProps = {
    images: [],
    id: 0,
  }

  componentDidMount = () => {
    this.setState({
      images: this.props.images,
      photoIndex: findIndex(this.props.images, el => { return el.id == this.props.id}), // eslint-disable-line
      isOpen: this.props.id>0,
    });

  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      images: nextProps.images,
      photoIndex: findIndex(nextProps.images, el => { return el.id == nextProps.id}), // eslint-disable-line
      isOpen: nextProps.id>0,
    });
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    if((nextProps.id !== this.state.photoIndex && nextProps.id > 0)){
      return true;
    }
    if(nextProps.images.length !==this.state.images.length){
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
      this.props.history.push(`/${category}&${id}`);
    }
    else {
      const id = images[images.length-1].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: images.length-1});
      this.props.history.push(`/${category}&${id}`);
    }
  }

  nextPhoto = () => {
    const newIndex = this.state.photoIndex + 1;
    const images = this.state.images;
    if(newIndex < images.length){
      const id = images[newIndex].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: newIndex});
      this.props.history.push(`/${category}&${id}`);
    }
    else{
      const id = images[0].id;
      const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
      this.setState({ photoIndex: 0});
      this.props.history.push(`/${category}&${id}`);
    }
  }

  render() {
    const { images, photoIndex, isOpen } = this.state;
    if(images.length<1){return null;}
    const src = images[photoIndex].src ;
    return (
      <div>
        {isOpen &&
          <LB
            mainSrc={src.replace("upload", "upload/t_web_m")}
            nextSrc={images[(photoIndex + 1) % images.length].src.replace("upload", "upload/t_web_m")}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].src.replace("upload", "upload/t_web_m")}
            onCloseRequest={this.closeLightbox}
            onMovePrevRequest={this.prevPhoto}
            onMoveNextRequest={this.nextPhoto}
            discourageDownloads={true}
            enableZoom={false}
          />
        }
      </div>
    );
  }
}

export default withRouter(Lightbox);
