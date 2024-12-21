const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",//reference to User collection
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is invalid for status`,
      },
    },
  },
  { timestamps: true }
);

//indexing fromUserId and toUserId together and this is called compound indexng;
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//these pre function like middleware which are running before save the data in database and these are the schema method and functions
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if fromUserId  is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("ERROR : Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
