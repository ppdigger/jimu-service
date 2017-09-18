var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  
var db = mongoose.connect('mongodb://localhost/shao',{
	useMongoClient: true
});
var Schema = mongoose.Schema;

// user
var userScheMa = new Schema({
	email: String,
	password: String,
	name: String,
	avatar: String
})
var User = db.model('User', userScheMa);
exports.authenticate = function(_query, cb){
	User.findOne(_query, function(err, doc){
		if(err){
			cb(err, null)
		} else{
			cb(null, doc)
		}
	})
}
exports.signup = function(_query, cb){
	User.create(_query, function(err, doc){
		if(err){
			cb(err, null)
		} else{
			cb(null, doc)
		}
	})
}

// article
var articleScheMa = new Schema({
	title: String,
	picture: String,
	blockquote: String,
	body: String,
	createTime: String,
	author: { type: Schema.Types.ObjectId, ref: 'User' }
})
var Article = db.model('Article', articleScheMa);
exports.findArticleList = function(_query, cb){
	let query
	if(_query.search == '' || _query.search == undefined ){
		query = {}
	} else{
		query = { author: mongoose.Types.ObjectId(_query.search) }
	}
	Article.find(query, null, { skip: _query['page']* _query['limit'], limit: parseInt(_query['limit']), sort:{ 'createTime': -1 } })
			.populate('author', 'name avatar')
			.exec(function(err, doc){
				if(err){
					cb(err, null)
				} else{
					cb(null, doc)
				}
			})
}
