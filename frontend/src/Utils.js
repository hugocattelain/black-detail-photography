// Return the index of an element in an array from its id
// If the element is not found, return -1
function getIndexById(id, array){
  return(array.map( (el) => el.id ).indexOf(id));
}

// Find an element by its id and return it
// If the element is not found, return undefined
function getElementById(id, array){
  return(array.find( (el) => el.id === id));
}

// Find an element in an array by its id and update its properties
// The properties updated are the ones received on the props Object
// Return the updated element
// If the element is not found, an error is throw
function updateElement(id, props, array){
  try {
    const elementToUpdate = getElementById(id, array);
    for (var prop in props) {
      elementToUpdate[prop] = props[prop];
    }
    return(elementToUpdate); // TODO : Return updated array instead ?
  }
  catch(error){
    console.log(error);
  }
}

// Create a new element with the properties contained in the props object
function createElement(props){ // TODO : Check the elementType to validate the properties ?
  const createdElement = {};
  for (var prop in props) {
    createdElement[prop] = props[prop];
  }
  return createdElement;
}

// Check response status from a request
// Return response if success status
// Else throw error
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Utils = { getIndexById, getElementById, updateElement, createElement, checkStatus, parseJSON };
export default Utils;
