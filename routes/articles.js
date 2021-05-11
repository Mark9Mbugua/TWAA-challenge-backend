const router = require('express').Router();
const multer = require('multer');
const path = require('path');
let Article = require('../models/article.model');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({storage: storage});

router.get('/', (req, res) => {
    Article.find()
        .then(articles => res.status(200).json(articles))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/create', upload.single('image'), (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const image = req.file.originalname;

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