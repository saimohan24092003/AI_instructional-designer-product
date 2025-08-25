// models/Analysis.js - Add this to your existing models folder
const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to your existing User model
  originalName: { type: String, required: true },
  contentType: String,
  extractedContent: { type: String, required: true },
  
  // Initial AI Analysis
  initialAnalysis: {
    readability: { type: Number, min: 1, max: 10 },
    structure: { type: Number, min: 1, max: 10 },
    completeness: { type: Number, min: 1, max: 10 },
    content_type: { type: String, enum: ['document', 'presentation', 'manual', 'guide', 'text_content'] },
    estimated_length: Number, // minutes
    initial_assessment: String
  },
  
  // SME Questions (enhanced from your existing SMEAnswer model)
  smeQuestions: [{
    question: String,
    answer: String,
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answeredAt: Date
  }],
  
  // Content Analysis Results
  contentAnalysis: {
    bloomsTaxonomy: {
      remember: { type: Number, min: 0, max: 100 },
      understand: { type: Number, min: 0, max: 100 },
      apply: { type: Number, min: 0, max: 100 },
      analyze: { type: Number, min: 0, max: 100 },
      evaluate: { type: Number, min: 0, max: 100 },
      create: { type: Number, min: 0, max: 100 }
    },
    contentQuality: {
      score: { type: Number, min: 1, max: 10 },
      strengths: [String],
      weaknesses: [String]
    },
    learningObjectives: [String],
    recommendedDuration: Number, // hours
    targetAudience: String,
    engagementLevel: { type: Number, min: 1, max: 10 },
    prerequisiteKnowledge: [String]
  },
  
  // Gap Analysis Results
  gapAnalysis: {
    identifiedGaps: [{
      type: { type: String, enum: ['Content Gap', 'Assessment Gap', 'Engagement Gap', 'Technical Gap', 'Accessibility Gap'] },
      description: String,
      priority: { type: String, enum: ['High', 'Medium', 'Low'] },
      impact: String
    }],
    recommendations: [String],
    feasibilityScore: { type: Number, min: 1, max: 10 },
    estimatedDevelopmentTime: String,
    conversionStrategy: String,
    requiredResources: [String],
    expectedOutcomes: {
      learnerEngagement: String,
      knowledgeRetention: String,
      practicalApplication: String,
      completionRate: String
    },
    riskFactors: [String],
    successMetrics: [String]
  },
  
  // Analysis Status
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'sme_review', 'analysis_complete', 'gap_analysis_complete', 'finalized'],
    default: 'uploaded'
  },
  
  // Processing timestamps
  processedAt: Date,
  smeCompletedAt: Date,
  finalizedAt: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ 'initialAnalysis.content_type': 1 });

// Virtual for completion percentage
analysisSchema.virtual('completionPercentage').get(function() {
  let completed = 0;
  const total = 5; // total steps
  
  if (this.initialAnalysis?.readability) completed++;
  if (this.smeQuestions?.length > 0) completed++;
  if (this.contentAnalysis?.bloomsTaxonomy) completed++;
  if (this.gapAnalysis?.feasibilityScore) completed++;
  if (this.status === 'finalized') completed++;
  
  return Math.round((completed / total) * 100);
});

// Instance method to check if ready for next step
analysisSchema.methods.canProceedToSME = function() {
  return this.initialAnalysis && this.initialAnalysis.readability;
};

analysisSchema.methods.canProceedToContentAnalysis = function() {
  return this.smeQuestions && this.smeQuestions.some(q => q.answer);
};

analysisSchema.methods.canProceedToGapAnalysis = function() {
  return this.contentAnalysis && this.contentAnalysis.bloomsTaxonomy;
};

// Static method to get user's analyses
analysisSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ userId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  return query.sort({ createdAt: -1 }).limit(options.limit || 50);
};

// Pre-save middleware to update status based on completion
analysisSchema.pre('save', function(next) {
  if (this.isModified('gapAnalysis') && this.gapAnalysis.feasibilityScore) {
    this.status = 'gap_analysis_complete';
    this.finalizedAt = new Date();
  } else if (this.isModified('contentAnalysis') && this.contentAnalysis.bloomsTaxonomy) {
    this.status = 'analysis_complete';
  } else if (this.isModified('smeQuestions') && this.smeQuestions.some(q => q.answer)) {
    this.status = 'sme_review';
    this.smeCompletedAt = new Date();
  } else if (this.isModified('initialAnalysis') && this.initialAnalysis.readability) {
    this.status = 'processing';
    this.processedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model("Analysis", analysisSchema);