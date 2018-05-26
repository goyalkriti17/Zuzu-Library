var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var schema = new Schema({
    ISBN: {
        type: String,
        unique: true
        // default: shortid.generate
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    }
});

// on every save, add the date
// schema.pre('save', function (next) {
//     // get the current date
//     var currentDate = new Date();
//
//     // change the updated_at field to current date
//     this.updatedAt = currentDate;
//
//     // if created_at doesn't exist, add to that field
//     if (! this.createdAt) {
//         this.createdAt = currentDate;
//     }
//
//     next();
// });

module.exports = mongoose.model('Book', schema, 'books');