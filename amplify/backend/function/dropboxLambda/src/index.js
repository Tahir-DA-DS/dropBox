const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

const s3 = new AWS.S3();
const bucketName = 's33310a608';  

// Multer storage setup for direct S3 uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read',  
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    }
  })
});

// API route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    fileUrl: req.file.location
  });
});

module.exports = app;