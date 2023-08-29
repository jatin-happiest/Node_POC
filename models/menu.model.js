const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
    item: String,
    quantity: Number,
    description: String
});

module.exports = mongoose.model('Menu', menuSchema);
