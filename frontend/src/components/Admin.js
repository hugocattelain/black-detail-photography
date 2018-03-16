import React, { Component } from 'react';
import UploadPhoto from './UploadPhoto';
import DeletePhoto from './DeletePhoto';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import '../styles/admin.scss'
class Admin extends Component {

  state = {
    adminPassword: '',
  };

  shouldComponentUpdate = (nextProps, nextState) => {
      if (nextState.adminPassword !== this.state.adminPassword){
        return true;
      }
      return false;
  }

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value});
  }

  render() {
    const isAdmin = this.state.adminPassword === process.env.BDP_ADMIN_PASSWORD ? true : false;
    return (
      <div className="outer__container">
        <div className="container">
          {isAdmin ? (
            <div className="row">
              <div className="col-xs-12">
                <UploadPhoto />
              </div>
              <div className=" col-xs-12">
                <DeletePhoto />
              </div>
            </div>
          ) : (
            <MuiThemeProvider>
              <TextField
                floatingLabelText="Password"
                type='password'
                required={true}
                value={ this.state.adminPassword }
                onChange={(e) => this.setInputState(e, 'adminPassword')}
              />
            </MuiThemeProvider>
          )
          }
        </div>
      </div>
    );
  }
}

export default Admin;
