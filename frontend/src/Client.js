const Utils = require("./Utils");
const axios = require('axios');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
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
    //.then(Utils.checkStatus)
    .then(response => response.data )
    .then(cb);
}

exports.getImages = function(category, cb) {

  const url = category === ('home' || 'all') ?  '/photos' : `photos/${category}`;

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    //.then(Utils.checkStatus)
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
    //.then(Utils.checkStatus)
    .then(response => response.data);
}

exports.deleteImage = function(id, visibility, cb) {

  const url = `/photos/${id}/${visibility}`;

  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
  })
    //.then(Utils.checkStatus)
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
    .then(Utils.checkStatus)
    .then(response => response.data )
    .then(cb);
}

exports.getEmails = function(cb) {
  const url = 'emails';

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    //.then(Utils.checkStatus)
    .then(response => response.data )
    .then(cb);
}

exports.getEmail = function(email, cb) {
  const url = `emails/${email}`;

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    //.then(Utils.checkStatus)
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
    //.then(Utils.checkStatus)
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
    //.then(Utils.checkStatus)
    .then(response => response.data )
    .then(cb);
}

exports.postNewsletter = function(data, cb) {
  const url = 'newsletter';
  console.log(data);
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
    //.then(Utils.checkStatus)
    .then(response => response.data)
    .then(cb);
}
