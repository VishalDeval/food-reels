const express=require("express");
const foodController=require("../controllers/food.controller.js");
const authMiddleware=require("../middleware/auth.middleware.js");
const multer=require("multer");
const router=express.Router();

const upload=multer({
    storage:multer.memoryStorage(),
});
router.post("/",authMiddleware.authFoodPartenerMiddleware,upload.single("video") ,foodController.createFood)
router.get("/",authMiddleware.authUserMiddleware,foodController.getFoodItems);


module.exports=router;  