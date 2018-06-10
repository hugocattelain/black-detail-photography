import React, { Component } from 'react';
import WebNotifications from './NotificationWeb';
import Client from "../Client";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton, TumblrShareButton } from 'react-share';

import '../styles/content.css';
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

class SocialMedia extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
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
    const url = 'http://www.black-detail.com';
    const title = 'Black Detail - Portfolio';
    const description = "Black Detail Photography portfolio. Fine-art Nude, Portrait, Fashion, Architecture.";
    const media = "https://res.cloudinary.com/dmdkvle30/image/upload/v1520280571/basic/ffoukuuihxlkn9s5nlct.jpg";
    const hashtags = ['fineart', 'photography', 'nude', 'boudoir', 'portrait', 'blackandwhite', 'bnw'];
    const actions = [
      <FlatButton
        label={this.state.subscriptionProgress === 'done' ? "Close" : "No, thank you"}
        onClick={this.handleCloseModal}
      /> ];

    return (
      <div>
        <div className="social__wrapper">
          <a href="https://www.instagram.com/blck.dtl/" target="_blank" rel="noopener noreferrer"><div className="social__item instagram"></div></a>
          <a href="https://www.facebook.com/blck.dtl/" target="_blank" rel="noopener noreferrer"><div className="social__item facebook"></div></a>
          <a href="https://www.eyeem.com/u/blck_dtl" target="_blank" rel="noopener noreferrer"><div className="social__item eyeem"></div></a>

          <div className="social__share__container col-xs-12">
            <MuiThemeProvider muiTheme={muiBlack}>
              <RaisedButton
                onClick={this.handleClick}
                label="Share"
                className="social__share-button"
              />
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={muiBlack}>
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                targetOrigin={{horizontal: 'left', vertical: 'center'}}
                onRequestClose={this.handleRequestClose}
                animation={PopoverAnimationVertical}
              >
                <Menu className="share__menu">
                  <FacebookShareButton url={url}><MenuItem className="share__button-facebook" primaryText="Share on Facebook" /></FacebookShareButton>
                  <Divider />
                  <TwitterShareButton
                    url = {url}
                    title = {title}
                    hashtags = {hashtags}
                  >
                    <MenuItem className="share__button-twitter" primaryText="Share on Twitter" />
                  </TwitterShareButton>
                  <Divider />
                  <TumblrShareButton
                    url = {url}
                    title = {title}
                    tags = {hashtags}
                    caption={description}
                  >
                    <MenuItem className="share__button-tumblr" primaryText="Post on Tumblr" />
                  </TumblrShareButton>
                  <Divider />
                  <PinterestShareButton
                    url = {url}
                    description = {title}
                    media = {media}
                    >
                    <MenuItem className="share__button-pinterest" primaryText="Pin on Pinterest" />
                  </PinterestShareButton>

                </Menu>
              </Popover>
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={muiBlack}>
              <IconButton className="social__notifications-button" onClick={this.handleOpenModal}>
                <i className="shake shake-rorate material-icons">notifications</i>
              </IconButton>
            </MuiThemeProvider>
          </div>

          <MuiThemeProvider muiTheme={muiBlack}>
            <Dialog
              title="Notifications"
              actions={actions}
              modal={true}
              open={this.state.modalIsOpen}
              titleClassName="social__modal__title"
              className="social__modal"
            >
              <div className="social__modal__description">
              <div className="social__modal__actions col-xs-12">
                <form onSubmit={(e) => this.handleEmailNotifications(e)}>
                  <MuiThemeProvider muiTheme={muiBlack}>
                    <TextField
                      hintText="Email address"
                      className="social__modal__input"
                      required={true}
                      type="email"
                      value={this.state.userEmail}
                      onChange={(e) => this.setInputState(e, 'userEmail')}
                    />
                  </MuiThemeProvider>
                  <MuiThemeProvider muiTheme={muiBlack}>
                    <RaisedButton
                      className="social__modal__actions__button"
                      label="OK"
                      primary={true}
                      type="submit"
                      disabled={this.state.subscriptionProgress === 'progress'}
                    />
                  </MuiThemeProvider>
                </form>
              </div>
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
              <span>
                Get notified when a new post comes up<br/>You can subscribe to the newsletter and/or the web notifications
              </span>
              </div>
              {this.state.subscriptionProgress === 'progress' && (
                <MuiThemeProvider muiTheme={muiBlack}>
                  <CircularProgress className="global__progress-bar" size={30} thickness={2} />
                </MuiThemeProvider>
              )}
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Snackbar
              open={this.state.snackbarIsOpen}
              message={this.state.message}
              autoHideDuration={4000}
              onRequestClose={this.handleSnackbarClose}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default SocialMedia;
