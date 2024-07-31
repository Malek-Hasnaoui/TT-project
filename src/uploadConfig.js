const mongoose = require('mongoose');

const uplodeSchema=new mongoose.Schema({
    filePath:String
})


const Uploads=mongoose.model("Uploads",uplodeSchema) ;
module.exports = Uploads;