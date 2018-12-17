import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Client from '../../Client';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import NewPhoto from './NewPhoto';
// import WebNotifications from './NotificationWeb';
import { FormLabel } from '@material-ui/core';

class UploadPhoto extends Component {
  state = {
    uploadedFilesUrl: [],
    endUpload: false,
    loading: false,
    progress: 0,
    data: [],
    sendNewsletter: false,
    snackbarIsOpen: false,
    message: '',
  };

  onImageDrop = files => {
    this.setState({
      uploadedFile: files,
      loading: true,
    });
    this.handleImageUpload(files);
  };

  handleImageUpload = files => {
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
          this.setState({ progress: (filesURL.length / files.length) * 100 });
        });
    });
    axios.all(uploaders).then(() => {
      this.setState({
        uploadedFilesUrl: filesURL,
        loading: false,
        endUpload: true,
        progress: 100,
        notification_data: {},
        showNotification: false,
      });
    });
  };

  initState(src, index) {
    const data = this.state.data;
    data.push({
      src: src,
      title: 'Black Detail Photography',
      tag_1: '',
      tag_2: '',
      tag_3: '',
      is_visible: 1,
      image_index: this.props.lastIndex + 1 + index,
    });
    this.setState({ data: data });
  }

  setInputState = (name, index) => event => {
    const data = this.state.data;
    const input = data[index];
    input[name] = event.target.value;
    data.slice(index, 0, input);
    this.setState({ data: data });
  };

  setSelectState = (index, event) => {
    const data = this.state.data;
    const input = data[index];
    input[event.target.name] = event.target.value;
    data.slice(index, 0, input);
    this.setState({ data: data });
  };

  handleSnackbarClose = () => {
    this.setState({
      message: '',
      snackbarIsOpen: false,
    });
  };

  handleCheckboxChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSubmit = event => {
    event.preventDefault();
    Client.postImage(this.state.data)
      .then(response => {
        this.setState({
          notification_data: response,
          //showNotification: true,
          message: 'Image(s) successfully posted',
          snackbarIsOpen: true,
          endUpload: false,
        });
        if (this.state.sendNewsletter) {
          Client.getEmails().then(response => {
            const emails = response;
            const notifications_data = {
              emails: emails,
              images: this.state.data,
            };
            Client.postNewsletter(notifications_data)
              .then(() => {
                this.setState({
                  message: 'Newsletter successfully sent',
                  snackbarIsOpen: true,
                });
              })
              .catch(err => {
                this.setState({
                  message: 'Error while sending newsletter: ' + err,
                  snackbarIsOpen: true,
                });
              });
          });
        }
      })
      .catch(err => {
        this.setState({
          message: 'Error while posting image(s): ' + err,
          snackbarIsOpen: true,
        });
      });
  };

  render() {
    const { uploadedFilesUrl, endUpload, loading, data } = this.state;
    const { categories } = this.props;

    const newPhotos = uploadedFilesUrl.map((url, key) => {
      const index = key;

      return (
        <NewPhoto
          key={index}
          src={url}
          index={index}
          data={data[index]}
          setInputState={this.setInputState.bind(this)}
          setSelectState={this.setSelectState.bind(this)}
          initState={this.initState.bind(this)}
          categories={categories}
        />
      );
    });

    return (
      <div>
        {endUpload ? (
          <div>
            <form onSubmit={this.handleSubmit}>
              <FormLabel component="legend">Send newsletter</FormLabel>
              <Checkbox
                checked={this.state.sendNewsletter}
                onChange={this.handleCheckboxChange('sendNewsletter')}
                className="admin__upload__checkbox"
                value="sendNewsletter"
              />
              {newPhotos}
              <div className="row">
                <div className="col-xs-12">
                  <Button variant="contained" type="submit" color="primary">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin__upload-wrapper">
            <Dropzone
              multiple
              accept="image/*"
              onDrop={this.onImageDrop.bind(this)}
            >
              <h1>Upload</h1>
            </Dropzone>
          </div>
        )}
        {loading && (
          <div>
            {this.state.uploadedFile.lenght > 1 ? (
              <CircularProgress
                size={30}
                thickness={2}
                mode="determinate"
                value={this.state.progress}
              />
            ) : (
              <CircularProgress size={30} thickness={2} />
            )}
          </div>
        )}
        {/*

          <WebNotifications
            title="New photo on Black Detail"
            body="Come check this out !"
            timeout={4000}
            url={"http://www.black-detail.com/" + getCategoryAlias(this.state.notification_data.tag_1)}/>


        */}
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

UploadPhoto.propTypes = {
  newPhotos: PropTypes.element,
};

export default UploadPhoto;
