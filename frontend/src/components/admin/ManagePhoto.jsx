// Libraries
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Client from '../../Client';
import $ from 'jquery';

// UI Components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

const param = 'all';

const ManagePhoto = ({ categories }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [filter, setFilter] = useState('All');
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [colCount, setColCount] = useState(4);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    Client.getImages(param, res => {
      res.forEach(image => {
        image.edit = false;
      });
      setImages(res);
      setFilteredImages(
        res.filter(
          item => showDeleted || (!showDeleted && item.is_visible === 1)
        )
      );
    });
    updateColCount();
    window.addEventListener('resize', updateColCount);

    return () => {
      window.removeEventListener('resize', updateColCount);
    };
  }, []);

  useEffect(() => {
    let newList =
      filter === 'All'
        ? images
        : images.filter(
            image =>
              image.tag_1 === filter ||
              image.tag_2 === filter ||
              image.tag_3 === filter
          );
    newList = newList.filter(
      item => showDeleted || (!showDeleted && item.is_visible === 1)
    );
    setFilteredImages(newList);
  }, [showDeleted, filter]);

  const updateColCount = () => {
    let columnsCount;
    if ($(window).width() < 576) {
      columnsCount = 2;
    } else if ($(window).width() < 768) {
      columnsCount = 3;
    } else {
      columnsCount = 4;
    }
    setColCount(columnsCount);
  };

  const deleteOrRestore = (event, id, visible) => {
    const visibility = visible === 0 ? 1 : 0;
    Client.deleteImage(id, visibility).then(() => {
      Client.getImages(param, res => {
        res.forEach(image => {
          image.edit = false;
        });
        setFilteredImages(res);
      });
    });
  };

  const updateCategory = (event, image) => {
    let updatedItem = {};
    const newList = filteredImages.map(item => {
      if (item.id === image.id) {
        updatedItem = {
          ...item,
          [event.target.name]: event.target.value,
        };
        return updatedItem;
      }
      return item;
    });
    Client.updateImage(updatedItem).then(() => {
      Client.getImages(param, res => {
        setImages(newList);
        setFilteredImages(newList);
      });
    });
  };

  const sendNotification = (event, item) => {
    Client.getEmails()
      .then(response => {
        const emails = response;
        const notifications_data = {
          emails: emails,
          images: [item],
        };
        Client.postNewsletter(notifications_data)
          .then(res => {
            setSnackbarIsOpen(true);
            setMessage('Notification sent');
          })
          .catch(err => {
            setSnackbarIsOpen(true);
            setMessage(`Error : ${err}`);
          });
      })
      .catch(err => {
        setSnackbarIsOpen(true);
        setMessage(`Error : ${err}`);
      });
  };

  const toggleDetailView = (e, id) => {
    const newList = filteredImages.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          edit: !item.edit,
        };

        return updatedItem;
      }
      return item;
    });
    setFilteredImages(newList);
  };

  return (
    <div>
      <div className='admin__manage__actions'>
        <FormControl
          style={{ display: 'flex', minWidth: '170px', marginRight: '15px' }}
        >
          <InputLabel htmlFor='filter'>Filter category</InputLabel>
          <Select
            value={filter}
            onChange={e => setFilter(e.target.value || 'All')}
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
              onChange={e => setShowDeleted(!showDeleted)}
            />
          }
          label='Show deleted images'
        />
      </div>
      <div className='admin__manage__grid'>
        <GridList cellHeight={180} cols={colCount}>
          {filteredImages.map((image, key) => (
            <GridListTile key={key}>
              {image.edit === false ? (
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
                        <IconButton className='icon'>
                          <i
                            className='material-icons action-icon'
                            onClick={e => toggleDetailView(e, image.id)}
                          >
                            edit
                          </i>
                        </IconButton>
                        <IconButton onClick={e => sendNotification(e, image)}>
                          <i className='shake shake-rorate material-icons action-icon'>
                            notifications
                          </i>
                        </IconButton>
                        <IconButton
                          onClick={e =>
                            deleteOrRestore(e, image.id, image.is_visible)
                          }
                        >
                          <i className='material-icons action-icon'>
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
                    className='material-icons close-icon'
                    onClick={e => toggleDetailView(e, image.id)}
                  >
                    clear
                  </i>
                  <FormControl style={{ display: 'flex', marginTop: '30px' }}>
                    <InputLabel htmlFor='category_1'>Category 1</InputLabel>
                    <Select
                      value={image.tag_1}
                      onChange={e => updateCategory(e, image)}
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
                    <InputLabel htmlFor='category_2'>Category 2</InputLabel>
                    <Select
                      value={image.tag_2}
                      onChange={e => updateCategory(e, image)}
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
                    <InputLabel htmlFor='category_3'>Category 3</InputLabel>
                    <Select
                      value={image.tag_3}
                      onChange={e => updateCategory(e, image)}
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
        onClose={e => setSnackbarIsOpen(false)}
      />
    </div>
  );
};

export default withRouter(ManagePhoto);
