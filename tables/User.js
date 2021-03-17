const mongo = require("mongoose");
const schema = mongo.Schema;

const userSchema = new schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    contact : {
        type: String,
        required : true
    },    
    clgname : {
        type: String,
        required : true
    },    
    branch : {
        type: String,
        required : true
    },    
    timeStamp : {
        type: String,
        required : true
    },    
})

module.exports = User = mongo.model("myUser",userSchema);