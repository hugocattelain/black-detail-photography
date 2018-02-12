import Utils from "./Utils";

/* eslint-disable no-undef */
function getAllImages(query, cb) {
  return fetch(`api/photos?q=${query}`, {
    accept: "application/json"
  })
    .then(Utils.checkStatus)
    .then(Utils.parseJSON)
    .then(cb);
}

function postImage(data, cb) {
  console.log('data client.js');
  console.log(data);

  return fetch(`api/photo`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body : JSON.stringify({data})
  })
    .then(Utils.checkStatus)
    .then(Utils.parseJSON)
    .then(cb);
}

const Client = { getAllImages, postImage };
export default Client;
