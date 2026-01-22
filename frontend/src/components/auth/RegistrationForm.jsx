import React, { useState } from "react";
import { useRegisterMutation } from "../../features/apiSlice";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await register({
        user_name,
        email,
        mobile_no,
        password,
      }).unwrap();

      setSuccess(res.message || "Registration successful");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          placeholder="Username"
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile_no}
          onChange={(e) => setMobileNo(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button className="bg-green-600 text-white w-full py-2 rounded font-semibold">
          Register
        </button>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>

      <p className="text-sm mt-2 text-gray-600 text-center">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 font-medium">
          Login here
        </Link>
      </p>
    </div>
  );
}
