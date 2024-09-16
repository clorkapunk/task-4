const jwt = require('jsonwebtoken')
const {User} = require("../model/model");

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        let email = req.user?.email
        if(!email){
            email = req.body?.email
        }
        let statuses = ['Active']
        let candidate = await User.findOne({email: email})
        if(!candidate){
            return res.status(400).json({message: "User not found"})
        }
        if(!statuses.includes(candidate.status)){
            return res.status(403).json({message: "Access denied"})
        }
        await User.findOneAndUpdate({email: email}, {lastLoginTime: Date.now()})
        next()
    } catch (e) {
        console.log(e)
        return res.status(401).json({message: "Not authorized 2"})
    }
}
