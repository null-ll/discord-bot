const mongoose = require('mongoose');

const required = {
    type: String,
    require: true,
};

const prefixScema = mongoose.Schema({
    _id: required,
    prefix: required,
});

module.exports = mongoose.model('guild-prefixes', prefixScema);