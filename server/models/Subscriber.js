const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 구독 컬렉션(=테이블) 만들기
const subscriberSchema = mongoose.Schema({
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })




const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }