const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

// config 옵션
let storage = multer.diskStorage({
  // 파일을 어디에 저장할지 설명해주는 것 -> uplodas라는 폴더에 저장
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // 어떠한 파일 명으로 저장할 것인지
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // 어떤 형식만 가능하다고 설정 (ext !== '.mp4' || ext !== '.png') 식으로 설정가능
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
    }
    cb(null, true)
  }
});

const upload = multer({ storage: storage }).single("file");


//=================================
//              Video
//=================================
router.post('/uploadfiles', (req, res) => {

  // 비디오를 서버에 저장한다.
  // multer 라이브러리 문서 참조
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })

  })

})

router.post('/thumbnail', (req, res) => {

  // 썸네일 생성 및 비디오 러닝타임 가져오기

  let filePath = ""
  let fileDuration = ""


  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata); // all metadata
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration
  });


  // 썸네일 생성
  ffmpeg(req.body.url) // 비디오 저장경로
    // 비디오 썸네일 이름 생성
    .on('filenames', function (filenames) {
      console.log('Will generate' + filenames.join(', '));
      console.log(filenames);

      filePath = "uploads/thumbnails/" + filenames[0]
    })
    // 썸네일 생성 성공 시 무엇을 할지
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({ success: true, url: filePath, fileDuration: fileDuration })
    })
    // 오류가 뜰 경우
    .on('error', function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshot({
      // Will take screenshots at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // '%b': input basename (filename w/o extension)
      filename: 'thumbnail-%b.png'
    })

})

module.exports = router;