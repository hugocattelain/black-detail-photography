import React, { Component } from 'react';
//import WebNotifications from './NotificationWeb';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import Popover, {PopoverAnimationVertical} from '@material-ui/core/Popover';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton, TumblrShareButton } from 'react-share';

import Client from "../Client";
import email from '../images/email.png';
import '../styles/content.css';
import { DialogTitle } from '@material-ui/core';

const muiBlack = createMuiTheme({
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

class SocialMedia extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchorEl:null,
      modalIsOpen: false,
      userEmail: '',
      subscriptionProgress:'todo',
      snackbarIsOpen: false,
      message: "",
    };
  }

  componentWillMount = () => {
    if(window.localStorage.firstVisit !== 'false'){
      window.localStorage.firstVisit = 'true';
      document.addEventListener('mouseout',this.handleMouseOut, true);
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('mouseout',this.handleMouseOut, true);
  }

  handleMouseOut = (event) => {
    if(event.clientY <= 0){
     this.setState({modalIsOpen: true});
    }
  }

  handleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  handleOpenModal = () => {
    this.setState({modalIsOpen: true});
  }

  handleCloseModal = () => {
    this.setState({modalIsOpen: false});
    if(window.localStorage.firstVisit !== 'false'){
      document.removeEventListener('mouseout',this.handleMouseOut, true);
      window.localStorage.firstVisit = 'false';
    }
  }

  handleSnackbarClose = () => {
    this.setState({
      message: "",
      snackbarIsOpen: false,
    });
  }

  handleEmailNotifications = (e) => {
    e.preventDefault();
    this.setState({ subscriptionProgress: 'progress' });
    const data = {
      email: this.state.userEmail,
      subscription_type: 1,
    };
    Client.postEmail(data)
    .then((res) => {
      this.setState({
        subscriptionProgress: 'done',
        snackbarIsOpen: true,
        message: "Yay ! You just subscribed to the Newsletter",
       });
     })
     .catch((err) => {
       this.setState({
         subscriptionProgress: 'todo',
         snackbarIsOpen: true,
         message: "Oops, something went wrong. Sorry for that !",
        });
     });
  }

  handleWebNotifications = () => {
    this.setState({
      subscriptionProgress: 'done',
    });
  }

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value});
  }

  render() {
    const { anchorEl, open } = this.state;
    const url = 'https://www.black-detail.com';
    const title = 'Black Detail - Portfolio';
    const description = "Black Detail Photography portfolio. Fine-art Nude, Portrait, Fashion, Architecture.";
    const media = "https://res.cloudinary.com/blackdetail/image/upload/t_web_large/v1533369369/Util/20180204_030923_2.jpg";
    const hashtags = ['fineart', 'photography', 'nude', 'boudoir', 'portrait', 'blackandwhite', 'bnw'];
    const actions = [
      <Button
        onClick={this.handleCloseModal}
      >{this.state.subscriptionProgress === 'done' ? "Close" : "No, thank you"}</Button> ];

    return (
      <div>
        <div className="social__wrapper">
          <a href="https://www.instagram.com/blck.dtl/" target="_blank" rel="noopener noreferrer"><div className="social__item instagram"></div></a>
          <a href="https://www.facebook.com/blck.dtl/" target="_blank" rel="noopener noreferrer"><div className="social__item facebook"></div></a>
          <a href="https://www.eyeem.com/u/blck_dtl" target="_blank" rel="noopener noreferrer"><div className="social__item eyeem"></div></a>

          <div className="social__share__container col-xs-12">
            <MuiThemeProvider theme={muiBlack}>
              <Button
                variant="contained"
                onClick={this.handleClick}
                className="social__share-button"
              >Share</Button>
            </MuiThemeProvider>
            <MuiThemeProvider theme={muiBlack}>
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                transformOrigin={{horizontal: 'left', vertical: 'center'}}
                onClose={this.handleRequestClose}
                animation={PopoverAnimationVertical}
              >
                <Menu 
                  className="share__menu"
                  anchorEl={anchorEl}
                  open={open}
                >
                  <FacebookShareButton url={url}><MenuItem className="share__button-facebook">Share on Facebook</MenuItem></FacebookShareButton>
                  <Divider />
                  <TwitterShareButton
                    url = {url}
                    title = {title}
                    hashtags = {hashtags}
                  >
                    <MenuItem className="share__button-twitter">Share on Twitter</MenuItem>
                  </TwitterShareButton>
                  <Divider />
                  <TumblrShareButton
                    url = {url}
                    title = {title}
                    tags = {hashtags}
                    caption={description}
                  >
                    <MenuItem className="share__button-tumblr">Post on Tumblr</MenuItem>
                  </TumblrShareButton>
                  <Divider />
                  <PinterestShareButton
                    url = {url}
                    description = {title}
                    media = {media}
                    >
                    <MenuItem className="share__button-pinterest">Pin on Pinterest</MenuItem>
                  </PinterestShareButton>

                </Menu>
              </Popover>
            </MuiThemeProvider>
            <MuiThemeProvider theme={muiBlack}>
              <IconButton className="social__notifications-button" onClick={this.handleOpenModal}>
                <i className="shake shake-rorate material-icons">notifications</i>
              </IconButton>
            </MuiThemeProvider>
          </div>

          <MuiThemeProvider theme={muiBlack}>
            <Dialog
              title="Notifications"
              actions={actions}
              modal={true}
              open={this.state.modalIsOpen}
              aria-labelledby="social__modal__title"
              className="social__modal"
            >
            <DialogTitle id="social__modal__title">{"Use Google's location service?"}</DialogTitle>
              <div className="social__modal__description">
              <img className="social__modal-icon" src={email} alt="Newsletter_Icon"/>
              <div>
                Subscribe to the newsletter to receive the latest updates. <br/>Get notified when a new post comes up.
              </div>
              {this.state.subscriptionProgress === 'todo' && (
              <div className="social__modal__actions col-xs-12">
                <form onSubmit={(e) => this.handleEmailNotifications(e)}>
                  <MuiThemeProvider theme={muiBlack}>
                    <TextField
                      hintText="Email address"
                      className="social__modal__input"
                      required={true}
                      type="email"
                      value={this.state.userEmail}
                      onChange={(e) => this.setInputState(e, 'userEmail')}
                    />
                  </MuiThemeProvider>
                  <MuiThemeProvider theme={muiBlack}>
                    <Button
                      variant="contained"
                      className="social__modal__actions__button"
                      color="primary"
                      type="submit"
                      disabled={this.state.subscriptionProgress === 'progress'}
                    >OK</Button>
                  </MuiThemeProvider>
                </form>
              </div>
            )}
            {/*  <div className="social__modal__actions col-xs-12">
                <div className="col-xs-5">
                  <hr className="global__divider"/>
                </div>
                <div className="or col-xs-2">
                  OR
                </div>
                <div className="col-xs-5">
                  <hr className="global__divider"/>
                </div>
              </div>
              <div className="social__modal__actions col-xs-12">
                <WebNotifications title="Congrats" body="You just activated web notifications !" timeout={4000}/>
              </div>*/}

              </div>
              {this.state.subscriptionProgress === 'progress' && (
                <MuiThemeProvider theme={muiBlack}>
                  <CircularProgress className="global__progress-bar" size={30} thickness={2} />
                </MuiThemeProvider>
              )}

                {this.state.subscriptionProgress === 'done' && (
                  <div className="social__modal__success">Congratulations ! You subscribed to the newsletter. </div>
                )}
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider theme={muiBlack}>
            <Snackbar
              open={this.state.snackbarIsOpen}
              message={this.state.message}
              autoHideDuration={4000}
              onClose={this.handleSnackbarClose}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default SocialMedia;
