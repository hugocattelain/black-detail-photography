var mjml2html = require('mjml');
var Utils = require('../../frontend/src/Utils.js');
const fs = require('fs');
//var mjml_image = require('./emails/components/new_photo.mjml')

exports.fillNewsLetter = function (email, images){
  let newsletter_mjml = fs.readFileSync(__dirname + "/../templates/new_photo.mjml", "utf8");
  const mjml_image = fs.readFileSync(__dirname + "/../components/mjml_image.mjml", "utf8");
  var imageList=[];
  let final_file="";
  const notifications_url= 'http://www.black-detail.com/notifications/' + email.email + '/' + email.subscription_type;
  newsletter_mjml = newsletter_mjml.replace('{{ notifications_url }}', notifications_url);
  for(let image of images){
    var url = "http://www.black-detail.com/" + Utils.getCategoryAlias(image.tag_1) +"&" + image.id;
    var singleImage = mjml_image.replace("{{ image_src }}", image.src.replace('upload','upload/t_thumb'));
    singleImage = singleImage.replace("{{ image_url }}", url);
    imageList.push(singleImage);
  }

  newsletter_html = mjml2html(newsletter_mjml.replace("{{ image_list }}", imageList.join(" ")));
  return newsletter_html.html;
}

exports.fillMessageSent = function (data){
  let message_sent_mjml = fs.readFileSync(__dirname + "/../templates/message_sent.mjml", "utf8");
  const notifications_url= 'http://www.black-detail.com/notifications/' + data.from + '/1';
  message_sent_mjml = message_sent_mjml.replace('{{ message }}', data.text);
  message_sent_mjml = message_sent_mjml.replace('{{ notifications_url }}', notifications_url);
  const message_sent_html = mjml2html(message_sent_mjml);
  return message_sent_html.html;
}
