import React, { Component } from 'react';
import Lightbox from './Lightbox';
import { withRouter } from 'react-router';
import Masonry from 'react-masonry-component';
import { getCategoryName } from '../Utils';
import Client from "../Client";
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import $ from "jquery";
import '../Utils/unveil';
import '../styles/masonry.scss';
import spinner from "../images/spinner.gif";

var masonryOptions = {
    transitionDuration: 0
};
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


class MasonryWall extends Component{
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
      $(window).on("load", function(){
        $(".masonry-brick__image").unveil(100, function(){
          $(this).on("load", function(){
            $(this).addClass("veil");

            console.log('veil')
          });

        })
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

          $(".masonry-brick__image").unveil(100, function(){
            $(this).on("load", function(){
              $(this).addClass("veil");

            });

          })

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
      return(
        <li key={key} className="masonry-brick__container col-lg-4 col-md-4 col-sm-4 col-xs-6" onClick={() => this.openLightbox(id)}>
          <img src={item.src} data-src={item.src} alt={item.title || 'Black Detail Photography'} className="masonry-brick__image"/>
        </li>
      );
    });

    return (
        <div className="container">
          {!this.state.loading ? (
            <Masonry
                className="masonry-wall row"
                elementType="ul"
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
            >
                {childElements}
            </Masonry>

          ) : (
            <MuiThemeProvider muiTheme={muiBlack}>
              <CircularProgress className="global__progress-bar" size={30} thickness={2} />
            </MuiThemeProvider>
          )}
          { id > 0 &&
            <Lightbox images={images} id={Number(id)} />
          }
          {/* <Diaporama images={images} />*/}
        </div>


    );
  }
}

// MasonryWall.defaultProps = {
//   category: 'home',
// }

export default withRouter(MasonryWall);
