const jwt = require('jsonwebtoken');
const   JWT_SECRET   = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

const authorizationToken = async (req, res, next) => {
    try {         console.log(req.body,"in middleware")

        const  authorization  = req.headers.authorization ;
 
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Invalid authorization header" });
        }

        const token = authorization.replace("Bearer ", "");
         
        const payload = jwt.verify(token,JWT_SECRET);
 
        const { _id } = payload;
        const userdata = await User.findById(_id);

        if (!userdata) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = userdata;
         next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authorizationToken;
