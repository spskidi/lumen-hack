import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    if (isLogin) {
      alert(`✅ Logged in as ${role}`);
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      alert(`🎉 Welcome ${firstName} ${lastName}! Your account has been created.`);
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left">
        <h1>Subscription<br />Management System</h1>
        <p>Manage subscriptions easily and securely.</p>
      </div>
      {/* RIGHT SIDE */}
      <div className="right">
        <div className="form-box">
          <h2>{isLogin ? "Welcome Back 👋" : "Create Account ✨"}</h2>
          <form onSubmit={handleSubmit}>
            {isLogin && (
              <div className="input-group">
                <label>Select Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            {!isLogin && (
              <div className="name-row">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="submit-btn">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
          {isLogin && (
            <button
              type="button"
              className="signup-btn"
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
