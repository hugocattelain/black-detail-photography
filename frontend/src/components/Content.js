import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import $ from "jquery";
import HttpsRedirect from "react-https-redirect";

import NotificationPreferences from "./NotificationPreferences";
import Admin from "./Admin";
import Masonry from "./MasonryWall";
import Contact from "./Contact";
import { copyToClipboard } from "../Utils";
import "../styles/content.css";

class Content extends Component {
  componentDidMount = () => {
    $(window).on("keyup", function(e) {
      if (e.keyCode == 44) {
        copyToClipboard();
      }
    });
  };

  render() {
    return (
      <HttpsRedirect>
        <Switch>
          <Route exact path="/photography" component={Masonry} />
          <Route exact path="/" component={Masonry} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/contact" component={Contact} />
          <Route
            exact
            path="/notifications/:email/:subscriptionType"
            component={NotificationPreferences}
          />
          <Route path="/:category&:id" component={Masonry} />
          <Route path="/:category" component={Masonry} />
        </Switch>
      </HttpsRedirect>
    );
  }
}

export default Content;
