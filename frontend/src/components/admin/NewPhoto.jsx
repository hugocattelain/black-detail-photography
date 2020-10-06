// Libraries
import React from 'react';

// UI Components
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, FormControl } from '@material-ui/core';

const NewPhoto = ({ index, data, src, categories, ...props }) => {
  if (!data) {
    return null;
  }
  return (
    <div className='col-xs-12 col-sm-6 col-md-6 col-lg-4'>
      <Card>
        <CardMedia className='image__thumbnail' image={src} />
        <CardContent>
          <TextField
            label='Title'
            required
            value={data.title}
            onChange={e => props.setInputState(e, index)}
            inputProps={{
              name: 'title',
              id: 'title',
            }}
          />

          <FormControl style={{ display: 'flex' }}>
            <InputLabel htmlFor='category_1'>Category 1</InputLabel>
            <Select
              value={data.tag_1}
              onChange={e => props.setInputState(e, index)}
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
            <InputLabel htmlFor='category_2'>Category 2</InputLabel>
            <Select
              value={data.tag_2}
              onChange={e => props.setInputState(e, index)}
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
            <InputLabel htmlFor='category_3'>Category 3</InputLabel>
            <Select
              value={data.tag_3}
              onChange={e => props.setInputState(e, index)}
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
};

export default NewPhoto;
