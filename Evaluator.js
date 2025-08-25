import React, { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import AnalysisResults from "../components/AnalysisResults";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { GraduationCap, RotateCcw, Brain, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

// Real ChatGPT API Service for your backend
class ClamshellAIService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/ai';
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async uploadAndAnalyze(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseURL}/upload-analyze`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
    return result.success ? result.analysis : result;
  }

  async generateSMEQuestions(fileId) {
    const response = await fetch(`${this.baseURL}/generate-sme-questions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ fileId }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'SME question generation failed');
    }

    const result = await response.json();
    return result.success ? result : result;
  }

  async performContentAnalysis(fileId, smeAnswers) {
    const response = await fetch(`${this.baseURL}/content-analysis`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ fileId, smeAnswers }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Content analysis failed');
    }

    const result = await response.json();
    return result.success ? result.contentAnalysis : result;
  }

  async performGapAnalysis(fileId) {
    const response = await fetch(`${this.baseURL}/gap-analysis`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ fileId }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Gap analysis failed');
    }

    const result = await response.json();
    return result.success ? result.gapAnalysis : result;
  }
}

// Processing stages
const STAGES = {
  UPLOAD: 'upload',
  INITIAL_ANALYSIS: 'initial_analysis',
  SME_QUESTIONS: 'sme_questions',
  CONTENT_ANALYSIS: 'content_analysis',
  GAP_ANALYSIS: 'gap_analysis',
  COMPLETE: 'complete'
};

