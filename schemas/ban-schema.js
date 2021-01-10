const mongoose = require('mongoose');

const required = {
    type: String,
    require: true,
};

const banSchema = mongoose.Schema({
    _id: required,
    message: required,
});

module.exports = mongoose.model('ban-messages', banSchema);