import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import {List, ListItem} from '@material-ui/core/List';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment';
import findIndex from 'lodash/findIndex';

import Client from '../Client';
import { Input, InputLabel } from '@material-ui/core';

const param = 'all';
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

class ManagePhoto extends Component {

  state = {
    images:[],
    snackbarIsOpen: false,
    message: "",
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


  updateCategory = (item, name, value) => {
    item[name] = this.props.categories[value].tag;
    Client.updateImage(item, () => {
      Client.getAllImages(param, images => {
        this.setState({
          images: images
        })
      });
    })
  }

  sendNotification = (item) => {
    Client.getEmails().then(response => {
      const emails = response;
      const notifications_data = {
        emails: emails,
        images: [item],
      };
      Client.postNewsletter(notifications_data)
      .then(res => {
        this.setState({
          snackbarIsOpen: true,
          message: "Notification sent"
        });
      })
      .catch(err => {
        this.setState({
          snackbarIsOpen: true,
          message: "Error"
        });
      });
    })
    .catch(err => {
      this.setState({
        snackbarIsOpen: true,
        message: "Error"
      });
    });
  }

  isFirstElement = (item) => {
    const images = this.state.images;
    // eslint-disable-next-line
    return findIndex(images, el => { return el.id == item.id}) === 0;
  }

  isLastElement = (item) => {
    const images = this.state.images;
    // eslint-disable-next-line
    return (findIndex(images, el => { return el.id == item.id}) === (images.length - 1));
  }

  updateCreationDate = (item, action) => {
    const images = this.state.images;
    // eslint-disable-next-line
    const index = findIndex(images, el => { return el.id == item.id});
    let prevImage= images[index-1];
    let nextImage = images[index+1];
    const itemDate = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
    const prevDate = moment(images[index-1].created_at).format("YYYY-MM-DD HH:mm:ss");
    const nextDate = moment(images[index+1].created_at).format("YYYY-MM-DD HH:mm:ss");
    //const lastDate = moment(images[images.length-1].created_at).format("YYYY-MM-DD HH:mm:ss");
    let imagesToUpdate = [];

    switch(action){
      case 'top':
        item.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        imagesToUpdate.push(item);
        break;
      case 'bottom':
        //let d = moment(lastDate).add("1", "hour");
        break;
      case 'up':
        prevImage.created_at = itemDate;
        item.created_at = prevDate;
        imagesToUpdate.push(item, prevImage);
        break;
      case 'down':
        nextImage.created_at = itemDate;
        item.created_at = nextDate;
        imagesToUpdate.push(item, nextImage);
        break;
      default:
        console.log('unknown case');
        break;
    }

    for(let item of imagesToUpdate)
      Client.updateImage(item, () => {
        Client.getAllImages(param, images => {
          this.setState({
            images: images
          })
        });
      });
  }

  render() {
    const images = this.state.images;
    const categories = this.props.categories;
    return (
      <div>

        <MuiThemeProvider theme={muiBlack}>
          <List className="admin__manage__list">
            <h1>Manage {/*<i className="material-icons" onClick={ () => { this.fillWithDate() }}>healing</i>*/}</h1>
            {images.map((item, key) => {
              return(

                <ListItem
                  key = {key}
                  leftAvatar={<Avatar src={item.src.replace('upload','upload/t_web_thumb')} className="admin__manage__list__item__icon" />}
                  className={"admin__manage__list__item " + (item.is_visible === 0 ? 'disabled' : '')}
                >
                  <i className={"material-icons admin__manage__list__item__button " + (this.isFirstElement(item) ? 'hide' : '' )} onClick={ () => { this.updateCreationDate(item, 'top') }}>arrow_upward</i>
                  <i className={"material-icons admin__manage__list__item__button " + (this.isLastElement(item) ? 'hide' : '' )} onClick={ () => { this.updateCreationDate(item, 'bottom') }}>arrow_downward</i>
                  <i className={"material-icons admin__manage__list__item__button " + (this.isFirstElement(item) ? 'hide' : '' )} onClick={ () => { this.updateCreationDate(item, 'up') }}>arrow_drop_up</i>
                  <i className={"material-icons admin__manage__list__item__button " + (this.isLastElement(item) ? 'hide' : '' )} onClick={ () => { this.updateCreationDate(item, 'down') }}>arrow_drop_down</i>
                  <MuiThemeProvider theme={muiBlack}>
                  <InputLabel htmlFor="select-cat-1">Category 1</InputLabel>
                    <Select
                      input={<Input id="select-cat-1" />}
                      required={true}
                      value={item.tag_1}
                      className="admin__manage__list__item__input"
                      onChange={(name,value) => this.updateCategory(item, 'tag_1', value)}
                    >
                      {categories.map((item, key) => {
                        return(<MenuItem key = {key} value={item.tag} >{item.name}</MenuItem>);
                      })}
                    </Select>
                  </MuiThemeProvider>
                  <MuiThemeProvider theme={muiBlack}>
                  <InputLabel htmlFor="select-cat-2">Category 2</InputLabel>
                    <Select
                      input={<Input id="select-cat-2" />}
                      value={item.tag_2}
                      className="admin__manage__list__item__input"
                      onChange={(name,value) => this.updateCategory(item, 'tag_2', value)}
                    >
                      {categories.map((item, key) => {
                        return(<MenuItem key = {key} value={item.tag}>{item.name}</MenuItem>);
                      })}
                    </Select>
                  </MuiThemeProvider>
                  <MuiThemeProvider theme={muiBlack}>
                  <InputLabel htmlFor="select-cat-3">Category 3</InputLabel>
                    <Select
                      input={<Input id="select-cat-3" />}
                      value={item.tag_3}
                      className="admin__manage__list__item__input"
                      onChange={(name,value) => this.updateCategory(item, 'tag_3', value)}
                    >
                      {categories.map((item, key) => {
                        return(<MenuItem key = {key} value={item.tag}>{item.name}</MenuItem>);
                      })}
                    </Select>
                  </MuiThemeProvider>

                  <MuiThemeProvider theme={muiBlack}>
                    <IconButton className="admin__manage__list__item__button" onClick={this.handleOpenModal}>
                      <i className="shake shake-rorate material-icons" onClick={ () => { this.sendNotification(item) }}>notifications</i>
                    </IconButton>
                  </MuiThemeProvider>

                  <MuiThemeProvider theme={muiBlack}>
                    <IconButton className="admin__manage__list__item__button" onClick={this.handleOpenModal}>
                      <i className="material-icons" onClick={ () => { this.deleteOrRestore(item.id, item.is_visible) }}>{item.is_visible === 0 ? 'restore' : 'delete'}</i>
                    </IconButton>
                  </MuiThemeProvider>
                </ListItem>

              );
            })
          }
          </List>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Snackbar
            open={this.state.snackbarIsOpen}
            message={this.state.message}
            autoHideDuration={4000}
            onClose={this.handleSnackbarClose}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}



export default withRouter(ManagePhoto);
