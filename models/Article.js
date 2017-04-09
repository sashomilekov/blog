/**
 * Created by Kasket on 6.4.2017 г..
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


let articleSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required:true},
    author:{type: ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()},
    imagePath: {type: String}


});

const Article = mongoose.model('Article', articleSchema);

module.export = Article;


