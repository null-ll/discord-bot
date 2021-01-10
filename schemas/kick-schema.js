const mongoose = require('mongoose');

const required = {
    type: String,
    require: true,
};

const kickSchema = mongoose.Schema({
    _id: required,
    message: required,
});

module.exports = mongoose.model('kick-messages', kickSchema);