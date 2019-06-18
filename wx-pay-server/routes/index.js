var express = require('express');
var router = express.Router();
const dao = require('./common/db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query',async (req, res, next) => {
	let data = await dao.query({"id": 1}, "user")
	res.json(data)
})

module.exports = router;
