var express = require('express');
const mongoose = require('mongoose');
var app = express(); //express
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const dbConnection = require('./dbConnection');
const imagesModel = require('./image.model');
const usersModel = require('./user.model');

(async () => {
  await dbConnection.DBConnectMongoose();
})();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/register', register);
async function register(req, res, next) {
  try {
    let username = req.body.username;
    let userObj = await usersModel.findOne({ username: username });
    if (userObj) {
      return res.redirect(`/compare/${userObj._id}`);
    }
    let user = new usersModel({
      _id: new mongoose.Types.ObjectId(),
      username: username
    });
    await user.save();

    let imageData = await imagesModel
      .find({ isAssigned: { $exists: true, $eq: false } })
      .limit(5)
      .exec();

    var criteria = {
      _id: { $in: _.map(imageData, _.iteratee('_id')) }
    };
    await imagesModel
      .updateMany(
        criteria,
        { isAssigned: true, user: user._id },
        { multi: true }
      )
      .exec();
    user.images.push(...criteria['_id']['$in']);
    await user.save();
    return res.redirect(`/compare/${user._id}`);
  } catch (error) {
    return res.status(400).json({
      message: _.toString(error)
    });
  }
}

app.get('/compare/:uid', async (req, res) => {
  try {
    var uid = req.params.uid;
    let data = await usersModel.findById(uid).populate('images');
    if (_.isEmpty(data) || _.isEmpty(data.images)) {
      return res.status(400).json({ message: 'No recoreds founds' });
    }
    res.render('compare', { results: JSON.stringify(data) });
  } catch (error) {
    return res.status(400).json({ message: 'Please provide valid uid' });
  }
});

app.post('/image/status/update/', async (req, res) => {
  try {
    let body = req.body.data;
    let imageStatus = body.status === 'correct' ? true : false;
    let image = await imagesModel.findByIdAndUpdate(
      body.imageId,
      {
        status: imageStatus
      },
      { new: true }
    );
    res.status(200).json({ message: 'success', result: image });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Something went wrong! Please try again later' });
  }
});

// start server
const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 3000;
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
