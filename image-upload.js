
var express = require('express')
const bodyParser = require('body-parser');
var router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
require("dotenv/config");   
router.use(bodyParser.json());

AWS.config.update({
    region: 'us-east-1',
    apiVersion: 'latest',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
    }
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({ storage: storage });
router.post('/imageUpload', upload.single('image'), (req, res) => {
    const s3 = new AWS.S3();
    const image = req.image;
    console.log(req.file);
    var data = [];
    data.push(req.file);
    const bodyData = Buffer.from(data, 'binary');
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: bodyData,
    };
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        res.send({
            "response_code": 200,
            "response_message": "Success",
            "response_data": data
        });
    });
    res.send(apiResponse({ message: 'Image uploaded successfully.', image }));
});

function apiResponse(results) {
    return JSON.stringify({ "status": 200, "error": null, "response": results });
}

module.exports = router;