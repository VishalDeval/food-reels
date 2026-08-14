const express=require("express");
const authController=require("../controllers/auth.controller.js")
const router=express.Router();


router.post('/user/register',authController.RegisterUser);
router.post('/user/login',authController.LoginUser)
router.get('/user/logout',authController.Logout)


router.post('/foodPartner/register',authController.RegisterFoodPartner);
router.post('/foodPartner/login',authController.LoginFoodPartner)
router.get('/foodPartner/logout',authController.LogoutFoodPartner)

module.exports=router;