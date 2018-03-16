require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const moment = require('moment');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3001);

let photos = [];
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
  const response = {
    subject:"Black Detail - Your message have been sent",
    html:`
      <p>
        <h4>Thank you for your message !</h4>
        <br/><br/>
        <p>Here is a copy of your message : <br/>${data.text}</p>
        <br/><br/>
        <strong>Black Detail Photography</strong>
        <a href="https://www.instagram.com/blck.dtl/"><img src="https://res.cloudinary.com/dmdkvle30/image/upload/v1520511863/basic/as4hmv5aty4dbdez4fu5.jpg"/>Instagram</a>
        <br/>
        <a href="https://www.facebook.com/blck.dtl/"><img src="https://res.cloudinary.com/dmdkvle30/image/upload/v1520511863/basic/as4hmv5aty4dbdez4fu5.jpg"/>Facebook</a>
        <br/>
      </p>`
  };

  nodemailer.createTestAccount((err) => {
    let transporter = nodemailer.createTransport({
      host: process.env.MAILER_SERVER,
      port: process.env.MAILER_PORT,
      secure: false,
      auth: {
        user: process.env.MAILER_NAME,
        pass: process.env.MAILER_PASSWORD
      }
    });

    let poolConfig = {
      pool: true,
      from: process.env.MAILER_NAME,
      to: 'blackdetailphotography@outlook.com',
      subject: data.subject,
      html: `<p>from: <b>${data.from}</b><br/><br/><p>${data.text}</p></p>`
    };

    let responseConfig = {
      from: process.env.MAILER_NAME,
      to: data.from,
      subject: response.subject,
      html: response.html
    };

    // transporter.verify(function(error, success) {
    //    if (error) {
    //         console.log(error);
    //    } else {
    //         console.log('Server is ready to take our messages');
    //    }
    // });
    // send mail with defined transport object
    transporter.sendMail(poolConfig, (error) => {
      if (error) {
        res.status(500).json(error);
        return console.log(error);
      }
      transporter.sendMail(responseConfig, (err) => {
        if (err) {
          res.status(500).json(err);
        }
      });
      res.status(201).json('Success');
    });

    transporter.close();

  });
});


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
