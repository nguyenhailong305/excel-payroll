const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    Name : String,    
    Age : String,
})

module.exports = mongoose.model('aka' , ItemSchema)