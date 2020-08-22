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

exports.getHeaderLinks = function(safeMode) {
  let headerLinks = [
    {
      path: '/',
      title: 'Fine art nude',
    },
    {
      path: '/portrait',
      title: 'Portrait',
    },
    {
      path: '/architecture',
      title: 'Architecture',
    },
    /* {
      path: '/published-work',
      title: 'Editorial',
    },
    {
      path: '/shop',
      title: 'Shop',
    }, */
    {
      path: '/contact',
      title: 'Contact',
    },
  ];

  if (process.env.NODE_ENV === 'development')
    headerLinks.push(
      {
        path: '/photography',
        title: 'Safe',
      },
      {
        path: '/unsafe',
        title: 'Unsafe',
      }
    );
  return safeMode ? headerLinks.slice(1) : headerLinks;
};
