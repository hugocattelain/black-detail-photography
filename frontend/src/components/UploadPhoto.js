import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Client from '../Client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import NewPhoto from './NewPhoto';
// import WebNotifications from './NotificationWeb';
// eslint-disable-next-line
import { getCategoryAlias } from '../Utils';

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

class UploadPhoto extends Component {

  state = {
    uploadedFilesUrl: [],
    endUpload: false,
    loading:false,
    progress:0,
    data:[],
    sendNewsletter: false,
    snackbarIsOpen: false,
    message: '',
  };

  onImageDrop = (files) => {
    this.setState({
      uploadedFile: files,
      loading:true,
    });
    this.handleImageUpload(files);
  }

  handleImageUpload = files => {
    const filesURL = [];
    const uploaders = files.map(file => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      return axios.post(process.env.REACT_APP_CLOUDINARY_UPLOAD_URL,formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then(response => {
        const data=response.data;
        const fileURL = data.secure_url;
        filesURL.push(fileURL);
        this.setState({ progress: filesURL.length/files.length*100 });
      });
    });
    axios.all(uploaders).then(() => {
      this.setState({
        uploadedFilesUrl: filesURL,
        loading:false,
        endUpload: true,
        progress :100,
        notification_data: {},
        //showNotification: false
      });

    });
  }

  initState = (src, index) => {
    const data= this.state.data;
    data.push({src: src, title: 'Black Detail Photography', tag_1: '',tag_2: '',tag_3: '', is_visible: 1});
    this.setState({ data: data });
  }

  setInputState = (event, name, index) => {
    const data= this.state.data;
    const input = data[index];
    input[name] = event.target.value;
    data.slice(index, 0, input);
    this.setState({ data: data });
  }

  setSelectState = (name, value, index) => {
    const data= this.state.data;
    const input = data[index];
    input[name] = value;
    data.slice(index, 0, input);
    this.setState({ data: data });
  }

  handleSnackbarClose = () => {
    this.setState({
      message: "",
      snackbarIsOpen: false,
    });
  }

  handleCheckboxChange = (event, name) => {
    console.log(event, name);
    this.setState({ [name]: event.target.checked });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    Client.postImage(this.state.data)
    .then(response => {
      this.setState({
        notification_data: response,
        //showNotification: true,
        message: "Success",
        snackbarIsOpen: true,
        uploadEnded:false,
      });
      if(this.state.sendNewsletter){
        Client.getEmails()
        .then(response => {
          const emails = response;
          const notifications_data = {
            emails: emails,
            images: this.state.data
          };
          Client.postNewsletter(notifications_data)
          .then(response => {
          })
          .catch(err => {
            this.setState({
              message: "Error while sending newsletter: " + err,
              snackbarIsOpen: true,
            });
          });
        });
      }
    });
  }

  render() {
    const { uploadedFilesUrl, endUpload, loading} = this.state;
    const { categories } = this.props;
    //let showNotification = this.state.showNotification;

    const newPhotos = uploadedFilesUrl.map((url, key) => {
      const index=key;
      return(
        <NewPhoto
          key={key}
          index={index}
          url={url}
          data={this.state.data}
          setInputState={this.setInputState}
          setSelectState={this.setSelectState}
          initState={this.initState}
          categories={categories}
        />);
    });

    return (
      <div>
        {endUpload ? (
          <div>
            <form onSubmit={this.handleSubmit}>
            <MuiThemeProvider muiTheme={muiBlack}>
              <Checkbox
                checked={this.state.sendNewsletter}
                onCheck={(e) => this.handleCheckboxChange(e,'sendNewsletter')}
                label="Send newsletter"
                className="admin__upload__checkbox"
              />
            </MuiThemeProvider>
              {newPhotos}
              <div className="row">
                <div className="col-xs-12">
                  <MuiThemeProvider muiTheme={muiBlack}>
                    <RaisedButton type="submit" label="Submit" primary={true} />
                  </MuiThemeProvider>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin__upload__wrapper">
            <Dropzone
              multiple
              accept="image/*"
              onDrop={this.onImageDrop.bind(this)}
            >
              <h1>Upload</h1>
            </Dropzone>
          </div>
        )}
        { loading && (
          <MuiThemeProvider muiTheme={muiBlack}>
          { this.state.uploadedFile.lenght>1 ? (
            <CircularProgress
              size={30}
              thickness={2}
              mode="determinate"
              value={this.state.progress}
            />
          ) : (
            <CircularProgress
              size={30}
              thickness={2}
            />
          )}
          </MuiThemeProvider>
        )}
        {/*

          <WebNotifications
            title="New photo on Black Detail"
            body="Come check this out !"
            timeout={4000}
            url={"http://www.black-detail.com/" + getCategoryAlias(this.state.notification_data.tag_1)}/>


        */}
        <MuiThemeProvider>
          <Snackbar
            open={this.state.snackbarIsOpen}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarClose}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

UploadPhoto.propTypes = {
  newPhotos: PropTypes.element
};

export default withRouter(UploadPhoto);
