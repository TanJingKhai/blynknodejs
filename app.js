const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const server = express();
const mongoclient = require('./mongoclient');

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
  res.render('data.hbs');
});

server.get('/chart',(req,res) => {
  res.render('chart.hbs');
});

server.get('/historical', (req,res) => {
  res.render('historical.hbs');
});

//--- ajax from historical.hbs ---
server.post('/light', (req, res) => {
  mongoclient.saveData({
    id: req.body.id,
    value: req.body.value,
  }).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(400).send("Error saving light data to mongodb: ", error);
  });
});


//--- testing ajax from ajaj.html -----
server.get('/orders', (req,res) => {
  mongoclient.getAllData().then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(400).send(error);
  });
});


server.post('/orders', (req, res) => {
  mongoclient.saveData({
    name: req.body.name,
    drink: req.body.drink,
  }).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(400).send('Error: ' + error);
  });
});

server.delete('/orders/:id', (req, res) => {
  var id = req.params.id;
  mongoclient.deleteOne(id).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(400).send('Error: ' + error);
  });
});

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
