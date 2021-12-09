require('dotenv').config()
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2'
})
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'runnershigh-1',
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
    }
  })
})
module.exports = upload
