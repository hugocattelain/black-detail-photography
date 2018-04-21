import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNotifications from 'react-browser-notifications';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import isEqual from 'lodash/isEqual';
import '../images/BDP_logo.jpg';
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

class WebNotifications extends Component {


  showNotifications = () => {
    // If the Notifications API is supported by the browser
    // then show the notification
    if(this.n.supported()) this.n.show();
  }
  componentDidMount = () => {
    console.log(this.props);
    this.showNotifications();
  }
  componentWillReceiveProps = (nextProps) => {
    console.log(this.props);
    console.log(nextProps);
    if (!isEqual(this.props, nextProps)){
      console.log(this.props);
      console.log(nextProps);
      this.showNotifications();
    }
  }

  handleClick = (event) => {
    // Do something here such as
    // console.log("Notification Clicked") OR
    // window.focus() OR
    // window.open("http://www.google.com")

    // Lastly, Close the notification
    window.open(this.props.url);
    this.n.close(event.target.tag);
  }

  render() {
    return (
      <div>

        <ReactNotifications
          onRef={ref => (this.n = ref)}
          title={this.props.title}
          body={this.props.body}
          icon={this.props.icon}
          timeout={this.props.timeout}
          tag="abcdef"
          onClick={event => this.handleClick(event)}
        />



      </div>
    )
  }
}

WebNotifications.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  timeout: PropTypes.number,
  icon: PropTypes.any,
  url: PropTypes.string.isRequired,
};

WebNotifications.defaultProps = {
  title: "Black Detail",
  body: "New photo. Check this out !",
  timeout:0,
  icon: "http://res.cloudinary.com/dmdkvle30/image/upload/v1522340826/BDP_logo_fvxjfb.jpg",
  url: "http://www.black-detail.com/curves"
};

export default WebNotifications;
