import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import findIndex from 'lodash/findIndex';
import $ from 'jquery';

import Client from '../../Client';
import {
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
} from '@material-ui/core';

const param = 'all';

class ManagePhoto extends Component {
  state = {
    images: [],
    filter: 'All',
    snackbarIsOpen: false,
    message: '',
    colCount: 4,
    showDeleted: false,
  };

  componentDidMount = () => {
    this.updateColCount();
    window.addEventListener('resize', this.updateColCount);
    Client.getImages(param, images => {
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
      Client.getImages(param, images => {
        this.setState({
          images: images,
        });
      });
    });
  };

  updateFilter = event => {
    this.setState({ filter: event.target.value || 'All' });
  };

  handleCheckboxChange = () => {
    this.setState({ showDeleted: !this.state.showDeleted });
  };

  updateCategory = image => event => {
    image[event.target.name] = event.target.value;
    Client.updateImage(image, () => {
      Client.getImages(param, images => {
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

  toggleDetailView = image => event => {
    const images = this.state.images;
    images.forEach(image => (image.edit = false));
    if (image) {
      let index = this.getImageIndex(images, image);
      images[index].edit = !images[index].edit;
    }

    this.setState({ images: images });
  };

  getImageIndex = (images, image) => {
    let index = findIndex(images, el => {
      // eslint-disable-next-line
      return el.id == image.id;
    });
    return index;
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen: false });
  };

  resetIndex = () => {
    Client.resetIndex(this.state.images).then(res => {
      Client.getImages(param, resp => {
        console.log(resp);
      });
    });
  };

  render() {
    const {
      images,
      colCount,
      filter,
      showDeleted,
      snackbarIsOpen,
      message,
    } = this.state;
    const categories = this.props.categories;
    let filteredImages =
      filter === 'All'
        ? images
        : images.filter(
            image =>
              image.tag_1 === filter ||
              image.tag_2 === filter ||
              image.tag_3 === filter
          );
    filteredImages = showDeleted
      ? filteredImages
      : filteredImages.filter(image => image.is_visible === 1);

    return (
      <div>
        <div className="admin__manage__actions">
          <FormControl
            style={{ display: 'flex', minWidth: '170px', marginRight: '15px' }}
          >
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
                  <MenuItem key={key} value={item.tag || 'All'}>
                    {item.name || 'All'}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={showDeleted}
                onChange={this.handleCheckboxChange}
                value="showDeleted"
              />
            }
            label="Show deleted images"
          />

          <Button onClick={this.resetIndex} variant="contained">
            <i className="material-icons icon">settings_backup_restore</i>
            Reset Index
          </Button>
        </div>
        <div className="admin__manage__grid">
          <GridList cellHeight={180} cols={colCount}>
            {filteredImages.map((image, key) => (
              <GridListTile key={key}>
                {!image.edit === true ? (
                  <span>
                    <div
                      className={
                        'grid-view__image ' +
                        (image.is_visible === 0 ? 'disabled' : '')
                      }
                      style={{
                        backgroundImage: `url(${image.src.replace(
                          'upload',
                          'upload/t_web_small'
                        )})`,
                      }}
                    />
                    <GridListTileBar
                      actionIcon={
                        <div>
                          <IconButton className="icon">
                            <i
                              className="material-icons action-icon"
                              onClick={this.toggleDetailView(image)}
                            >
                              edit
                            </i>
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              this.sendNotification(image);
                            }}
                          >
                            <i className="shake shake-rorate material-icons action-icon">
                              notifications
                            </i>
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              this.deleteOrRestore(image.id, image.is_visible);
                            }}
                          >
                            <i className="material-icons action-icon">
                              {image.is_visible === 0 ? 'restore' : 'delete'}
                            </i>
                          </IconButton>
                        </div>
                      }
                    />
                  </span>
                ) : (
                  <div>
                    <i
                      className="material-icons close-icon"
                      onClick={this.toggleDetailView(false)}
                    >
                      clear
                    </i>
                    <FormControl style={{ display: 'flex', marginTop: '30px' }}>
                      <InputLabel htmlFor="category_1">Category 1</InputLabel>
                      <Select
                        value={image.tag_1}
                        onChange={this.updateCategory(image)}
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
                        onChange={this.updateCategory(image)}
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
                        onChange={this.updateCategory(image)}
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
                  </div>
                )}
              </GridListTile>
            ))}
          </GridList>
        </div>

        <Snackbar
          open={snackbarIsOpen}
          message={message}
          autoHideDuration={4000}
          onClose={this.handleSnackbarClose}
        />
      </div>
    );
  }
}

export default withRouter(ManagePhoto);
