'use strict';

const mongoose = require('mongoose');
const DB_PATH = '';
let db;

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => {
  console.log('Connection Established');
});

mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected');
  process.exit(0);
});

mongoose.connection.on('close', () => {
  console.log('Connection Closed');
});

mongoose.connection.on('error', error => {
  logger.error('MONGO ERROR: ' + error);
});

exports.DBConnectMongoose = async function() {
  if (db) {
    return db;
  }
  await mongoose.connect(DB_PATH, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  db = mongoose.connection;
  return db;
};

exports.DBCloseConnectMongoose = async function(db) {
  return db.doClose();
};

exports.getDBConnection = function() {
  if (db) {
    return db;
  }
  console.log('There is no mongo connection');
  return null;
};
