import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, FormControl } from '@material-ui/core';

class NewPhoto extends Component {
  state = {
    src: '',
    title: '',
    tag_1: '',
    tag_2: '',
    tag_3: '',
    is_visible: 1,
    image_index: 0,
  };

  componentDidMount = () => {
    this.props.initState(this.props.src, this.props.index);
  };

  render() {
    const { index, data, src, categories } = this.props;
    if (!data) {
      return null;
    }
    return (
      <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <Card>
          <CardMedia className="image__thumbnail" image={src} />
          <CardContent>
            <TextField
              label="Title"
              required
              value={data.title}
              onChange={this.props.setInputState('title', index)}
            />

            <FormControl style={{ display: 'flex' }}>
              <InputLabel htmlFor="category_1">Category 1</InputLabel>
              <Select
                value={data.tag_1}
                onChange={this.props.setSelectState.bind(this, index)}
                inputProps={{
                  name: 'tag_1',
                  id: 'category_1',
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
                value={data.tag_2}
                onChange={this.props.setSelectState.bind(this, index)}
                inputProps={{
                  name: 'tag_2',
                  id: 'category_2',
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
                value={data.tag_3}
                onChange={this.props.setSelectState.bind(this, index)}
                inputProps={{
                  name: 'tag_3',
                  id: 'category_3',
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
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default NewPhoto;
