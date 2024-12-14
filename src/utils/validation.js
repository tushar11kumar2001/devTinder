const validator = require("validator");
const validateSignUpData = (req)=>{
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName ||  !lastName) throw new Error("Name is not valid!");
    else if(!validator.isEmail(emailId)) throw new Error("Email is not valid");
    else if(!validator.isStrongPassword(password)) throw new Error("Please enter a stronge password");
};

const validateUpdateProfileData = (req,res)=>{
        const AllowedEditFields = [
            "firstName",
            "lastName",
            "age",
            "gender",
            "skills",
            "photoUrl",
            "about"
        ];
        
        const isAllowedUpdate = Object.keys(req.body).every(field => AllowedEditFields.includes(field));
        return isAllowedUpdate;
}

module.exports = {
    validateSignUpData,
    validateUpdateProfileData
}