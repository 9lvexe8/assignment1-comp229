var mongoose=require("mongoose");
const feedSchema={
  fullName:String,
  mobile:String,
  email:String,
  content:String
}
module.exports=mongoose.model("Feed",feedSchema);
