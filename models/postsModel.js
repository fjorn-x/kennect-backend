const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true},
    isPost: {type: Boolean, required: true},
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {timestamps: true}
);

module.exports = mongoose.model("Post", postSchema);
