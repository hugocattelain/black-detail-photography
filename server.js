require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3001);

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
  const param = req.query.q;

    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        if (param === 'home') {
          connection.query(
            `
            select * from photos
            `
            ,function(err,rows){
              connection.release();
              if(!err) {
                  res.json(rows);
              }
          });
        } else {
          connection.query(
            `
            select * from photos
            where tag_1 like '%${param}%'
            or tag_2 like '%${param}%'
            or tag_3 like '%${param}%'
            `
            ,function(err,rows){
              connection.release();
              if(!err) {
                  res.json(rows);
              }
          });
        }

        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});

app.post("/api/photo", (req, res, next) => {
  console.log("request body");
  console.log(req.body);
  //console.log({req, res, next});
  // const newPhoto = Utils.createElement(req.body);
  // if (newPhoto) {
  //   connection.query(
  //     `
  //     INSERT INTO photos (
  //       src,
  //       title,
  //       tag_1,
  //       tag_2,
  //       tag_3,
  //       created_at,
  //       shot_at
  //     ) VALUES (
  //       ${newPhoto.src},
  //       ${newPhoto.title},
  //       ${newPhoto.tag_1},
  //       ${newPhoto.tag_2},
  //       ${newPhoto.tag_3},
  //       CURRENT_TIMESTAMP,
  //       ${newPhoto.shot_at}
  //     );
  //     `
  //     ,function(err,rows){
  //       connection.release();
  //       if(!err) {
  //         console.log("post success 1");
  //         res.json(rows);
  //       }
  //   });
  //   res.setHeader('Content-Type', 'application/json');
  //   res.status(201).send(newPhoto);
  //   console.log("post success");
  // } else {
  //   res.status(400).send();
  // }

  res.send(JSON.stringify({
    src: 'req.body.src || null',
    title: 'req.body.src || null'
  }));

});


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
