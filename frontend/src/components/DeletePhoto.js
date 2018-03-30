import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Client from '../Client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const param = 'all';
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

class DeletePhoto extends Component {

  state = {
    images:[],
  };

  componentDidMount = () => {
    Client.getAllImages(param, images => {
      this.setState({
        images: images
      })
    });
  }

  deleteOrRestore = (id, visible) => {
    const visibility = visible === 0 ? 1 : 0;
    Client.deleteImage(id, visibility, () =>{
      Client.getAllImages(param, images => {
        this.setState({
          images: images
        })
      });
    });
  }

  render() {
    const images = this.state.images;
    return (
      <div>
        <MuiThemeProvider muiTheme={muiBlack}>
          <List>
            <Subheader><h1>Manage</h1></Subheader>
            {images.map((item, key) => {
              return(
                <ListItem
                  key = {key}
                  primaryText={item.id + ' | ' + item.tag_1 + ' ' + item.tag_2 + ' ' + item.tag_3}
                  leftAvatar={<Avatar src={item.src} />}
                  rightIcon={<i className="material-icons" onClick={ () => { this.deleteOrRestore(item.id, item.is_visible) }}>{item.is_visible === 0 ? 'restore' : 'delete'}</i>}
                  className={item.is_visible === 0 ? 'disabled' : null}
                />
              );
            })
          }
          </List>
        </MuiThemeProvider>
      </div>
    );
  }
}



export default withRouter(DeletePhoto);
