const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 비디오 컬렉션(=테이블) 만들기
const videoSchema = mongoose.Schema({
  // Schema.Types.ObjectId를 통해 User.js의 스키마에서 모든 정보를 불러올 수 있게됨
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    maxlength: 50
  },
  description: {
    type: String
  },
  privacy: {
    type: Number
  },
  category: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  duration: {
    type: String
  },
  thumbnail: {
    type: String
  }
}, { timestamps: true })




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }