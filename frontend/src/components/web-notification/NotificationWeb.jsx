// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNotifications from 'react-browser-notifications';

// Utils
import isEqual from 'lodash/isEqual';

// Assets
import '@images/BDP_logo.jpg';

class NotificationWeb extends Component {
  state = {
    a: 1,
    b: 'bbb',
  };
  showNotifications = () => {
    // If the Notifications API is supported by the browser
    // then show the notification
    if (this.n.supported()) this.n.show();
  };
  componentDidMount = () => {
    this.showNotifications();
  };
  componentWillReceiveProps = nextProps => {
    if (!isEqual(this.props, nextProps)) {
      this.showNotifications();
    }
  };

  handleClick = event => {
    // Do something here such as
    // console.log("Notification Clicked") OR
    // window.focus() OR
    // window.open("http://www.google.com")

    // Lastly, Close the notification
    window.open(this.props.url);
    this.n.close(event.target.tag);
  };

  render() {
    return (
      <div>
        <ReactNotifications
          onRef={ref => (this.n = ref)}
          title={this.props.title}
          body={this.props.body}
          icon={this.props.icon}
          timeout={this.props.timeout}
          tag='abcdef'
          onClick={event => this.handleClick(event)}
        />
      </div>
    );
  }
}

NotificationWeb.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  timeout: PropTypes.number,
  icon: PropTypes.any,
  url: PropTypes.string.isRequired,
};

NotificationWeb.defaultProps = {
  title: 'Black Detail',
  body: 'New photo. Check this out !',
  timeout: 0,
  icon:
    'http://res.cloudinary.com/dmdkvle30/image/upload/v1522340826/BDP_logo_fvxjfb.jpg',
  url: 'http://www.black-detail.com/curves',
};

export default NotificationWeb;
