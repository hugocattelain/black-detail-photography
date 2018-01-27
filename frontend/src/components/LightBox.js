import React, { Component } from 'react';
import Lightbox from 'react-images';

export class LightBox extends Component {
  constructor(props){
    super(props);
  {/*  this.state={lightboxIsOpen: true};

        }  this.closeLightbox = this.closeLightbox.bind(this);  */}

  }

        {/*  closeLightbox(){
          this.setState({lightboxIsOpen: false});
        }  */}

  render() {

    return (
      <div className="lightbox__container">
      <h6>Can you see me ?</h6>
      <Lightbox
        images={imagesList}
        isOpen={this.state.lightboxIsOpen}
        onClickPrev={this.gotoPrevious}
        onClickNext={this.gotoNext}
        onClose={this.closeLightbox}
      />
      </div>
    );
  }

}
