const express=require("express");
const authRoutes=require("./routes/auth.routes.js");
const foodRoutes=require("./routes/food.routes.js")
const foodPartnerRoutes=require("./routes/food-partner.routes.js")
const cookieParser = require("cookie-parser");
const cors=require("cors");
const app=express();
app.use(cors({ 
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/food',foodRoutes)
app.use('/api/food-partner',foodPartnerRoutes)

app.get('/',(req,res)=>{
    console.log("hello");
})
module.exports=app;