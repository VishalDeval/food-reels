const dotenv =require('dotenv');
require('dotenv').config();
const app=require("./src/app.js");
const connecteDB=require("./src/db/db.js");


connecteDB();

app.listen(3000,()=>{
    console.log("Server running on port 3000")
}) 