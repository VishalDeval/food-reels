const foodPartnerModel = require("../models/foodPartner.model.js");
const foodModel=require("../models/food.model.js");

async function getFoodPartnerById(req,res){
    const foodPartnerId=req.params.id;
    const foodPartner=await foodPartnerModel.findById(foodPartnerId);
    const foodItems=await foodModel.find({foodPartnerId:foodPartnerId});
    if(!foodPartner){
        return res.status(404).json({
            message:"Food partner not found"
        })
    }
    res.status(200).json({
        message:"Food partner retrieved successfully",
        ...foodPartner.toObject(),
        foodItems:foodItems,
    })
}

module.exports={getFoodPartnerById}