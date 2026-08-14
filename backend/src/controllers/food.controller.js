 const foodModel=require("../models/food.model.js");
const storageService=require("../services/storage.service.js");
const {v4:uuid}=require("uuid");

async function createFood(req,res){
    if(!req.foodPartner){
        return res.status(403).json({message:"Forbidden: food partners only"});
    }
    const fileUploadResult=await storageService.uploadFile(req.file.buffer,uuid())
    const foodItem=await foodModel.create({
        name:req.body.name,
        video:fileUploadResult.url,
        description:req.body.description,
        foodPartnerId:req.foodPartner._id
    })

    res.status(201).json({
        message:"food created successfully",
        food:foodItem
    })
}

async function getFoodItems(req,res){
    const foodItems=await foodModel.find({});
    res.status(200).json({
        message:"Food items retrieved successfully",
        foods:foodItems
    })
}

module.exports={createFood,getFoodItems}