const foodPartnerModel=require("../models/foodPartner.model.js");
const userModel=require("../models/user.model.js");
const jwt=require("jsonwebtoken");

function getToken(req) {
    // Try Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }
    // Fall back to cookies
    return req.cookies.token;
}

async function authFoodPartenerMiddleware(req, res, next) {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, "secret");
        const foodPartner = await foodPartnerModel.findOne({ email: decoded.email });

        if (!foodPartner) {
            return res.status(403).json({ message: "Forbidden: food partners only" });
        }

        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}
async function authUserMiddleware(req,res,next){
    const token=getToken(req);
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try {
        const decoded=jwt.verify(token,"secret"); 
        const user=await userModel.findOne({email:decoded.email});
        req.user=user;    
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid Token"})
    } 
}
module.exports={authFoodPartenerMiddleware,authUserMiddleware};