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

// Prevent from keyboard screenshot
exports.copyToClipboard = function(){
  // Create a "hidden" input
  var aux = document.createElement("input");
  // Assign it the value of the specified element
  aux.setAttribute("value", "No Screenshot");
  // Append it to the body
  document.body.appendChild(aux);
  // Highlight its content
  aux.select();
  // Copy the highlighted text
  document.execCommand("copy");
  // Remove it from the body
  document.body.removeChild(aux);
  alert("No Screenshot");
}
