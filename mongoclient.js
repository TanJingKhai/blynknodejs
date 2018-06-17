// ----- Uses Mongodb and promises to save data ---------
const {MongoClient, ObjectID} = require('mongodb');
const fs = MongoClient

const database = 'blynkdb';
const collection = 'blynkcollection';

//--  for development:
const databaseUrl = 'mongodb://localhost:27017';
//-- for deployment:
//const database = 'mongodb://inti2018:inti2018@ds259255.mlab.com:59255/weatherapp'

var obj = {
  table : [],
};

const getAllData = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server');
      const db = client.db(database);
      db.collection(collection).find().toArray().then((docs) => {
        resolve(docs);
      }, (err) => {
        reject('Unable to fetch data', err);
      });
      client.close();
    });
  });
};

const saveData = (newdata) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server');
      const db = client.db(database);
      db.collection(collection).insertOne(newdata,(err, result) => {
        if (err) {
          reject(`Unable to insert ${err}`);
        }
        //const timestamp = JSON.stringify(result.ops[0]._id.getTimestamp())
        console.log(result.ops[0]);
        resolve(result.ops[0]);
      });
      client.close();
    });
  });
};

const deleteAll = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server');
      const db = client.db(database);
      db.collection(collection).remove({}).then((result) => {
        resolve(result.result);
      });
      client.close();
    });
  });
};

const deleteOne = (id) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server');
      const db = client.db(database);
      db.collection(collection).findOneAndDelete({_id: new ObjectID(id)}).then((result) => {
        resolve(result.value);
      });
      client.close();
    });
  });
};

module.exports = {
  getAllData,
  saveData,
  deleteAll,
  deleteOne,
}
