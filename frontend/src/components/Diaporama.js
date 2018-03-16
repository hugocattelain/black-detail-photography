import React, { Component } from 'react';

class Diaporama extends Component {

  constructor(props) {
    super(props);

    this.state = {
      images:[],
    };
  }
  componentDidMount(){
    let images = this.props.images;

    images = this.shuffle(images);
    this.setState({images: images});
  }

  shouldComponentUpdate(nextProps, nextState){

    if(this.props.images !== nextProps.images){
      let images = nextProps.images;
      images = this.shuffle(images);
      this.setState({images: images});
      return false;
    }
    else{
      return true;
    }
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

  render() {
    //const images = this.state.images;

    return (
      <div> </div>
    );
  }
}

export default Diaporama;
