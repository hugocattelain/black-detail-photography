// Return the index of an element in an array from its id
// If the element is not found, return -1
exports.getIndexById = function(id, array){
  return(array.map( (el) => el.id ).indexOf(id));
}

// Find an element by its id and return it
// If the element is not found, return undefined
exports.getElementById = function(id, array){
  return(array.find( (el) => el.id === id));
}

// Find an element in an array by its id and update its properties
// The properties updated are the ones received on the props Object
// Return the updated element
// If the element is not found, an error is throw
exports.updateElement = function(id, props, array){
  try {
    const elementToUpdate = this.getElementById(id, array);
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
exports.createElement = function(props){ // TODO : Check the elementType to validate the properties ?
  const createdElement = {};
  for (var prop in props) {
    createdElement[prop] = props[prop];
  }
  return createdElement;
}

// Check response status from a request
// Return response if success status
// Else throw error
exports.checkStatus = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

exports.parseJSON=function(response) {
  return response.json();
}

exports.getCategoryName = function(alias){
  switch(alias){
    case 'curves':
      return 'nsfw';
    case 'black':
      return 'bnw';
    case 'mask':
      return 'portrait';
    case 'wall':
      return 'architecture';
    default:
      return 'home';
  }
}

exports.getCategoryAlias = function(category){
  switch(category){
    case 'nsfw':
      return 'curves';
    case 'bnw':
      return 'black';
    case 'portrait':
      return 'mask';
    case 'architecture':
      return 'wall';
    default:
      return 'home';
  }
}
