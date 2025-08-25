import React, { useEffect, useMemo, useRef, useState } from "react";
import { Upload, FileText, BarChart3, Brain, Sparkles, MessageSquare, Target, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Search, Filter, Download, Share2, Eye, Zap, BookOpen, Users, Globe, PlayCircle, Mic, FileImage, Settings, ChevronRight, Bot, Star, Award, Activity, PieChart, Users2, Lightbulb, Calendar, ArrowRight, X, ArrowDown } from "lucide-react";
import SecurityMessage from '../components/SecurityMessage';
import EnhancedFinalReport from '../components/EnhancedFinalReport';

// Enhanced workflow states
const WORKFLOW_STAGES = {
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  SME_INTERVIEW: 'sme_interview',
  CONTENT_ANALYSIS: 'content_analysis',
  GAP_ANALYSIS: 'gap_analysis',
  FINAL_REPORT: 'final_report'
};

// UPDATED: Corrected ChatGPT API Service to match your existing backend
const ChatGPTAPIService = {
  // Updated to match your backend port
baseURL: 'http://localhost:5000/api',
  
  // File upload and content extraction - matches your existing /api/upload
  async uploadAndProcess(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }    
  },

  // Generate SME questions - matches your existing /api/generate-sme-questions
  async generateSMEQuestions(fileId, extractedContent, onProgress) {
    try {
      const response = await fetch(`${this.baseURL}/generate-sme-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, extractedContent })
      });

      if (!response.ok) {
        throw new Error(`SME questions generation failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Simulate streaming effect for UI (since your backend returns immediately)
      if (onProgress) {
        const text = JSON.stringify(result, null, 2);
        const words = text.split(' ');
        
        for (let i = 0; i <= words.length; i++) {
          const partial = words.slice(0, i).join(' ');
          onProgress(partial, i === words.length);
          
          // Small delay for typing effect
          if (i < words.length) {
            await new Promise(resolve => setTimeout(resolve, 30));
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('SME questions generation error:', error);
      throw error;
    }
  },

  // Content analysis - matches your existing /api/content-analysis
  async performContentAnalysis(fileId, smeAnswers, extractedContent, onProgress) {
    try {
      const response = await fetch(`${this.baseURL}/content-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, extractedContent, smeAnswers })
      });

      if (!response.ok) {
        throw new Error(`Content analysis failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Simulate streaming effect for UI
      if (onProgress) {
        const text = JSON.stringify(result, null, 2);
        const words = text.split(' ');
        
        for (let i = 0; i <= words.length; i++) {
          const partial = words.slice(0, i).join(' ');
          onProgress(partial, i === words.length);
          
          if (i < words.length) {
            await new Promise(resolve => setTimeout(resolve, 25));
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Content analysis error:', error);
      throw error;
    }
  },

  // Gap analysis - matches your existing /api/gap-analysis  
  async performGapAnalysis(fileId, contentAnalysis, smeAnswers, extractedContent, onProgress) {
    try {
      const response = await fetch(`${this.baseURL}/gap-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, extractedContent, contentAnalysis, smeAnswers })
      });

      if (!response.ok) {
        throw new Error(`Gap analysis failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Simulate streaming effect for UI
      if (onProgress) {
        const text = JSON.stringify(result, null, 2);
        const words = text.split(' ');
        
        for (let i = 0; i <= words.length; i++) {
          const partial = words.slice(0, i).join(' ');
          onProgress(partial, i === words.length);
          
          if (i < words.length) {
            await new Promise(resolve => setTimeout(resolve, 20));
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Gap analysis error:', error);
      throw error;
    }
  },

  // Get analysis results - matches your existing /api/analysis/:fileId/:stage
  async getAnalysisResults(fileId, stage) {
    try {
      const response = await fetch(`${this.baseURL}/analysis/${fileId}/${stage}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get analysis: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get analysis error:', error);
      throw error;
    }
  },

  // Health check - matches your existing /api/health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', error: error.message };
    }
  }
};

// Enhanced Streaming Progress Component
const StreamingProgress = ({ stage, currentText, isComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentText && currentIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, 20); // Typing effect speed
      
      return () => clearTimeout(timer);
    }
  }, [currentText, currentIndex]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [stage]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isComplete ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <div className="animate-spin">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {stage === 'sme_questions' && 'Generating SME Questions'}
            {stage === 'content_analysis' && 'Analyzing Content'}
            {stage === 'gap_analysis' && 'Performing Gap Analysis'}
          </h3>
          <p className="text-sm text-gray-600">
            {isComplete ? 'Analysis complete' : 'AI is processing...'}
          </p>
        </div>
      </div>
      
      {displayText && (
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {displayText}
            {!isComplete && <span className="animate-pulse">|</span>}
          </pre>
        </div>
      )}
    </div>
  );
};

// Enhanced SME Interview Bot with Real-time Processing
const RealTimeSMEBot = ({ isOpen, onComplete, onClose, questions, fileId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleNextQuestion = async () => {
    if (currentAnswer.trim()) {
      const newAnswers = {
        ...answers,
        [questions[currentQuestion]]: currentAnswer // Use question as key for clarity
      };
      setAnswers(newAnswers);
      setCurrentAnswer("");
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsProcessing(true);
        await onComplete(newAnswers);
        setIsProcessing(false);
      }
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">SME Interview Assistant</h2>
                <p className="text-sm text-gray-600">Real-time content validation powered by AI</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-indigo-600 font-medium">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing SME Responses</h3>
              <p className="text-gray-600">AI is analyzing your responses and preparing content analysis...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">Question {currentQuestion + 1}</h3>
                <p className="text-gray-800">{questions[currentQuestion]}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response *
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Please provide your detailed response..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide as much detail as possible to help AI generate accurate analysis
                </p>
              </div>
            </div>
          )}
        </div>

        {!isProcessing && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>Next Question <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Complete & Analyze <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Workflow Progress Component (keeping your existing design)
const WorkflowProgress = ({ currentStage, completedStages }) => {
  const stages = [
    { id: WORKFLOW_STAGES.UPLOAD, title: "Content Upload", icon: Upload },
    { id: WORKFLOW_STAGES.PROCESSING, title: "Initial Processing", icon: Brain },
    { id: WORKFLOW_STAGES.SME_INTERVIEW, title: "SME Interview", icon: Users2 },
    { id: WORKFLOW_STAGES.CONTENT_ANALYSIS, title: "Content Analysis", icon: BarChart3 },
    { id: WORKFLOW_STAGES.GAP_ANALYSIS, title: "Gap Analysis", icon: Target },
    { id: WORKFLOW_STAGES.FINAL_REPORT, title: "Final Report", icon: FileText }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Progress</h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = currentStage === stage.id;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isCurrent ? 'bg-indigo-500 border-indigo-500 text-white' :
                  'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <stage.icon className="w-6 h-6" />
                  )}
                </div>
                <span className={`text-sm mt-2 font-medium ${
                  isCompleted ? 'text-green-600' :
                  isCurrent ? 'text-indigo-600' :
                  'text-gray-400'
                }`}>
                  {stage.title}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  completedStages.includes(stages[index + 1].id) ? 'bg-green-500' :
                  currentStage === stages[index + 1].id ? 'bg-indigo-500' :
                  'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Main Dashboard Component with Real ChatGPT Integration
export default function ChatGPTIntegratedDashboard() {
  const [currentStage, setCurrentStage] = useState(WORKFLOW_STAGES.UPLOAD);
  const [completedStages, setCompletedStages] = useState([]);
  const [processedData, setProcessedData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSMEBot, setShowSMEBot] = useState(false);
  const [smeQuestions, setSMEQuestions] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [streamingData, setStreamingData] = useState({ stage: null, text: '', isComplete: false });
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [showSecurity, setShowSecurity] = useState(true);

  // Check backend health on component mount
  useEffect(() => {
    ChatGPTAPIService.checkHealth().then(setBackendStatus);
  }, []);

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setCurrentStage(WORKFLOW_STAGES.PROCESSING);
    setError(null);
    
    try {
      // Step 1: Upload and initial processing
      const uploadResult = await ChatGPTAPIService.uploadAndProcess(file);
      setFileId(uploadResult.fileId);
      setProcessedData(prev => ({ ...prev, upload: uploadResult }));
      
      // Step 2: Generate SME questions with streaming
      setStreamingData({ stage: 'sme_questions', text: '', isComplete: false });
      
      const smeResult = await ChatGPTAPIService.generateSMEQuestions(
        uploadResult.fileId, 
        uploadResult.extractedContent,
        (chunk, accumulated) => {
          setStreamingData({ stage: 'sme_questions', text: accumulated, isComplete: false });
        }
      );
      
      setStreamingData({ stage: 'sme_questions', text: JSON.stringify(smeResult, null, 2), isComplete: true });
      setSMEQuestions(smeResult.questions);
      setProcessedData(prev => ({ ...prev, smeQuestions: smeResult }));
      
      // Mark processing complete and move to SME interview
      setTimeout(() => {
        setCompletedStages([WORKFLOW_STAGES.UPLOAD, WORKFLOW_STAGES.PROCESSING]);
        setCurrentStage(WORKFLOW_STAGES.SME_INTERVIEW);
        setShowSMEBot(true);
        setIsProcessing(false);
        setStreamingData({ stage: null, text: '', isComplete: false });
      }, 2000);
      
    } catch (error) {
      console.error('Upload processing failed:', error);
      setError('Failed to process uploaded file. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSMEComplete = async (answers) => {
    setShowSMEBot(false);
    setIsProcessing(true);
    setCurrentStage(WORKFLOW_STAGES.CONTENT_ANALYSIS);
    setError(null);
    
    try {
      // Step 3: Content Analysis with streaming
      setStreamingData({ stage: 'content_analysis', text: '', isComplete: false });
      
      const contentAnalysis = await ChatGPTAPIService.performContentAnalysis(
        fileId, 
        answers, 
        processedData.upload.extractedContent,
        (chunk, accumulated) => {
          setStreamingData({ stage: 'content_analysis', text: accumulated, isComplete: false });
        }
      );
      
      setStreamingData({ stage: 'content_analysis', text: JSON.stringify(contentAnalysis, null, 2), isComplete: true });
      setProcessedData(prev => ({ ...prev, contentAnalysis }));
      
      setCompletedStages(prev => [...prev, WORKFLOW_STAGES.SME_INTERVIEW]);
      
      // Step 4: Gap Analysis with streaming
      setTimeout(async () => {
        setCurrentStage(WORKFLOW_STAGES.GAP_ANALYSIS);
        setStreamingData({ stage: 'gap_analysis', text: '', isComplete: false });
        
        const gapAnalysis = await ChatGPTAPIService.performGapAnalysis(
          fileId, 
          contentAnalysis, 
          answers, 
          processedData.upload.extractedContent,
          (chunk, accumulated) => {
            setStreamingData({ stage: 'gap_analysis', text: accumulated, isComplete: false });
          }
        );
        
        setStreamingData({ stage: 'gap_analysis', text: JSON.stringify(gapAnalysis, null, 2), isComplete: true });
        setProcessedData(prev => ({ ...prev, gapAnalysis }));
        
        setTimeout(() => {
          setCompletedStages(prev => [...prev, WORKFLOW_STAGES.CONTENT_ANALYSIS, WORKFLOW_STAGES.GAP_ANALYSIS]);
          setCurrentStage(WORKFLOW_STAGES.FINAL_REPORT);
          setIsProcessing(false);
          setStreamingData({ stage: null, text: '', isComplete: false });
        }, 2000);
      }, 2000);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Analysis failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStage(WORKFLOW_STAGES.UPLOAD);
    setCompletedStages([]);
    setProcessedData({});
    setIsProcessing(false);
    setShowSMEBot(false);
    setSMEQuestions([]);
    setFileId(null);
    setStreamingData({ stage: null, text: '', isComplete: false });
    setError(null);
  };

  return (
     <>
     {/* Security message overlay */}
      {showSecurity && (
        <SecurityMessage 
          onComplete={() => setShowSecurity(false)}
          duration={3000}
        />
      )}
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Real-time AI Instructional Design</h1>
              <p className="text-white/90 text-lg">
                Powered by ChatGPT for comprehensive content analysis and gap identification
              </p>
            </div>
          </div>
          
          {/* Backend Status Display */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${
              backendStatus?.status === 'ok' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-sm text-white/80">
              Backend: {backendStatus?.status === 'ok' ? 'Connected' : 'Disconnected'} | 
              OpenAI: {backendStatus?.openai ? 'Configured' : 'Not Configured'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workflow Progress */}
        <WorkflowProgress currentStage={currentStage} completedStages={completedStages} />

        {/* Upload Section */}
        {currentStage === WORKFLOW_STAGES.UPLOAD && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Learning Content</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to browse</h3>
              <p className="text-gray-600 mb-4">PDF, DOCX, PPT, TXT, MP3, MP4 supported</p>
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                accept=".pdf,.docx,.ppt,.pptx,.txt,.mp3,.mp4"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-indigo-700 transition-colors">
                Select File
              </label>
            </div>
          </div>
        )}

        {/* Streaming Analysis Display */}
        {streamingData.stage && (
          <StreamingProgress 
            stage={streamingData.stage}
            currentText={streamingData.text}
            isComplete={streamingData.isComplete}
          />
        )}

        {/* Enhanced Final Report */}
        {currentStage === WORKFLOW_STAGES.FINAL_REPORT && (
          <EnhancedFinalReport 
            processedData={processedData}
            onReset={resetWorkflow}
          />
        )}

        {/* SME Interview Bot */}
        <RealTimeSMEBot
          isOpen={showSMEBot}
          onComplete={handleSMEComplete}
          onClose={() => setShowSMEBot(false)}
          questions={smeQuestions}
          fileId={fileId}
        />
      </div>
    </div>
    </> 
  );
}