import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton, TumblrShareButton } from 'react-share';

class SocialMedia extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const url = 'http://www.black-detail.com';
    const title = 'Black Detail - Portfolio';
    const description = "Black Detail Photography portfolio. Fine-art Nude, Portrait, Fashion, Architecture.";
    const media = "https://res.cloudinary.com/dmdkvle30/image/upload/v1520280571/basic/ffoukuuihxlkn9s5nlct.jpg";
    const hashtags = ['fineart', 'photography', 'nude', 'boudoir', 'portrait', 'blackandwhite', 'bnw'];
    return (
      <div>
        <div className="social-wraper">
          <a className="social-item instagram" href="https://www.instagram.com/blck.dtl/" target="_blank" rel="noopener noreferrer"></a>
          <a className="social-item facebook" href="https://www.facebook.com/blck.dtl/" target="_blank" rel="noopener noreferrer"></a>
          <MuiThemeProvider>
            <RaisedButton
              onClick={this.handleClick}
              label="Share"
            />
          </MuiThemeProvider>
          <MuiThemeProvider>
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
        </div>
      </div>
    );
  }
}

export default SocialMedia;
