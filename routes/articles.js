const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
let Article = require('../models/article.model');

require('dotenv').config();

//local file upload config
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({storage: storage});

const s3 = new aws.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
});

//AWS file config
const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'twaa-challenge',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

router.get('/', (req, res) => {
    Article.find()
        .then(articles => res.status(200).json(articles))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/create', uploadS3.single('image'), (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const image = req.file.location;

    const newArticle = new Article({
        title, 
        body,
        image, 
    });

    newArticle.save()
        .then(() => res.status(201).json('Article created.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;