var mjml2html = require('mjml');
var Utils = require('../../frontend/src/Utils.js');
const fs = require('fs');
//var mjml_image = require('./emails/components/new_photo.mjml')

exports.convert = function (mjml, images){
  const mjml_image = fs.readFileSync(__dirname + "/../components/mjml_image.mjml", "utf8");
  var imageList=[];
  let final_file="";
  for(var i=0; i<images.length; i++){
    var url = "http://www.black-detail.com/" + Utils.getCategoryAlias(images[i].tag_1) +"&" + images[i].id;
    var singleImage = mjml_image.replace("{{ image_src }}", images[i].src);
    singleImage = singleImage.replace("{{ image_url }}", url);
    imageList.push(singleImage);
  }

  final_file = mjml2html(mjml.replace("{{ image_list }}", imageList.join(" ")));
  return final_file.html;
}
