import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL;

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFileCloudinaryUrl: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post('https://api.cloudinary.com/v1_1/dmdkvle30/upload')
                        .field('upload_preset', 'basicupload')
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="FileUpload">
          <Dropzone
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop.bind(this)}>
            <p>Drop an image or click to select a file to upload.</p>
          </Dropzone>
        </div>

        <div>
          {this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <p>{this.state.uploadedFile.name}</p>
            <img src={this.state.uploadedFileCloudinaryUrl} />
          </div>}
        </div>
    </div>
  );
  }
}

export default Admin;
