const express=require("express");
const { authUserMiddleware } = require("../middleware/auth.middleware");
const foodPartnerController=require("../controllers/food-partner.controller.js");
const router=express.Router();

router.get("/:id",authUserMiddleware,foodPartnerController.getFoodPartnerById);
module.exports=router; 