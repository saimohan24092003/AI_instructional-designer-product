import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { apiBaseUrl, useAuth } from "../auth/AuthContext";

export default function ReportDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const [report, setReport] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl()}/api/reports/${id}`, { headers });
        setReport(res.data?.data || res.data || null);
      } catch (err) {
        navigate("/dashboard");
      }
    };
    run();
  }, [headers, id, navigate]);

  const updateAnswer = (idx, value) => {
    setReport((prev) => {
      const next = { ...prev };
      next.smeQuestions = [...(prev?.smeQuestions || [])];
      next.smeQuestions[idx] = { ...next.smeQuestions[idx], answer: value };
      return next;
    });
  };

  useEffect(() => {
    if (!report) return;
    const handler = setTimeout(async () => {
      try {
        setSaving(true);
        await axios.post(
          `${apiBaseUrl()}/api/answers/${report._id}`,
          { answers: (report.smeQuestions || []).map((qa) => ({ question: qa.question, answer: qa.answer || "" })) },
          { headers }
        );
      } catch (err) {
        // swallow autosave error
      } finally {
        setSaving(false);
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [report, headers]);

  if (!report) return <div>Loading...</div>;

  const safe = (arr) => Array.isArray(arr) ? arr : [];

  return (
    <div className="grid lg:grid-cols-[240px,1fr] gap-6">
      <aside className="bg-white border rounded-xl p-4 h-max sticky top-6">
        <div className="text-sm font-semibold text-gray-800 mb-2">Workspace</div>
        <nav className="text-sm space-y-1">
          <a href="#analysis" className="block px-3 py-2 rounded hover:bg-gray-50">Dashboard</a>
          <a href="#analysis" className="block px-3 py-2 rounded hover:bg-gray-50">Analysis</a>
          <a href="#qa" className="block px-3 py-2 rounded hover:bg-gray-50">Q&A</a>
          <a href="#storyboard" className="block px-3 py-2 rounded hover:bg-gray-50">Storyboard</a>
          <a href="#assessments" className="block px-3 py-2 rounded hover:bg-gray-50">Assessments</a>
          <a href="#feedback" className="block px-3 py-2 rounded hover:bg-gray-50">Feedback</a>
        </nav>
      </aside>

      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{report.sourceTitle || "Report"}</h1>
            <div className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${
              report.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
              report.status === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-gray-50 text-gray-700 border-gray-200'
            }`}>{report.status}</span>
            <a
              href={`${apiBaseUrl()}/api/reports/${report._id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black"
            >
              Download PDF
            </a>
          </div>
        </div>

        <section id="analysis" className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold">Content Analysis</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{report.summary}</p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold">Learning Objectives</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                {safe(report.learningObjectives).map((o, i) => (
                  <li key={i}>{o.text}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Key Topics</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                {safe(report.keyTopics).map((t, i) => (
                  <li key={i}>{t.text}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold">Strengths</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                {safe(report.strengths).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Gaps</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                {safe(report.gaps).map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="storyboard" className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold">Course Blueprint</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {safe(report.suggestedStructure).map((m, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-gradient-to-br from-brand-50 to-white">
                <div className="text-sm font-medium text-gray-800">{m}</div>
                <div className="mt-2 h-2 rounded bg-brand-200" />
              </div>
            ))}
          </div>
        </section>

        <section id="assessments" className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold">Assessment Strategy</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {safe(report.assessmentPlan).map((a, idx) => (
              <div key={idx} className="group perspective">
                <div className="relative h-36 w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 rounded-lg border bg-white p-4 [backface-visibility:hidden]">
                    <div className="text-sm font-semibold">{a.type}</div>
                    <div className="text-xs text-gray-600 mt-1">{a.timing}</div>
                    <div className="text-xs text-gray-600">{a.purpose}</div>
                  </div>
                  <div className="absolute inset-0 rounded-lg border bg-gray-900 text-white p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="text-xs uppercase tracking-wide text-gray-300">Example</div>
                    <div className="text-sm mt-1">{a.example}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="qa" className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">SME Interview Bot</h3>
            <div className="text-xs text-gray-500">{saving ? "Saving..." : "Autosaved"}</div>
          </div>
          <div className="mt-4 space-y-3">
            {safe(report.smeQuestions).map((qa, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white grid place-items-center text-xs">Q</div>
                <div className="flex-1">
                  <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2 text-sm">{qa.question}</div>
                  <div className="mt-2">
                    <textarea
                      className="w-full border rounded-2xl px-4 py-2 text-sm"
                      rows={3}
                      value={qa.answer || ""}
                      onChange={(e) => updateAnswer(idx, e.target.value)}
                      onBlur={(e) => updateAnswer(idx, e.target.value)}
                      placeholder="Type your answer..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="feedback" className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold">Feedback Tracker</h2>
          <div className="mt-2 text-sm text-gray-600">Track review status and approvals.</div>
          <div className="mt-4 flex gap-2">
            {['Pending','In Review','Approved'].map((s) => (
              <span key={s} className={`px-3 py-1 rounded-full border text-xs ${
                s === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                s === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>{s}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


