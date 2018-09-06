import React, { Component } from "react";
import { withRouter } from "react-router";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";

import moment from "moment";
import findIndex from "lodash/findIndex";
import $ from "jquery";

import Client from "../Client";
import {
  Input,
  InputLabel,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox
} from "@material-ui/core";

const param = "all";
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

class ManagePhoto extends Component {
  state = {
    images: [],
    image: null,
    categories: [],
    snackbarIsOpen: false,
    message: "",
    colCount: 4
  };

  componentDidMount = () => {
    this.updateColCount();
    window.addEventListener("resize", this.updateColCount);
    Client.getAllImages(param, images => {
      images.forEach(image => {
        image.edit = false;
      });
      this.setState({
        images: images
      });
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateColCount);
  };

  updateColCount = () => {
    if ($(window).width() < 576) {
      this.setState({ colCount: 2 });
      return;
    }
    if ($(window).width() < 768) {
      this.setState({ colCount: 3 });
      return;
    } else {
      this.setState({ colCount: 4 });
    }
  };

  deleteOrRestore = (id, visible) => {
    const visibility = visible === 0 ? 1 : 0;
    Client.deleteImage(id, visibility, () => {
      Client.getAllImages(param, images => {
        this.setState({
          images: images
        });
      });
    });
  };

  updateCategory = (item, name, value) => {
    item[name] = this.props.categories[value].tag;
    Client.updateImage(item, () => {
      Client.getAllImages(param, images => {
        this.setState({
          images: images
        });
      });
    });
  };

  sendNotification = item => {
    Client.getEmails()
      .then(response => {
        const emails = response;
        const notifications_data = {
          emails: emails,
          images: [item]
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
              message: "Error: " + err
            });
          });
      })
      .catch(err => {
        this.setState({
          snackbarIsOpen: true,
          message: "Error" + err
        });
      });
  };

  isFirstElement = item => {
    const images = this.state.images;
    // eslint-disable-next-line
    return (
      findIndex(images, el => {
        return el.id == item.id;
      }) === 0
    );
  };

  isLastElement = item => {
    const images = this.state.images;
    // eslint-disable-next-line
    return (
      findIndex(images, el => {
        return el.id == item.id;
      }) ===
      images.length - 1
    );
  };

  updateCreationDate = (item, action) => {
    const images = this.state.images;
    // eslint-disable-next-line
    const index = findIndex(images, el => {
      return el.id == item.id;
    });
    let prevImage = images[index - 1];
    let nextImage = images[index + 1];
    const itemDate = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
    const prevDate = moment(images[index - 1].created_at).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const nextDate = moment(images[index + 1].created_at).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    //const lastDate = moment(images[images.length-1].created_at).format("YYYY-MM-DD HH:mm:ss");
    let imagesToUpdate = [];

    switch (action) {
      case "top":
        item.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        imagesToUpdate.push(item);
        break;
      case "bottom":
        //let d = moment(lastDate).add("1", "hour");
        break;
      case "up":
        prevImage.created_at = itemDate;
        item.created_at = prevDate;
        imagesToUpdate.push(item, prevImage);
        break;
      case "down":
        nextImage.created_at = itemDate;
        item.created_at = nextDate;
        imagesToUpdate.push(item, nextImage);
        break;
      default:
        console.log("unknown case");
        break;
    }

    for (let item of imagesToUpdate)
      Client.updateImage(item, () => {
        Client.getAllImages(param, images => {
          this.setState({
            images: images
          });
        });
      });
  };

  toggleDetailView = image => {
    const images = this.state.images;
    let index = findIndex(this.state.images, el => {
      return el.id == image.id;
    });
    images[index].edit = !images[index].edit;
    if (images[index].edit) {
      this.setState({ image: images[index] });
    }
    this.setState({ images });
  };

  hasCategory = category => {
    if (
      this.state.image.tag_1 === category.tag ||
      this.state.image.tag_2 === category.tag ||
      this.state.image.tag_3 === category.tag
    ) {
      return true;
    }
    return false;
  };

  handleSelectionChange = event => {
    this.setState({ categories: event.target.value });
    console.log(this.state.categories);
  };

  render() {
    const { images, colCount } = this.state;
    const categories = this.props.categories;

    return (
      <div>
        <MuiThemeProvider theme={muiBlack}>
          {/* <List className="admin__manage__list">
            {images.map((item, key) => {
              return(
                
                <ListItem
                  key = {key}
                  className={"admin__manage__list__item " + (item.is_visible === 0 ? 'disabled' : '')}
                >
                <Avatar src={item.src.replace('upload','upload/t_web_thumb')} className="admin__manage__list__item__icon" />
                <ListItemText>
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
                  </ListItemText>
                </ListItem>

              );
            })
          }
          </List> */}

          <GridList cellHeight={180} cols={colCount}>
            {images.map((image, key) => (
              <GridListTile key={key}>
                {!image.edit === true ? (
                  <span>
                    {/* <img src={image.src} alt="Manage photos" />
                 */}
                    <div
                      className="grid-view__image"
                      style={{
                        backgroundImage: `url(${image.src})`
                      }}
                    />
                    <GridListTileBar
                      title="title"
                      subtitle={<span>subtitle {image.edit}</span>}
                      actionIcon={
                        <IconButton
                          className="icon"
                          onClick={this.toggleDetailView.bind(this, image)}
                        >
                          <i className="material-icons edit-icon">edit</i>
                        </IconButton>
                      }
                    />
                  </span>
                ) : (
                  <div>
                    <i
                      className="material-icons close-icon"
                      onClick={this.toggleDetailView.bind(this, image)}
                    >
                      clear
                    </i>
                    <InputLabel htmlFor="select-multiple-checkbox">
                      Tag
                    </InputLabel>
                    <Select
                      multiple
                      value={this.state.categories}
                      onChange={this.handleSelectionChange}
                      input={<Input id="select-multiple-checkbox" />}
                      renderValue={selected => selected.join(", ")}
                    >
                      {categories.map((category, key) => (
                        <MenuItem key={key} value={category.name}>
                          <Checkbox checked={this.hasCategory(category)} />
                          <ListItemText primary={category.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                )}
              </GridListTile>
            ))}
          </GridList>

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