export default function Evaluator() {
  const { user } = useAuth();
  const [currentStage, setCurrentStage] = useState(STAGES.UPLOAD);
  const [analysisData, setAnalysisData] = useState(null);
  const [smeQuestions, setSMEQuestions] = useState([]);
  const [smeAnswers, setSMEAnswers] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');

  const aiService = new ClamshellAIService();

  const handleFileAnalyze = async (file, extractedContent) => {
    setIsProcessing(true);
    setError('');
    setCurrentStage(STAGES.INITIAL_ANALYSIS);
    setProcessingMessage('Analyzing content with ChatGPT...');

    try {
      // Step 1: Initial analysis with real ChatGPT
      const initialAnalysis = await aiService.uploadAndAnalyze(file);
      setFileId(initialAnalysis.fileId);
      
      // Update data structure to match your existing format
      const analysisResult = {
        fileName: file.name,
        extractedContent: initialAnalysis.extractedContent,
        fileId: initialAnalysis.fileId,
        analysis: {
          grammarScore: Math.round(initialAnalysis.initialAnalysis.readability),
          logicalFlow: initialAnalysis.initialAnalysis.initial_assessment,
          gaps: [], // Will be filled after gap analysis
          sufficiency: initialAnalysis.initialAnalysis.completeness > 7 ? "sufficient" : "needs improvement",
          recommendedLevels: ["Remember", "Understand", "Apply"], // Will be updated after content analysis
          courseOutline: {
            level: "Processing...",
            modules: []
          },
          initialAnalysis: initialAnalysis.initialAnalysis,
          wordCount: initialAnalysis.wordCount,
          characterCount: initialAnalysis.characterCount
        }
      };

      setAnalysisData(analysisResult);
      setCurrentStage(STAGES.SME_QUESTIONS);
      setProcessingMessage('Generating SME validation questions...');

      // Step 2: Generate SME questions with ChatGPT
      const smeData = await aiService.generateSMEQuestions(initialAnalysis.fileId);
      setSMEQuestions(smeData.questions || []);
      
      setCurrentStage(STAGES.SME_QUESTIONS);
      setIsProcessing(false);
      setProcessingMessage('');

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
      setIsProcessing(false);
      setCurrentStage(STAGES.UPLOAD);
      setProcessingMessage('');
    }
  };

  const handleSMEComplete = async (answers) => {
    setIsProcessing(true);
    setCurrentStage(STAGES.CONTENT_ANALYSIS);
    setProcessingMessage('Performing detailed content analysis...');
    setSMEAnswers(answers);

    try {
      // Step 3: Content analysis with SME answers
      const contentAnalysis = await aiService.performContentAnalysis(fileId, answers);
      
      // Step 4: Gap analysis
      setCurrentStage(STAGES.GAP_ANALYSIS);
      setProcessingMessage('Identifying gaps and recommendations...');
      
      const gapAnalysis = await aiService.performGapAnalysis(fileId);

      // Update analysis data with real ChatGPT results
      setAnalysisData(prev => ({
        ...prev,
        analysis: {
          ...prev.analysis,
          grammarScore: Math.round(contentAnalysis.contentQuality?.score || 8),
          logicalFlow: contentAnalysis.contentQuality?.strengths?.join('. ') || prev.analysis.logicalFlow,
          gaps: gapAnalysis.recommendations || [],
          recommendedLevels: getBloomsLevels(contentAnalysis.bloomsTaxonomy),
          courseOutline: {
            level: `${getBestBloomsLevel(contentAnalysis.bloomsTaxonomy)} Level (Bloom's Taxonomy)`,
            modules: generateModules(contentAnalysis.learningObjectives)
          },
          contentAnalysis,
          gapAnalysis,
          bloomsTaxonomy: contentAnalysis.bloomsTaxonomy,
          feasibilityScore: gapAnalysis.feasibilityScore,
          estimatedDevelopmentTime: gapAnalysis.estimatedDevelopmentTime
        }
      }));

      setCurrentStage(STAGES.COMPLETE);
      setIsProcessing(false);
      setProcessingMessage('');

    } catch (err) {
      console.error('Advanced analysis error:', err);
      setError(err.message || 'Advanced analysis failed');
      setIsProcessing(false);
      setCurrentStage(STAGES.SME_QUESTIONS);
      setProcessingMessage('');
    }
  };

  const getBloomsLevels = (bloomsTaxonomy) => {
    if (!bloomsTaxonomy) return ["Remember", "Understand", "Apply"];
    
    const levels = Object.entries(bloomsTaxonomy)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([level]) => level.charAt(0).toUpperCase() + level.slice(1));
    
    return levels;
  };

  const getBestBloomsLevel = (bloomsTaxonomy) => {
    if (!bloomsTaxonomy) return "Understand";
    
    const highest = Object.entries(bloomsTaxonomy)
      .reduce((max, [level, percentage]) => 
        percentage > max.percentage ? { level, percentage } : max, 
        { level: 'understand', percentage: 0 }
      );
    
    return highest.level.charAt(0).toUpperCase() + highest.level.slice(1);
  };

  const generateModules = (learningObjectives) => {
    if (!learningObjectives || learningObjectives.length === 0) {
      return [
        { title: "Module 1: Introduction and Overview", objectives: ["Understand basic concepts", "Recognize key principles"] },
        { title: "Module 2: Core Knowledge", objectives: ["Describe main processes", "Apply key concepts"] }
      ];
    }

    const half = Math.ceil(learningObjectives.length / 2);
    return [
      {
        title: "Module 1: Foundation and Core Concepts",
        objectives: learningObjectives.slice(0, half)
      },
      {
        title: "Module 2: Application and Advanced Topics", 
        objectives: learningObjectives.slice(half)
      }
    ];
  };

  const handleReset = () => {
    setAnalysisData(null);
    setSMEQuestions([]);
    setSMEAnswers([]);
    setFileId(null);
    setCurrentStage(STAGES.UPLOAD);
    setError('');
    setIsProcessing(false);
    setProcessingMessage('');
  };

  const handleSMEAnswerChange = (index, answer) => {
    const newAnswers = [...smeAnswers];
    newAnswers[index] = answer;
    setSMEAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-brand-600 rounded-xl shadow-medium">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-navy-900">AI-Powered Content Evaluator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional ChatGPT-powered analysis tool for instructional designers with real-time SME validation.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">ChatGPT AI Processing</h3>
                  <p className="text-sm text-blue-700">{processingMessage}</p>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        )}

        {currentStage === STAGES.UPLOAD && !isProcessing ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileAnalyze={handleFileAnalyze} />
            <Card className="mt-8 p-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Enhanced AI Analysis Includes:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Real-time ChatGPT content analysis</li>
                <li>Automated SME validation questions</li>
                <li>Bloom's taxonomy cognitive level mapping</li>
                <li>Gap analysis and improvement recommendations</li>
                <li>Conversion feasibility scoring</li>
                <li>Learning strategy recommendations</li>
              </ul>
            </Card>
          </div>
        ) : currentStage === STAGES.SME_QUESTIONS && !isProcessing ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-navy-900">SME Validation Questions</h2>
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
            </div>
            
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-navy-900">Content Analysis Complete</h3>
              </div>
              <p className="text-gray-600 mb-4">
                ChatGPT has analyzed your content and generated {smeQuestions.length} validation questions. 
                Please answer these questions to enhance the analysis accuracy.
              </p>
            </Card>

            <div className="space-y-4 mb-6">
              {smeQuestions.map((question, index) => (
                <Card key={index} className="p-6">
                  <h4 className="font-semibold text-navy-900 mb-3">Question {index + 1}</h4>
                  <p className="text-gray-700 mb-4">{question}</p>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    rows="3"
                    placeholder="Your answer..."
                    value={smeAnswers[index] || ''}
                    onChange={(e) => handleSMEAnswerChange(index, e.target.value)}
                  />
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => handleSMEComplete(smeAnswers)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3"
                disabled={smeAnswers.filter(a => a?.trim()).length === 0}
              >
                Complete Advanced Analysis
              </Button>
            </div>
          </div>
        ) : (currentStage === STAGES.COMPLETE || analysisData) && !isProcessing ? (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-navy-900">AI Analysis Complete</h2>
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Analyze New File
              </Button>
            </div>
            <AnalysisResults data={analysisData} />
          </div>
        ) : null}
      </div>
    </div>
  );
}