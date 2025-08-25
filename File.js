const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storagePath: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);


