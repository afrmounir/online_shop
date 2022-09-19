const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient
    .connect('mongodb+srv://user815:9TMiDci0cy0Pd92m@cluster0.ns3cqzi.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected.');
      _db = client.db();
      cb();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;