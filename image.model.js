//Require Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  filecode: String,
  isAssigned: Boolean,
  status: Boolean
});
imageSchema.set('timestamps', true);

let imagesModel = mongoose.model('images', imageSchema);
module.exports = imagesModel;
