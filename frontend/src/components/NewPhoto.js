import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { Card, CardMedia } from '@material-ui/core/Card';
import MenuItem from '@material-ui/core/MenuItem';

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

class NewPhoto extends Component {
  constructor(props){
    super(props);

    this.state={
      title: '',
      tag_1: '',
      tag_2: '',
      tag_3: '',
      is_visible: 1,
    };
    ;
  }

  componentDidMount = () => {
    this.props.initState(this.props.url,this.props.index);
  }

  render(){//TODO PASS THE WHOLE IMAGE
    const index = this.props.index;
    const {data} = this.props;
    const src= this.props.url;
    const categories = this.props.categories;
    if(data.length === 0){
      return null;
    }
    return(

      <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4">
      <MuiThemeProvider muiTheme={muiBlack}>
        <Card>
          <CardMedia>
            <div className="image__thumbnail" style={{backgroundImage: `url(${src.replace("upload", "upload/t_web_small")})`}}></div>
          </CardMedia>
            <MuiThemeProvider muiTheme={muiBlack}>
              <TextField
                floatingLabelText="Title"
                required={true}
                value={ data[index] ? data[index].title : '' }
                onChange={(e) => this.props.setInputState(e, 'title', index)}
              />
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={muiBlack}>
              <Select
                floatingLabelText="Category 1"
                required={true}
                value={data[index] ? data[index].tag_1 : ''}
                onChange={(evt, newIndex, value) => this.props.setSelectState('tag_1', value, index)}
              >
                {categories.map((item, key) => {
                  return(<MenuItem key = {key} value={item.tag} primaryText={item.name} />);
                })}
              </Select>
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={muiBlack}>
              <Select
                floatingLabelText="Category 2"
                value={data[index] ? data[index].tag_2 : ''}
                onChange={(evt, newIndex, value) => this.props.setSelectState('tag_2', value, index)}
              >
                {categories.map((item, key) => {
                  return(<MenuItem key = {key} value={item.tag} primaryText={item.name} />);
                })}
              </Select>
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={muiBlack}>
              <Select
                floatingLabelText="Category 3"
                value={data[index] ? data[index].tag_3 : ''}
                onChange={(evt, newIndex, value) => this.props.setSelectState('tag_3', value, index)}
              >
                {categories.map((item, key) => {
                  return(<MenuItem key = {key} value={item.tag} primaryText={item.name} />);
                })}
              </Select>
            </MuiThemeProvider>
          </Card>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default NewPhoto;
