import React, { Component } from 'react';
import UploadPhoto from './UploadPhoto';
import DeletePhoto from './DeletePhoto';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import '../styles/admin.css';

const categories = [
  {name: '', tag: ''},
  {name: 'Architecture', tag: 'architecture'},
  {name: 'Portrait', tag: 'portrait'},
  {name: 'Nude', tag: 'nsfw'},
  {name: 'Black and white', tag: 'bnw'},
];

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
    const isAdmin = this.state.adminPassword === process.env.REACT_APP_ADMIN_PASSWORD ? true : false;
    return (
      <div className="container admin">
         {isAdmin ? (
          <div className="row">
            <div className="col-xs-12">
              <UploadPhoto categories={categories}/>
            </div>
            <div className=" col-xs-12">
              <DeletePhoto categories={categories}/>
            </div>
          </div>
        ) : (
          <MuiThemeProvider muiTheme={muiBlack}>
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
    );
  }
}

export default Admin;
