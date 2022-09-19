const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  MongoClient
    .connect('mongodb+srv://user815:9TMiDci0cy0Pd92m@cluster0.ns3cqzi.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected.');
      cb(client);
    })
    .catch(err => console.log(err));
}

module.exports = mongoConnect;