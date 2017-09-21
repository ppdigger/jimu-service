var express = require('express');
var jwt = require("jwt-simple");
var router = express.Router();
var db = require('../database/db');
var sd = require('silly-datetime');
var formidable = require('formidable');

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

router.post('/signup', function(req, res, next){
	let _email = req.body.email,
		_password = req.body.password,
		_name = req.body.name,
		_query = {email: _email, password: _password, name: _name};
	db.authenticate({ email: _email }, function(err, doc){
		if (err) {
		  console.log('not found, and err is ', err)
		  return next(err)
		} else{
			if (doc === null || doc.length === 0) {
				db.authenticate({ name: _name }, function(err, doc){
					if(err){
						console.log('not found, and err is ', err)
						return next(err)
					} else{
						if(doc === null || doc.length === 0){
							db.signup(_query, function(err, doc){
								if(err){
									console.log('signup err is ', err)
									return next(err)
								} else{
									res.json({status:0,message:"register success",data:[]});
								}
							})
						} else{
							console.log('name has been registered');
							res.json({status:1,message:"name has been registered",data:[]});
						}
					}
				})
			} else{
				console.log('email has been registered');
				res.json({status:1,message:"email has been registered",data:[]});
			}
		}
	})
})

router.post('/authenticate', function(req, res, next){
	var _email = req.body.email,
			_password = req.body.password,
			_query = {email: _email};
	db.authenticate(_query, function(err, doc){
		if(err){
			console.log('login err is ', err)
			return next(err)
		} else{
			if(doc === null || doc.length === 0){
				res.json({status: 1, message:"email has been registered", data:[]})
			} else{
				if(_password === doc.password){
					var expires = Date.now() + 7*24*60*60*1000
					var name = doc.name
					var id = doc._id
					var token = jwt.encode({
						iss: id,
						name: name,
						exp: expires,
						aud: 'ppdigger'
					}, req.app.get('jwtTokenSecret'))
					res.json({status:0,message:"login success",data:{
						id: id,
						token: token,
						name: name,
						expires: expires
					}});
				}else{
					res.json({status:1,message:"password error",data:[]});
				}
			}
		}
	})
})

module.exports = router;
