const mongoose = require("mongoose");

const smeAnswerSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      new mongoose.Schema(
        {
          question: String,
          answer: String
        },
        { _id: false }
      )
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SMEAnswer", smeAnswerSchema);


