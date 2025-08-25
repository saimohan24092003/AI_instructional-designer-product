import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ReportDetail from "./pages/ReportDetail";
import Workbench from "./pages/Workbench";
import Evaluator from "./pages/Evaluator";
// Add this import at the top of your App.js
import logo from './assets/clamshellconsulting_logo.jpeg';

// Then use it in your JSX like this:
<img src={logo} alt="Clamshell Consulting" />
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Shell({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
<img 
  src={logo} 
  alt="Clamshell Consulting" 
  className="h-8 w-auto"
/>
            <span className="font-semibold text-navy-900 group-hover:text-brand-700 transition-colors">Clamshell Learning</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-brand-600">Dashboard</Link>
                <button onClick={logout} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand-600">Login</Link>
                <Link to="/signup" className="hover:text-brand-600">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/evaluator" element={<Evaluator />} />
          <Route
            path="/workbench"
            element={
              <ProtectedRoute>
                <Workbench />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <ReportDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Shell>
    </AuthProvider>
  );
}
