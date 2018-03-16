import Utils from "./Utils";
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
});
/* eslint-disable no-undef */
function getAllImages(query, cb) {
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

function getImages(category, cb) {

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


function postImage(data) {
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
    .then(response => response.data )
    .then(cb);
}

function deleteImage(id, visibility, cb) {

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

function sendMessage(data, cb) {

  const url = '/contact';
  console.log("test")
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

const Client = { getAllImages, getImages, postImage, deleteImage, sendMessage };
export default Client;
