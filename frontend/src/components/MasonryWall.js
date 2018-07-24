import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CookieConsent from "react-cookie-consent";
import $ from "jquery";
// eslint-disable-next-line
import lazysizes from 'lazysizes';

import Lightbox from './Lightbox';
import { getCategoryName } from '../Utils';
import Client from "../Client";
import LandingPage from './LandingPage';
import '../styles/masonry.css';


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


class Masonry extends Component{
  constructor(props){
    super(props);

    this.state = {
      images:[],
      loading: false,
    };
  }

  componentDidMount = () => {
    $('.landing-page__title').addClass("faded");
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
    const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category;
    this.props.history.push(`/${category}&${id}`);
  }

  render() {
    const images = this.state.images;
    let id=this.props.match.params.id;
    const category = this.props.match.params.category === undefined ? 'home' : this.props.match.params.category;

    const childElements = images.map((item, key) => {
      const id = item.id;
      const thumb = item.src.replace("upload", "upload/t_thumb");
      return(
        <li key={key} className="masonry-layout__panel" onClick={() => this.openLightbox(id)}>
          <img
            src={thumb}
            data-expand="600"
            data-src={item.src.replace("upload", "upload/t_web_m")}
            alt={item.title || 'Black Detail Photography'}
            className="masonry-layout__panel-content lazyload"
          />
        </li>
      );
    });

    return (
      <div>
        <LandingPage category={category}/>
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
        <CookieConsent
          location="bottom"
          buttonText="Ok"
          style={{ background: "#000" }}
          buttonStyle={{ color: "#000", fontSize: "13px", background:"#fff" }}
          expires={150}
      >
          This website uses cookies to enhance the user experience.{" "}
      </CookieConsent>
      </div>
    );
  }
}


export default withRouter(Masonry);
