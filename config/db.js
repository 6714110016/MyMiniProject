const mongoose = require("mongoose");

const dbUrl = "mongodb://127.0.0.1:27017/TECHGENSHOP";

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected MongoDB");
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose;