const axios = require('axios');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var baseUrl = 'https://www.black-detail.com/api/';

if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3000;
  baseUrl = 'http://localhost:' + PORT + '/api/';
} else if (process.env.NODE_ENV === 'staging') {
  baseUrl = 'https://black-detail-test.herokuapp.com/api/';
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

exports.login = body => {
  return axiosInstance({
    method: 'post',
    url: 'login',
    responseType: 'json',
    headers: {
      Accept: 'application/json',
    },
    data: body,
  }).then(response => response.data);
};

exports.resetIndex = images => {
  return axiosInstance({
    method: 'put',
    url: 'photos/reset-index',
    responseType: 'json',
    data: images,
  }).then(response => response.data);
};

exports.getLastIndex = images => {
  return axiosInstance({
    method: 'get',
    url: 'photos/last-photo-index',
    responseType: 'json',
  }).then(response => response.data);
};

exports.getImages = function(category, cb) {
  const url = `photos?category=${category}`;

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
  })
    .then(response => response.data)
    .then(cb);
};

exports.postImage = data => {
  const url = 'photo';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + sessionStorage.getItem('bearer'),
    },
    data: data,
  }).then(response => response.data);
};

exports.deleteImage = function(id, visibility) {
  const url = `/photos/${id}/${visibility}`;
  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
    headers: {
      Authorization: 'bearer ' + sessionStorage.getItem('bearer'),
    },
  }).then(response => response.data);
};

exports.updateImage = function(image) {
  const id = image.id;
  const data = {
    tag_1: image.tag_1,
    tag_2: image.tag_2,
    tag_3: image.tag_3,
    is_visible: image.is_visible,
  };
  const url = `/photos/${id}`;

  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + sessionStorage.getItem('bearer'),
    },
    data: data,
  }).then(response => response.data);
};

exports.sendMessage = function(data, cb) {
  const url = '/contact';

  axiosInstance({
    method: 'get',
    url: `/emails/${data.from}`,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(response => {
      let user = response.data.length > 0 ? response.data[0] : null;
      if (!user) {
        this.postEmail({ email: data.from, subscription_type: 1 });
      }
      return axiosInstance({
        method: 'post',
        url: url,
        responseType: 'json',
        headers: {
          Accept: 'application/json',
        },
        data: { user: user, ...data },
      })
        .then(response => response.data)
        .then(cb);
    })
    .catch(err => console.log(err));
};

exports.getEmails = function() {
  const url = 'emails';

  return axiosInstance({
    method: 'get',
    url: url,
    responseType: 'json',
    headers: {
      Authorization: 'bearer ' + sessionStorage.getItem('bearer'),
    },
  }).then(response => response.data);
};

exports.postEmail = function(data) {
  const url = 'emails';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
    },
    data: data,
  }).then(response => response.data);
};

exports.updateEmail = function(email, pref) {
  const url = `/emails/${email}/${pref}`;

  return axiosInstance({
    method: 'put',
    url: url,
    responseType: 'json',
  }).then(response => response.data);
};

exports.postNewsletter = function(data) {
  const url = 'newsletter';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + sessionStorage.getItem('bearer'),
    },
    data: data,
  }).then(response => response.data);
};

exports.postCustomNewsletter = function(data) {
  const url = 'custom-newsletter';
  return axiosInstance({
    method: 'post',
    url: url,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + sessionStorage.getItem('bearer'),
    },
    data: data,
  }).then(response => response.data);
};
