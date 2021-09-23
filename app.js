const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

app.use(multer({ storage: fileStorage}).fields([{name: 'product'}]));

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

mongoose
  .connect(
    'mongodb://127.0.0.1:27017/node_api'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
