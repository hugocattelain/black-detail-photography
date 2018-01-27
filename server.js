require('dotenv').config();
const express = require("express");
var mysql = require('mysql');


const app = express();

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

app.get("/api/photos", (req, res) => {
  const param = req.query.q;

    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        //console.log('connected as id ' + connection.threadId);

        if (!param) {
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



app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
