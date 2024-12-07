const adminAuth = (req,res,next)=>{
    const token = "xy";
    if(token === "xyz") next();
    else res.send("You have not authorization..")
    
}

module.exports = {
    adminAuth
}