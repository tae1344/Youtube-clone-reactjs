const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');


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

module.exports = router;