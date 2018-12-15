import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

//import Avatar from '@material-ui/core/Avatar';
//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import findIndex from 'lodash/findIndex';
import { getElementByImageIndex } from '../../Utils';
import $ from 'jquery';

import Client from '../../Client';
import { InputLabel, FormControl } from '@material-ui/core';

const param = 'all';
const increment = process.env.NODE_ENV === 'production' ? 10 : 1;

class ManagePhoto extends Component {
  state = {
    images: [],
    imageToEdit: null,
    filter: '',
    snackbarIsOpen: false,
    message: '',
    colCount: 4,
  };

  componentDidMount = () => {
    this.updateColCount();
    window.addEventListener('resize', this.updateColCount);
    Client.getAllImages(param, images => {
      images.forEach(image => {
        image.edit = false;
      });
      this.setState({
        images: images,
      });
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateColCount);
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
          images: images,
        });
      });
    });
  };

  updateFilter = event => {
    this.setState({ filter: event.target.value });
  };

  updateCategory = event => {
    const imageToEdit = this.state.imageToEdit;
    imageToEdit[event.target.name] = event.target.value;
    Client.updateImage(imageToEdit, () => {
      Client.getAllImages(param, images => {
        this.setState({
          images: images,
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
          images: [item],
        };
        Client.postNewsletter(notifications_data)
          .then(res => {
            this.setState({
              snackbarIsOpen: true,
              message: 'Notification sent',
            });
          })
          .catch(err => {
            this.setState({
              snackbarIsOpen: true,
              message: 'Error: ' + err,
            });
          });
      })
      .catch(err => {
        this.setState({
          snackbarIsOpen: true,
          message: 'Error' + err,
        });
      });
  };

  isFirstElement = item => {
    const images = this.state.images;
    // eslint-disable-next-line
    return (
      findIndex(images, el => {
        // eslint-disable-next-line
        return el.id == item.id;
      }) === 0
    );
  };

  isLastElement = item => {
    const images = this.state.images;
    return (
      findIndex(images, el => {
        // eslint-disable-next-line
        return el.id == item.id;
      }) ===
      images.length - 1
    );
  };

  updateOrder = (item, action) => event => {
    let images = this.state.images;
    images =
      this.state.filter === ''
        ? images
        : images.filter(image => image.tag_1 === this.state.filter);

    // eslint-disable-next-line
    const index = this.getImageIndex(images, item);
    // eslint-disable-next-line
    let prevImage = images[index - 1];
    // eslint-disable-next-line
    let nextImage = images[index + 1];
    const itemIndex = item.image_index;
    const prevIndex = images[index - 1].image_index;
    const nextIndex = images[index + 1].image_index;
    const firstIndex = images[0].image_index;
    const lastIndex = images[images.length - 1].image_index;
    let imagesToUpdate = [];

    switch (action) {
      case 'top':
        item.image_index = firstIndex;
        imagesToUpdate.push(item);
        for (var i = firstIndex; i > itemIndex; i--) {
          const imageToUpdate = getElementByImageIndex(i, images);
          imageToUpdate.image_index = imageToUpdate.image_index - increment;
          imagesToUpdate.push(imageToUpdate);
        }
        break;
      case 'bottom':
        //let d = moment(lastDate).add("1", "hour");
        break;
      case 'up':
        /* prevImage.image_index = itemDate;
        item.image_index = prevDate;
        imagesToUpdate.push(item, prevImage); */
        break;
      case 'down':
        /* nextImage.image_index = itemDate;
        item.image_index = nextDate;
        imagesToUpdate.push(item, nextImage); */
        break;
      default:
        console.log('unknown case');
        break;
    }

    /* for (let item of imagesToUpdate)
      Client.updateImage(item, () => {
        Client.getAllImages(param, images => {
          this.setState({
            images: images,
          });
        });
      }); */
  };

  toggleDetailView = image => event => {
    const images = this.state.images;
    images.forEach(image => (image.edit = false));
    let index = this.getImageIndex(images, image);

    images[index].edit = !images[index].edit;

    this.setState({ images: images, imageToEdit: image });
  };

  getImageIndex = (images, image) => {
    let index = findIndex(images, el => {
      // eslint-disable-next-line
      return el.id == image.id;
    });
    return index;
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

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen: false });
  };

  render() {
    const { images, colCount, filter } = this.state;
    const categories = this.props.categories;
    const filteredImages =
      filter === '' ? images : images.filter(image => image.tag_1 === filter);

    return (
      <div>
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

                    <IconButton className="admin__manage__list__item__button" onClick={this.handleOpenModal}>
                      <i className="shake shake-rorate material-icons" onClick={ () => { this.sendNotification(item) }}>notifications</i>
                    </IconButton>
                    <IconButton className="admin__manage__list__item__button" onClick={this.handleOpenModal}>
                      <i className="material-icons" onClick={ () => { this.deleteOrRestore(item.id, item.is_visible) }}>{item.is_visible === 0 ? 'restore' : 'delete'}</i>
                    </IconButton>
                  </ListItemText>
                </ListItem>

              );
            })
          }
          </List> */}
        <FormControl style={{ display: 'flex' }}>
          <InputLabel htmlFor="filter">Filter category</InputLabel>
          <Select
            value={filter}
            onChange={this.updateFilter}
            inputProps={{
              name: 'filter',
              id: 'filter',
            }}
          >
            {categories.map((item, key) => {
              return (
                <MenuItem key={key} value={item.tag}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <GridList cellHeight={180} cols={colCount}>
          {filteredImages.map((image, key) => (
            <GridListTile key={key}>
              {!image.edit === true ? (
                <span>
                  <div
                    className="grid-view__image"
                    style={{
                      backgroundImage: `url(${image.src.replace(
                        'upload',
                        'upload/t_web_small'
                      )})`,
                    }}
                  />
                  <GridListTileBar
                    actionIcon={
                      <IconButton
                        className="icon"
                        onClick={this.toggleDetailView(image)}
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
                  <FormControl style={{ display: 'flex' }}>
                    <InputLabel htmlFor="category_1">Category 1</InputLabel>
                    <Select
                      value={image.tag_1}
                      onChange={this.updateCategory}
                      inputProps={{
                        name: 'tag_1',
                        id: 'category_1',
                        image: image,
                      }}
                    >
                      {categories.map((item, key) => {
                        return (
                          <MenuItem key={key} value={item.tag}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl style={{ display: 'flex' }}>
                    <InputLabel htmlFor="category_2">Category 2</InputLabel>
                    <Select
                      value={image.tag_2}
                      onChange={this.updateCategory}
                      inputProps={{
                        name: 'tag_2',
                        id: 'category_2',
                        image: image,
                      }}
                    >
                      {categories.map((item, key) => {
                        return (
                          <MenuItem key={key} value={item.tag}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl style={{ display: 'flex' }}>
                    <InputLabel htmlFor="category_3">Category 3</InputLabel>
                    <Select
                      value={image.tag_3}
                      onChange={this.updateCategory}
                      inputProps={{
                        name: 'tag_3',
                        id: 'category_3',
                        image: image,
                      }}
                    >
                      {categories.map((item, key) => {
                        return (
                          <MenuItem key={key} value={item.tag}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <IconButton
                    className="admin__manage__list__item__button"
                    onClick={() => {
                      this.deleteOrRestore(image.id, image.is_visible);
                    }}
                  >
                    <i className="material-icons">
                      {image.is_visible === 0 ? 'restore' : 'delete'}
                    </i>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      this.sendNotification(image);
                    }}
                  >
                    <i className="shake shake-rorate material-icons">
                      notifications
                    </i>
                  </IconButton>
                  <i
                    className={
                      'material-icons admin__manage__list__item__button ' +
                      (this.isFirstElement(image) ? 'hide' : '')
                    }
                    onClick={this.updateOrder(image, 'top')}
                  >
                    arrow_upward
                  </i>
                  <i
                    className={
                      'material-icons admin__manage__list__item__button ' +
                      (this.isLastElement(image) ? 'hide' : '')
                    }
                    onClick={this.updateOrder(image, 'bottom')}
                  >
                    arrow_downward
                  </i>
                  <i
                    className={
                      'material-icons admin__manage__list__item__button ' +
                      (this.isFirstElement(image) ? 'hide' : '')
                    }
                    onClick={this.updateOrder(image, 'up')}
                  >
                    arrow_drop_up
                  </i>
                  <i
                    className={
                      'material-icons admin__manage__list__item__button ' +
                      (this.isLastElement(image) ? 'hide' : '')
                    }
                    onClick={this.updateOrder(image, 'down')}
                  >
                    arrow_drop_down
                  </i>
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
      </div>
    );
  }
}

export default withRouter(ManagePhoto);
