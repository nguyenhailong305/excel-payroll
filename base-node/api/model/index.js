const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    Name : String,    
    Age : String,
    TimeOT150 : {type : String , default : 0},    
    TimeOT200 :  {type : String , default : 0},
    TimeOT300 :  {type : String , default : 0},
    Bonus :  {type : String , default : 0} ,
    Support :  {type : String , default : 0},
    Insurance :  {type : String , default : 0},
    No :  {type : String , default : 0},
    TruNo :  {type : String , default : 0},
    ConNo :  {type : String , default : 0},
    Salary :  {type : String , default : 0},
})

module.exports = mongoose.model('aka' , ItemSchema)