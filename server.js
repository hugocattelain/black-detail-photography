require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mysql = require('mysql');
const moment = require('moment');
const nodemailer = require('nodemailer');
const mjmlToHtml = require('./emails/transformer/mjmlToHtml.js');
const path = require('path');
const morgan = require('morgan');
const jwt = require('jwt-simple');

const app = express();

const ADMIN = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET = process.env.ADMIN_SECRET;

const PORT = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  );
  next();
});

// Express only serves static assets in production
app.use(express.static(path.join(__dirname, 'frontend/build')));

passport.use(
  new LocalStrategy((username, password, done) => {
    if (username === ADMIN && password === ADMIN_PASSWORD) {
      done(null, jwt.encode({ username }, SECRET));
      return;
    }
    done(null, false);
  })
);

passport.use(
  new BearerStrategy((token, done) => {
    try {
      const { username } = jwt.decode(token, SECRET);
      if (username === ADMIN) {
        done(null, username);
        return;
      }
      done(null, false);
    } catch (error) {
      done(null, false);
    }
  })
);

app.post(
  '/api/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.send({
      token: req.user,
    });
  }
);

var pool = mysql.createPool({
  connectionLimit: 100, //important
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  debug: false,
});

app.get(
  '/api/photos',

  (req, res, next) => {
    const param = req.query.category || 'portrait';
    const exception = 'nsfw';
    let values = [];
    let instruction = '';
    switch (param) {
      case 'home':
        instruction = `
        select * from photos
        where is_visible=1
        and (tag_1 like ?
        or tag_2 like ?
        or tag_3 like ?)
        order by created_at desc`;
        values = [exception, exception, exception];
        break;
      case 'all':
        instruction = `select * from photos order by created_at desc`;
        values = '';
        break;
      default:
        instruction = `
        select * from photos
        where (tag_1 like ?
        or tag_2 like ?
        or tag_3 like ?)
        and is_visible=1
        order by created_at desc`;
        values = [param, param, param];
        break;
    }

    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: 'Error in connection database' });
        return;
      }

      connection.query(instruction, values, function(err, rows) {
        connection.release();
        if (!err) {
          res.status(200).json(rows);
        }
      });
    });
  }
);

app.get('/api/photos/:category', (req, res, next) => {
  const category = req.params.category;
  const instruction = `select * from photos
  where tag_1 like ?
  or tag_2 like ?
  or tag_3 like ?
  and is_visible=1
  order by created_at desc
  `;
  const values = [category, category, category];

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({ code: 100, status: 'Error in connection database' });
      return;
    }

    connection.query(instruction, values, function(err, result) {
      connection.release();
      if (!err) {
        res.status(200).json(result);
      }
    });
  });
});

app.post(
  '/api/photo',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
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

    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: 'Error in connection database' });
        return;
      }

      const values = data.map(item => {
        if (!item.src || !item.tag_1 || !item.title || !item.is_visible) {
          res.status(422).json({ error: 'Missing required field(s)' });
        } else {
          return [
            item.src,
            item.title,
            item.tag_1,
            item.tag_2,
            item.tag_3,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            item.is_visible,
          ];
        }
      });

      connection.query(instruction, [values], function(err, result) {
        connection.release();
        if (!err) {
          res.status(201).json(values);
        } else {
          res.status(500).json(err);
        }
      });
    });
  }
);

app.put(
  '/api/photos/:id',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const instruction = `UPDATE photos
    SET tag_1 = ? ,
    tag_2 = ?,
    tag_3 = ?,
    created_at = ?,
    is_visible = ?
    WHERE id = ?;
    `;
    const values = [
      data.tag_1,
      data.tag_2,
      data.tag_3,
      data.created_at,
      data.is_visible,
      id,
    ];

    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: 'Error in connection database' });
        return;
      }

      connection.query(instruction, values, function(err, result) {
        connection.release();
        if (!err) {
          res.status(201).json('Success');
        } else {
          res.status(500).json(err);
        }
      });
    });
  }
);

