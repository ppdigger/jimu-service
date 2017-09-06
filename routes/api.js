var express = require('express');
var jwt = require("jwt-simple");
var router = express.Router();
var db = require('../database/db');
var sd = require('silly-datetime');

router.post('/articleList', function(req, res, next){
	console.log('a');
	var _page = req.body.page,
		_limit = req.body.limit,
		_search = req.body.search,
		_query = {page: _page, limit: _limit, search: _search};
	db.findArticleList(_query, function(err, doc){
		if(err){
			console.log('not found, and err is ', err)
			return next(err);
		} else{
			if(doc ===null || doc.length === 0){
				res.json({status:1,message:"no data",data:[]})
			} else{
				res.json({status:0,message:"",data:doc})
			}
		}
	})
})

module.exports = router;
