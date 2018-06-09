import React, { Component } from 'react';
import Lightbox from './Lightbox';
import { withRouter } from 'react-router';
import { getCategoryName } from '../Utils';
import Client from "../Client";
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import $ from "jquery";
import '../styles/masonry.scss';
import lazysizes from 'lazysizes';

const muiBlack = getMuiTheme({
  "palette": {
    "primary1Color": "#212121",
    "primary2Color": "#616161",
    "accent1Color": "rgba(117, 117, 117, 0.51)",
    "pickerHeaderColor": "#212121"
  },
  "textField": {
    "errorColor": "#f44336"
  },
  "borderRadius": 2
});


class Masonry2 extends Component{
  constructor(props){
    super(props);

    this.state = {
      images:[],
      loading: false,
    };
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    const param = getCategoryName(this.props.match.params.category);
    Client.getAllImages(param, images => {
      this.setState({
        images: images,
        loading: false,
      });
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const nextCategory = getCategoryName(nextProps.match.params.category);
    const currentCategory = getCategoryName(this.props.match.params.category);
    if(nextCategory !== currentCategory){
      const param = nextCategory;
      this.setState({ loading: true });
      Client.getAllImages(param, images => {
        this.setState({
          images: images,
          loading: false,
        });
      });
    }
  }

  openLightbox = (id) => {
    $(".hamburger").addClass("gone");
    $(".mini-navbar").addClass("gone");
    const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category ;
    this.props.history.push(`/${category}&${id}`);
  }

  render() {
    const images = this.state.images;
    let id=this.props.match.params.id;


    const childElements = images.map((item, key) => {
      const id = item.id;
      const thumb = item.src.replace("upload", "upload/t_thumb");
      return(
        <li key={key} className="masonry-layout__panel" onClick={() => this.openLightbox(id)}>
          <img
            src={thumb}
            data-expand="200"
            data-src={item.src}
            alt={item.title || 'Black Detail Photography'}
            className="masonry-layout__panel-content lazyload"
          />
        </li>
      );
    });

    return (
      <div className="container">
        {!this.state.loading ? (
            <ul className="masonry-layout">{childElements}</ul>
        ) : (
          <MuiThemeProvider muiTheme={muiBlack}>
            <CircularProgress className="global__progress-bar" size={30} thickness={2} />
          </MuiThemeProvider>
        )}
        { id > 0 &&
          <Lightbox images={images} id={Number(id)} />
        }
      </div>
    );
  }
}


export default withRouter(Masonry2);
