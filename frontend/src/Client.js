const axios = require('axios');
require('es6-promise').polyfill();
require('isomorphic-fetch');


const PORT =  process.env.PORT || 3000;
var baseUrl = 'http://localhost:' + PORT + '/api/';

if(process.env.NODE_ENV === "production"){
  baseUrl = 'http://www.black-detail.com/api/';
}
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// const mailInstance = axios.create({
//   baseURL: '../emails/',
// });


/* eslint-disable no-undef */
exports.getAllImages = function(query, cb) {
  const url = `photos?q=${query}`;

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    .then(response => response.data)
    .then(cb);
}

exports.getImages = function(category, cb) {

  const url = category === ('home' || 'all') ?  '/photos' : `photos/${category}`;

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    .then(response => response.data )
    .then(cb);
}


exports.postImage = function(data) {
  const url = 'photo';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: data,
  })
    .then(response => response.data);
}

exports.deleteImage = function(id, visibility, cb) {

  const url = `/photos/${id}/${visibility}`;

  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
  })
    .then(response => response.data )
    .then(cb);
}

exports.updateImage = function(image, cb) {
  const id = image.id;
  const data = {
    tag_1: image.tag_1,
    tag_2: image.tag_2,
    tag_3: image.tag_3,
    created_at: image.created_at,
    is_visible: image.is_visible
  }
  const url = `/photos/${id}`;

  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: data,
  })
    .then(response => response.data )
    .then(cb);
}

exports.sendMessage = function(data, cb) {

  const url = '/contact';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data:data,
  })
    .then(response => response.data )
    .then(cb);
}

exports.getEmails = function() {
  const url = 'emails';

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })

    .then(response => response.data );
}

exports.getEmail = function(email, cb) {
  const url = `emails/${email}`;

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    //
    .then(response => response.data )
    .then(cb);
}

exports.postEmail = function(data, cb) {
  const url = 'emails';

  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: data,
  })
    .then(response => response.data )
    .then(cb);
}

exports.updateEmail = function(email, pref, cb) {

  const url = `/emails/${email}/${pref}`;

  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
  })

    .then(response => response.data);
}

exports.postNewsletter = function(data) {
  const url = 'newsletter';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: data,
  })
    .then(response => response.data);
}
