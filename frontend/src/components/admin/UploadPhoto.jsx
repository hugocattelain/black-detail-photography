// Libraries
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Client from '../../Client';

// UI Components
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import NewPhoto from './NewPhoto';
import { FormLabel } from '@material-ui/core';

const UploadPhoto = ({ categories, lastIndex }) => {
  const [uploadedFilesUrl, setUploadedFilesUrl] = useState([]);
  const [endUpload, setEndUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [sendNewsletter, setSendNewsletter] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState();

  const onImageDrop = files => {
    setUploadedFile(files);
    setLoading(true);
    handleImageUpload(files);
  };

  const handleImageUpload = files => {
    const filesURL = [];
    const uploaders = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      return axios
        .post(process.env.REACT_APP_CLOUDINARY_UPLOAD_URL, formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then(response => {
          const data = response.data;
          const fileURL = data.secure_url;
          filesURL.push(fileURL);
          setProgress((filesURL.length / files.length) * 100);
        });
    });
    axios.all(uploaders).then(() => {
      setUploadedFilesUrl(filesURL);
      filesURL.forEach((url, index) => initState(url, index));
      setLoading(false);
      setEndUpload(true);
      setProgress(100);
    });
  };

  const initState = (src, index) => {
    const newItem = {
      src: src,
      title: 'Black Detail Photography',
      tag_1: '',
      tag_2: '',
      tag_3: '',
      is_visible: 1,
      image_index: lastIndex + 1 + index,
    };
    setData(data => [...data, newItem]);
  };

  const setInputState = (event, index) => {
    let updatedItem = {};
    const newList = data.map((item, i) => {
      if (i === index) {
        updatedItem = {
          ...item,
          [event.target.name]: event.target.value,
        };
        return updatedItem;
      }
      return item;
    });
    setData(newList);
  };

  const handleSnackbarClose = () => {
    setMessage('');
    setSnackbarIsOpen(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    Client.postImage(data)
      .then(response => {
        setMessage('Image(s) successfully posted');
        setSnackbarIsOpen(true);
        setEndUpload(false);
        if (sendNewsletter) {
          Client.getEmails().then(response => {
            const emails = response;
            const notifications_data = {
              emails: emails,
            };
            Client.getImages('last', images => {
              notifications_data.images = images.slice(0, data.length);
              Client.postNewsletter(notifications_data)
                .then(() => {
                  setMessage('Newsletter successfully sent');
                  setSnackbarIsOpen(true);
                })
                .catch(err => {
                  setMessage(`Error while sending newsletter: ${err}`);
                  setSnackbarIsOpen(true);
                });
            });
          });
        }
      })
      .catch(err => {
        setMessage(`Error while sending newsletter: ${err}`);
        setSnackbarIsOpen(true);
      });
  };

  const newPhotos = uploadedFilesUrl.map((url, key) => {
    const index = key;
    return (
      <NewPhoto
        key={index}
        src={url}
        index={index}
        data={data[index]}
        setInputState={setInputState}
        categories={categories}
      />
    );
  });

  return (
    <div>
      {endUpload && (
        <div>
          <form onSubmit={e => handleSubmit(e)}>
            <FormLabel component='legend'>Send newsletter</FormLabel>
            <Checkbox
              checked={sendNewsletter}
              onChange={e => setSendNewsletter(!sendNewsletter)}
              className='admin__upload__checkbox'
              inputProps={{
                name: 'sendNewsletter',
              }}
            />
            <div className='row'>{newPhotos}</div>
            <div className='row'>
              <div className='col-xs-12'>
                <Button variant='contained' type='submit' color='primary'>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
      {!endUpload && !loading && (
        <div className='admin__upload-wrapper'>
          <Dropzone multiple accept='image/*' onDrop={onImageDrop}>
            <h1>Upload</h1>
          </Dropzone>
        </div>
      )}
      {loading && (
        <div>
          {uploadedFile.lenght > 1 ? (
            <CircularProgress
              size={30}
              thickness={2}
              mode='determinate'
              value={progress}
            />
          ) : (
            <CircularProgress size={30} thickness={2} />
          )}
        </div>
      )}
      <Snackbar
        open={snackbarIsOpen}
        message={message}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

UploadPhoto.propTypes = {
  newPhotos: PropTypes.element,
};

export default UploadPhoto;
