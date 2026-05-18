const mongoose=require("mongoose")

const  aiCacheSchema=new mongoose.Schema({
    prompt:{
        type:String,
        required:true,
        unique:true,
    },
    response:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true})

module.exports=mongoose.model("AICache",aiCacheSchema);