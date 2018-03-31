require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var moment = require('moment');
var nodemailer = require('nodemailer');
var Client = require('./frontend/src/Client.js');
var fs = require('fs');
var mjmlToHtml = require('./emails/transformer/mjmlToHtml.js')

const app = express();
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3001);

const message_sent_html = fs.readFileSync(__dirname + "/emails/templates/message_sent.html", "utf8");
const newsletter_new_image = fs.readFileSync(__dirname + "/emails/templates/new_photo.mjml", "utf8");

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
}

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    debug    :  false
});

app.get("/api/photos", (req, res, next) => {
  const param = req.query.q || 'home';
  const exception = 'nsfw';
  let values = [];
  // = param === 'home' ? [exception,exception,exception] : [param,param,param];
  let instruction = '';
  switch(param){
    case 'home':
      instruction = `
        select * from photos
        where is_visible=1
        and tag_1 not like ?
        and tag_2 not like ?
        and tag_3 not like ?`;
        values = [exception,exception,exception];
      break;
    case 'all':
      instruction = `select * from photos`;
      values='';
      break;
    default:
      instruction = `
        select * from photos
        where (tag_1 like ?
        or tag_2 like ?
        or tag_3 like ?)
        and is_visible=1`;
      values = [param,param,param];
      break;
    }

    pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    connection.query(instruction, values ,function(err,rows){
      connection.release();
      if(!err) {
        res.json(rows);
      }
    });

    connection.on('error', function(err) {
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    });
  });
});

app.get("/api/photos/:category", (req, res, next) => {

    const category = req.params.category;

    const instruction = `select * from photos
    where tag_1 like ?
    or tag_2 like ?
    or tag_3 like ?
    and is_visible=1
    `;
    const values =[category, category, category];

    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        connection.query(instruction, values, function(err, result){
            connection.release();
            if(!err) {
                res.json(result);
            }
        });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
  });
});

app.post("/api/photo", (req, res, next) => {

  const { body } = req;
  const data = req.body;
  const instruction = `INSERT INTO photos (
    src,
    title,
    tag_1,
    tag_2,
    tag_3,
    created_at,
    is_visible
  ) VALUES ?`;

  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    const values = data.map((item) => {

      if (!item.src
        || !item.tag_1
        || !item.title
        || !item.is_visible){
          res.status(422).json({error: "Missing required field(s)"});
      } else {
        return([`${item.src}`, `${item.title}`, `${item.tag_1}`, `${item.tag_2}`, `${item.tag_3}`, `${moment().format('YYYY-MM-DD')}`, `${item.is_visible}` ]);
      }
    });

    connection.query(instruction, [values] ,function(err,result){
        connection.release();
        if(!err) {
          res.status(201).json('Success');
        }
        else{
          res.status(500).json(err);
        }
      }
    );

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
    });
  });
});

app.put("/api/photos/:id/:visibility", (req, res, next) => {

  const id = req.params.id;
  const visibility = req.params.visibility;
  const instruction = `UPDATE photos
    SET is_visible = ?
    WHERE id = ?;
    `;
  const values = [visibility, id];

  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    connection.query(instruction, values ,function(err,result){
        connection.release();
        if(!err) {
          res.status(201).json('Success');
        }
        else{
          res.status(500).json(err);
        }
      }
    );

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
    });
  });
});

app.post('/api/contact', function (req, res) {
  const data = req.body;
  const notifications_url= 'http://www.black-detail.com/notifications/' + data.from + '/1';
  let message_sent = message_sent_html.replace('{{ message }}', data.text);
  message_sent = message_sent.replace('{{ notifications_url }}', notifications_url);
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVER,
    port: process.env.MAILER_PORT,
    secure: false,
    auth: {
      user: process.env.MAILER_NAME,
      pass: process.env.MAILER_PASSWORD
    }
  });


  let message = {
    from: process.env.MAILER_NAME,
    to: 'blackdetailphotography@outlook.com',
    subject: data.subject,
    html: `<p>from: <b>${data.from}</b><br/><br/><p>${data.text}</p></p>`
  };


  let answer = {
    from: process.env.MAILER_NAME,
    to: data.from,
    subject:"Black Detail - Message sent",
    html:message_sent
  };

  transporter.sendMail(message, (error) => {
    if (error) {
      res.status(500).json(error);
      return console.log(error);
    }

    transporter.sendMail(answer, (error) => {
        if(error){
          res.status(500).json(error);
          return console.log(error);
        }
    });
    res.status(201).json('Success');
  });

  transporter.close();
});

app.post('/api/newsletter', function (req, res, next) {
  const data = req.body;
  const emails = data.emails;
  const images = data.images;
  let errorCount = 0;
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVER,
    port: process.env.MAILER_PORT,
    pool: true,
    secure: false,
    auth: {
      user: process.env.MAILER_NAME,
      pass: process.env.MAILER_PASSWORD
    }
  });

  sendEmails(transporter, emails, images);

  transporter.close();
  res.status(201).json('Success');
});

async function sendEmails (transporter, emails, images) {
  for(const email of emails){
    let notifications_url= 'http://www.black-detail.com/notifications/' + email.email + '/' + email.subscription_type;
    let new_image_mjml = newsletter_new_image.replace('{{ notifications_url }}', notifications_url);
    let message = {
      from: process.env.MAILER_NAME,
      to: email.email,
      subject:"Black Detail - New photo is online",
      html: mjmlToHtml.convert(new_image_mjml, images),
    };
    await sendEmail(transporter, message);
  }
}

function delay(){
  return new Promise(resolve => setTimeout(resolve, 1000));
}

async function sendEmail(transporter, message){
  await delay();
  transporter.sendMail(message, (error) => {
    if (error) {
      console.log("error : ",error);
    }
    else{
      console.log("email sent !");
    }
  });
}

app.get("/api/emails", (req, res, next) => {

  let instruction = 'select * from emails';

  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    connection.query(instruction, (err,response) =>{
      connection.release();
      if(!err) {
        res.json(response);
      }
    });

    connection.on('error', function(err) {
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    });
  });
});

app.get("/api/emails/:email", (req, res, next) => {
  let values = req.params.email;
  let instruction = 'select * from emails where email = ?';

  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    connection.query(instruction, [values], (err,response) =>{
      connection.release();
      if(!err) {
        res.json(response);
      }
    });

    connection.on('error', function(err) {
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    });
  });
});

app.post("/api/emails", (req, res, next) => {
  const data = req.body;
  const values = {email:data.email, subscription_type:data.subscription_type};
  const instruction = `INSERT INTO emails SET ?`;

  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    connection.query(instruction, values ,function(err,result){
        connection.release();
        if(!err) {
          res.status(201).json('Success');
        }
        else{
          res.status(500).json(err);
        }
      }
    );

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
    });
  });
});

app.put("/api/emails/:email/:pref", (req, res, next) => {

  const email = req.params.email;
  const pref = req.params.pref;
  const instruction = `UPDATE emails
    SET subscription_type = ?
    WHERE email = ?;
    `;
  const values = [pref, email];

  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    connection.query(instruction, values ,function(err,result){
        connection.release();
        if(!err) {
          res.status(201).json('Success');
        }
        else{
          res.status(500).json(err);
        }
      }
    );

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
    });
  });
});


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
