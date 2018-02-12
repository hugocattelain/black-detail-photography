import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import Client from "../Client";
import '../styles/masonry.css';


var masonryOptions = {
    transitionDuration: 0
};

class MasonryWall extends Component{
  constructor(props){
    super(props);

    this.state = {
      images:[]
    }
  }


  componentDidMount(){
    const param = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category;
    Client.getAllImages(param, images => {
      this.setState({
        images: images
      })
    });

    const data = {src : 'testpost', title: 'pute'};
    Client.postImage(data, images => {
    //  images.push({src : 'testpost', title: 'pute'});
      // this.setState({
      //   images: images
      // })
    });
  }

  componentWillReceiveProps(nextProps){
    const nextCategory = nextProps.match.params.category;
    const currentCategory = this.props.match.params.category;
    if(nextCategory !== currentCategory){
      const param = nextCategory === undefined ? 'home' : nextCategory;

      Client.getAllImages(param, images => {
        this.setState({
          images: images
        })
      });
    }
  }
  render() {
    const childElements = this.state.images.map((item, key) => {
        return(
          <li key={key} className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <img src={item.src} />
          </li>
        );
    });

    return (
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
      </div>
    );
  }
}

MasonryWall.defaultProps = {
  category: 'home',
}

export default MasonryWall;
