import React, { Component } from "react";
import UploadPhoto from "./UploadPhoto";
import ManagePhoto from "./ManagePhoto";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import "../styles/admin.css";
import { AppBar, Tabs, Tab, Typography } from "@material-ui/core";

const categories = [
  { name: "", tag: "" },
  { name: "Architecture", tag: "architecture" },
  { name: "Portrait", tag: "portrait" },
  { name: "Nude", tag: "nsfw" }
];

const muiBlack = createMuiTheme({
  palette: {
    primary: {
      main: "#212121"
    },
    secondary: {
      main: "#616161"
    }
  }
});
class Admin extends Component {
  state = {
    adminPassword: "",
    tab: 1
  };

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab: tab });
  };

  render() {
    const { tab } = this.state;
    const isAdmin =
      this.state.adminPassword === process.env.REACT_APP_ADMIN_PASSWORD ||
      process.env.NODE_ENV === "development";
    return (
      <div className="container admin">
        {isAdmin ? (
          <div className="row">
            <MuiThemeProvider theme={muiBlack}>
              <AppBar position="static">
                <Tabs value={tab} onChange={this.handleTabChange}>
                  <Tab label="Upload" />
                  <Tab label="Manage" />
                </Tabs>
              </AppBar>
            </MuiThemeProvider>
            {tab === 0 && (
              <Typography component="div">
                <UploadPhoto categories={categories} />
              </Typography>
            )}
            {tab === 1 && (
              <Typography component="div">
                <ManagePhoto categories={categories} />
              </Typography>
            )}
          </div>
        ) : (
          <MuiThemeProvider theme={muiBlack}>
            <TextField
              label="Password"
              type="password"
              required={true}
              value={this.state.adminPassword}
              onChange={e => this.setInputState(e, "adminPassword")}
            />
          </MuiThemeProvider>
        )}
      </div>
    );
  }
}

export default Admin;
