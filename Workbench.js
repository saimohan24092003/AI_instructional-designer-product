import React, { useState } from "react";
import { useAuth, apiBaseUrl } from "../auth/AuthContext";
import UploadAnalyze from "../components/UploadAnalyze";
import SmeQAPanel from "../components/SmeQAPanel";
import FinalReportPanel from "../components/FinalReportPanel";
import axios from "axios";

const TABS = ["Analyze", "SME Q&A", "Report", "Plan"];

export default function Workbench() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("Analyze");
  const [currentReport, setCurrentReport] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [planning, setPlanning] = useState(false);
  const [plan, setPlan] = useState(null);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const updateAnswer = (idx, value) => {
    setCurrentReport((prev) => {
      const next = { ...prev };
      next.smeQuestions[idx] = { ...next.smeQuestions[idx], answer: value };
      return next;
    });
  };

  const generatePlan = async () => {
    if (!currentReport?._id) return;
    setPlanning(true);
    setError("");
    try {
      const res = await axios.post(`${apiBaseUrl()}/api/reports/${currentReport._id}/plan`, {
        answers: (currentReport.smeQuestions || []).map((q) => ({ question: q.question, answer: q.answer || "" }))
      }, { headers });
      setPlan(res.data?.data || res.data);
      setActiveTab("Plan");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to generate plan");
    } finally {
      setPlanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-teal-50 font-brand text-gray-900">
      <header className="sticky top-0 bg-white shadow flex items-center px-6 py-4 z-10 animate-fade-in">
        <nav className="flex gap-2 sm:gap-4">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm sm:text-base font-medium px-3 py-2 rounded-md transition-smooth focus-ring ${
                activeTab === tab
                  ? "bg-gradient-to-r from-brand-500 to-teal-500 text-white shadow-md scale-105"
                  : "hover:bg-indigo-100 hover-lift"
              }`}
              aria-current={activeTab === tab ? "page" : undefined}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="ml-auto text-xs text-gray-500 transition-smooth">
          {saving ? (
            <span className="flex items-center gap-2 animate-pulse-slow">
              <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
              Saving...
            </span>
          ) : ("")}
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-6">
        {error && (
          <div className="cs-panel p-4 text-sm text-red-600 animate-slide-in-left">{error}</div>
        )}

        <div className="transition-all duration-300 ease-out">
          {activeTab === "Analyze" && (
            <div className="animate-fade-in">
              <UploadAnalyze onAnalyzed={(r) => { setCurrentReport(r); setActiveTab("SME Q&A"); }} />
            </div>
          )}

          {activeTab === "SME Q&A" && (
            <div className="animate-fade-in space-y-4">
              {currentReport ? (
                <>
                  <SmeQAPanel
                    questions={currentReport.smeQuestions || []}
                    onChange={updateAnswer}
                    saving={saving}
                  />
                  <div>
                    <button
                      onClick={generatePlan}
                      disabled={planning}
                      className={`px-4 py-2 rounded-md text-white ${planning ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    >
                      {planning ? "Generating plan..." : "Generate Strategy & Blueprint"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="cs-panel p-6 animate-scale-in">Upload or analyze content first to generate questions.</div>
              )}
            </div>
          )}

          {activeTab === "Report" && currentReport && (
            <div className="animate-fade-in">
              <FinalReportPanel report={currentReport} />
            </div>
          )}

          {activeTab === "Plan" && plan && (
            <div className="animate-fade-in cs-panel p-6 space-y-4">
              <h2 className="text-xl font-semibold">Instructional Strategy</h2>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(plan.strategyPlan, null, 2)}</pre>
              <h2 className="text-xl font-semibold">Course Blueprint</h2>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(plan.courseBlueprint, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


