const mongoose = require('mongoose')

const payrollSchema = new mongoose.Schema({
    Name : String ,
   
})

module.exports = mongoose.model('aka' , payrollSchema)