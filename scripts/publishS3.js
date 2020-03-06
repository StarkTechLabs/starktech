
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const AWS = require('aws-sdk')

const AWS_KEY = process.env.AWS_KEY
const AWS_SECRET = process.env.AWS_SECRET
const S3_BUCKET = process.env.S3_BUCKET
const S3_STORAGE_TYPE = 'STANDARD'
const S3_ACL = 'public-read'

if (!AWS_KEY || !AWS_SECRET || !S3_BUCKET) {
  throw new Error('Failed to find env vars for s3 config!')
}

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_SECRET
})

const uploadFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath)
  const filename = filePath.replace('static/', '')

  const params = {
    Bucket: S3_BUCKET,
    StorageClass: S3_STORAGE_TYPE,
    ACL: S3_ACL,
    Key: filename,
    ContentType: mime.getType ? mime.getType(filePath) : mime.lookup(filePath),
    Body: fileContent
  }

  s3.upload(params, function (err, data) {
    if (err) {
      throw err
    }
    console.log('File uploaded successfully.', filePath)
  })
}

// const inS3 = (filePath, callback) => {
//   const filename = filePath.replace('static/', '')

//   const params = {
//     Bucket: S3_BUCKET,
//     Key: filename
//   }
//   s3.getObject(params, callback)
// }

const walkSync = function (dir, filelist = []) {
  fs.readdirSync(dir).forEach(function (file) {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file))
  })
  return filelist
}

if (process.argv[2] === 'upload') {
  // always upload style files to s3
  const files = walkSync('./build')
  files.push('index.html')
  files.forEach(file => {
    // console.log("File: ", path.basename(file))
    uploadFile(file)
  })
} else {
  console.error('Invalid argument', process.argv[2])
}
