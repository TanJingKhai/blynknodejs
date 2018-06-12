const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const server = express();

const AUTH = 'd71ef867ed0f4a4b821d1f6d42b2abf9';
const reqUrl = `http://blynk-cloud.com/${AUTH}/get/V5`;

const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({ extended: true}));
server.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

server.use(express.static(path.join(__dirname,'public')));

server.get('/', (req, res) => {
  axios.get(reqUrl).then((response) => {
    res.render('home.hbs');
  }).catch((error) => {
    console.log(error);
  });
});

server.get('/data', (req, res) => {
  axios.get(reqUrl).then((response) => {
    //res.status(200).send(response.data[0]);
    res.render('data.hbs',{
      light: response.data[0],
    });
  }).catch((error) => {
    res.status(400).send(error);
  });
});

server.get('/chart',(req,res) => {
  res.render('chart.hbs');
});

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
