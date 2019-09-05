//Require Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  username: { type: String, unique: true },
  images: [{ type: Schema.Types.ObjectId, ref: 'images' }]
});
userSchema.set('timestamps', true);

let usersModel = mongoose.model('users', userSchema);
module.exports = usersModel;
