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
import NewPhoto from './NewPhoto';

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

  handleSubmit = (event) => {
    event.preventDefault();
    Client.postImage(this.state.data, response =>{
      console.log("postImage response", response);
    });
    Client.getEmails((response) => {
      const emails = response;
      const notifications_data = {
        emails: emails,
        images: this.state.data
      };
      Client.postNewsletter(notifications_data, response => {
        console.log("postNewsletter response",response);
      })
    })
  }

  render() {
    const uploadedFilesUrl = this.state.uploadedFilesUrl;
    const uploadEnded = this.state.endUpload;
    const loading = this.state.loading;

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
        />);
    });

    return (
      <div>
        {uploadEnded ? (
          <div>
            <form onSubmit={this.handleSubmit}>
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
        { loading &&
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
        }
      </div>
    );
  }
}

UploadPhoto.propTypes = {
  newPhotos: PropTypes.element
};

export default withRouter(UploadPhoto);
