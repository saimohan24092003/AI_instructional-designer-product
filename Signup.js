import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiBaseUrl, useAuth } from "../auth/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("InstructionalDesigner");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl()}/api/auth/signup`, { name, email, password, role });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <p className="text-gray-600">Join Clamshell Learning</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select className="mt-1 w-full border rounded-md px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>InstructionalDesigner</option>
            <option>SME</option>
            <option>Client</option>
          </select>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Have an account? <Link className="text-brand-700" to="/login">Sign in</Link></p>
    </div>
  );
}


