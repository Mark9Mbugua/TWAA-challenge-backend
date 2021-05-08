const router = require('express').Router();
let Article = require('../models/article.model');

router.route('/').get((req, res) => {
    Article.find()
        .then(articles => res.status(200).json(articles))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const date = Date.parse(req.body.date);

    const newArticle = new Article({
        title, 
        body, 
        date
    });

    newArticle.save()
        .then(() => res.status(201).json('Article created.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;