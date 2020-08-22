const ImageService = {
  getCategoryName: function(alias) {
    switch (alias) {
      case 'fine-art-nude':
        return 'nsfw';
      case 'portrait':
        return 'portrait';
      case 'architecture':
        return 'architecture';
      default:
        return 'nsfw';
    }
  },

  getCategoryAlias: function(category) {
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
  },
};

export default ImageService;
