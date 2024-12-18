const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is invalid for status`
        }
    }
},
{ timestamps : true }
);


//these pre function like middleware which are running before save the data in database and these are the schema method and functions 
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if fromUserId  is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("ERROR : Cannot send connection request to yourself")
    }
    next();
});


const ConnectionRequestModel = mongoose.model("connectionRequest",connectionRequestSchema);



module.exports = ConnectionRequestModel;