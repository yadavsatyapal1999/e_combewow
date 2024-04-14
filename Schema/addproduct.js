const mongoose = require("mongoose");

const addProduct =new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:String,required:true},
    details:{type:String,required:true},
   /* image:{type:String,required:true},*/
    stock:{type:Number,required:true},
    category:{type:String,required:true},
})

//userSchema.index({email:1}),{unique :true}) ;
const Products = mongoose.model("Products",addProduct);

module.exports = Products;