// Return the index of an element in an array from its id
// If the element is not found, return -1
exports.getIndexById = function(id, array) {
  return array.map(el => el.id).indexOf(id);
};

// Find an element by its id and return it
// If the element is not found, return undefined
exports.getElementById = function(id, array) {
  return array.find(el => el.id === id);
};

exports.getElementByImageIndex = function(image_index, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].image_index === image_index) {
      return array[i];
    }
  }
  /* return array.find(el => {
    return el.image_index == image_index;
  }); */
};

exports.getCategoryName = function(alias) {
  switch (alias) {
    case 'fine-art-nude':
      return 'nsfw';
    case 'portrait':
      return 'portrait';
    case 'architecture':
      return 'architecture';
    case 'editorial':
      return 'editorial';
    default:
      return 'home';
  }
};

exports.getCategoryAlias = function(category) {
  switch (category) {
    case 'nsfw':
      return '';
    case 'portrait':
      return 'portrait';
    case 'architecture':
      return 'architecture';
    case 'editorial':
      return 'editorial';
    default:
      return 'home';
  }
};

// Prevent from keyboard screenshot
exports.copyToClipboard = function() {
  // Create a "hidden" input
  var aux = document.createElement('input');
  // Assign it the value of the specified element
  aux.setAttribute('value', 'No Screenshot');
  // Append it to the body
  document.body.appendChild(aux);
  // Highlight its content
  aux.select();
  // Copy the highlighted text
  document.execCommand('copy');
  // Remove it from the body
  document.body.removeChild(aux);
  alert('No Screenshot');
};
