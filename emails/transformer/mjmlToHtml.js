const path = require('path');
const mjml2html = require('mjml');
const Utils = require('../../frontend/src/Utils.js');
const fs = require('fs');

exports.fillNewsLetter = (email, images) => {
  let newsletterMjml = fs.readFileSync(
    path.join(__dirname, '../templates/new_photo.mjml'),
    'utf8'
  );
  const mjmlImage = fs.readFileSync(
    path.join(__dirname, '../components/mjml_image.mjml'),
    'utf8'
  );
  const imageList = [];
  const notificationsUrl =
    'https://www.black-detail.com/notifications/' +
    email.email +
    '/' +
    email.subscription_type;
  newsletterMjml = newsletterMjml.replace(
    '{{ notifications_url }}',
    notificationsUrl
  );
  for (const image of images) {
    let url =
      'https://www.black-detail.com/' + Utils.getCategoryAlias(image.tag_1);
    if (image.id && image.id !== undefined) {
      url = url + '/' + image.id;
    }
    let singleImage = mjmlImage.replace('{{ image_src }}', image.src);
    singleImage = singleImage.replace('{{ image_url }}', url);
    imageList.push(singleImage);
  }

  const newsletterHtml = mjml2html(
    newsletterMjml.replace('{{ image_list }}', imageList.join(' '))
  );
  return newsletterHtml.html;
};

exports.fillCustomNewsLetter = (email, content) => {
  let newsletterMjml = fs.readFileSync(
    path.join(__dirname, '../templates/template.mjml'),
    'utf8'
  );
  const notificationsUrl =
    'https://www.black-detail.com/notifications/' +
    email.email +
    '/' +
    email.subscription_type;
  newsletterMjml = newsletterMjml.replace(
    '{{ notifications_url }}',
    notificationsUrl
  );

  newsletterMjml = newsletterMjml.replace('{{ title }}', content.title);

  newsletterMjml = newsletterMjml.replace('{{ subtitle }}', content.subtitle);

  newsletterMjml = newsletterMjml.replace('{{ body }}', content.body);

  newsletterMjml = newsletterMjml.replace('{{ link_ref }}', content.link_ref);

  newsletterMjml = newsletterMjml.replace('{{ link_text }}', content.link_text);

  const newsletterHtml = mjml2html(newsletterMjml);
  return newsletterHtml.html;
};

exports.fillMessageSent = data => {
  let messageSentMjml = fs.readFileSync(
    path.join(__dirname, '/../templates/message_sent.mjml'),
    'utf8'
  );
  const notificationsUrl =
    'https://www.black-detail.com/notifications/' + data.from + '/1';
  messageSentMjml = messageSentMjml.replace('{{ message }}', data.text);
  messageSentMjml = messageSentMjml.replace(
    '{{ notifications_url }}',
    notificationsUrl
  );
  const messageSentHtml = mjml2html(messageSentMjml);
  return messageSentHtml.html;
};
