
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
});

database.once('connected', () => {
  console.log('Database Connected');
});

const routes = require('./routes/routes');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.json());

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`)
});


//To allow CORS
var cors = require('cors');

var allowedOrigins = ['http://localhost:3000',
  'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    console.log("Origin : ", origin);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
})
);

//For Request Authentication request using Api Key
const authentication = function (req, res, next) {
  console.log("Checking Authentication :: ", req.headers.apikey);
  const authKey = req.headers.apikey;
  if (authKey == "5e42z68") {
      console.log("Authentication Successful");
      next()
  } else {
      res.status(401);
      res.send('Authentication Failed');
  }
}

app.use('/api', authentication, routes)
