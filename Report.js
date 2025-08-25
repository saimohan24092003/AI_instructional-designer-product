const mongoose = require("mongoose");

const objectiveSchema = new mongoose.Schema(
  {
    text: String
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    text: String
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    sourceTitle: String,
    summary: String,
    learningObjectives: [objectiveSchema],
    keyTopics: [topicSchema],
    strengths: [String],
    gaps: [String],
    suggestedStructure: [String],
    smeQuestions: [questionSchema],
    deliveryStrategies: [String],
    assessmentPlan: [
      new mongoose.Schema(
        {
          type: String, // e.g., "Formative Quiz", "Summative Project"
          purpose: String,
          timing: String, // e.g., "end of module 1"
          example: String
        },
        { _id: false }
      )
    ],
    // New AI-generated planning artifacts
    strategyPlan: {
      type: Object,
      default: null
    },
    courseBlueprint: {
      type: Object,
      default: null
    },
    status: { type: String, enum: ["Pending", "In Review", "Approved"], default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);