app.put(
  '/api/photos/:id/:visibility',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    const id = req.params.id;
    const visibility = req.params.visibility;
    const instruction = `UPDATE photos
    SET is_visible = ?
    WHERE id = ?;
    `;
    const values = [visibility, id];

    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: 'Error in connection database' });
        return;
      }

      connection.query(instruction, values, function(err, result) {
        connection.release();
        if (!err) {
          res.status(201).json('Success');
        } else {
          res.status(500).json(err);
        }
      });
    });
  }
);

app.post('/api/contact', function(req, res) {
  const data = req.body;

  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVER,
    port: process.env.MAILER_PORT,
    secure: false,
    auth: {
      user: process.env.MAILER_NAME,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  let message = {
    from: process.env.MAILER_NAME,
    to: 'blackdetailphotography@outlook.com',
    subject: data.subject,
    html: `<p>from: <b>${data.from}</b><br/><br/><p>${data.text}</p></p>`,
  };

  let answer = {
    from: process.env.MAILER_NAME,
    to: data.from,
    subject: 'Black Detail - Message sent',
    html: mjmlToHtml.fillMessageSent(data),
  };

  transporter.sendMail(message, error => {
    if (error) {
      res.status(500).json(error);
    }

    transporter.sendMail(answer, error => {
      if (error) {
        res.status(500).json(error);
      }
    });
    res.status(200).json('Success');
  });

  transporter.close();
});

app.post(
  '/api/newsletter',
  passport.authenticate('bearer', { session: false }),
  function(req, res, next) {
    const data = req.body;
    const emails = data.emails;
    const images = data.images;

    let transporter = nodemailer.createTransport({
      host: process.env.MAILER_SERVER,
      port: process.env.MAILER_PORT,
      secure: false,
      auth: {
        user: process.env.MAILER_NAME,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    sendEmails(transporter, emails, images);

    transporter.close();
    res.status(200).json('Success');
  }
);

async function sendEmails(transporter, emails, images) {
  for (const email of emails) {
    if (email.subscription_type > 0) {
      let message = {
        from: process.env.MAILER_NAME,
        to: email.email,
        subject: 'Black Detail - New photo is online',
        html: mjmlToHtml.fillNewsLetter(email, images),
      };
      await sendEmail(transporter, message);
    }
  }
}

function delay() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

async function sendEmail(transporter, message) {
  await delay();
  transporter.sendMail(message, error => {
    if (error) {
      console.log('error : ', error);
    } else {
      console.log('email sent !');
    }
  });
}

app.get(
  '/api/emails',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    let instruction = 'select * from emails';

    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: 'Error in connection database' });
        return;
      }

      connection.query(instruction, (err, response) => {
        connection.release();
        if (!err) {
          res.json(response);
        }
      });
    });
  }
);

app.get('/api/emails/:email', (req, res, next) => {
  let values = req.params.email;
  let instruction = 'select * from emails where email = ?';

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({ code: 100, status: 'Error in connection database' });
      return;
    }

    connection.query(instruction, [values], (err, response) => {
      connection.release();
      if (!err) {
        res.json(response);
      }
    });
  });
});

app.post('/api/emails', (req, res, next) => {
  const data = req.body;
  const values = {
    email: data.email,
    subscription_type: data.subscription_type,
  };
  const instruction = `INSERT INTO emails SET ?`;

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({ code: 100, status: 'Error in connection database' });
      return;
    }

    connection.query(instruction, values, function(err, result) {
      connection.release();
      if (!err) {
        res.status(201).json('Success');
      } else {
        console.log(err);
        res.status(500).json(err);
      }
    });
  });
});

app.put('/api/emails/:email/:pref', (req, res, next) => {
  const email = req.params.email;
  const pref = req.params.pref;
  const instruction = `UPDATE emails
    SET subscription_type = ?
    WHERE email = ?;
    `;
  const values = [pref, email];

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({ code: 100, status: 'Error in connection database' });
      return;
    }

    connection.query(instruction, values, function(err, result) {
      connection.release();
      if (!err) {
        res.status(201).json('Success');
      } else {
        res.status(500).json(err);
      }
    });
  });
});

// Serving the unknown routes to index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Find the server at: http://localhost:${PORT}/`); // eslint-disable-line no-console
});
