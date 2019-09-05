/**
 * Module dependencies.
 */
const _ = require('lodash');
const path = require('path');
const dbConnection = require('./dbConnection');
const imagesModel = require('./image.model');
const readdirp = require('readdirp');
const fileFilter = '*.doc';
const inputDir = '';

(async () => {
  try {
    await dbConnection.DBConnectMongoose();
    let files = await readdirp.promise(inputDir, {
      fileFilter: fileFilter
    });
    let defaultRow = { status: false, isAssigned: false };
    files = files.map(file => {
      let filename = path.basename(file.basename, '.doc');
      return _.assign(_.clone(defaultRow), { filecode: filename });
    });
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#error-handling
    let questionRes = await imagesModel.insertMany(files, {
      ordered: true,
      rawResult: true
    });
    console.log(
      `Total [${questionRes.insertedCount}] recored are dumped in the DB`
    );
    console.log('Questions are successfully dumped in mongodb db');
    console.log('Questions are successfully dumped in mongodb db');
  } catch (error) {
    console.error('Error in the main function => ' + error);
  }
})();
