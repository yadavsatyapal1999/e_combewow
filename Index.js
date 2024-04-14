

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();


app.use(express.static("uploads"));
app.use(cors({})); // to allow cross origin request
app.use(bodyParser.json()) //  to parse json

mongoose.connect("mongodb+srv://satyapalmechworld:axN0ykTi1TcZ18ED@cluster0.qkhyapj.mongodb.net/E_Commerce?retryWrites=true&w=majority").then((res)=>{
    console.log("Sucessfully Connected to DB")
})
.catch((res)=>{
    console.log("Connection refused")
})

app.listen(5000,()=>{
    console.log("hosting at port 5000")
})