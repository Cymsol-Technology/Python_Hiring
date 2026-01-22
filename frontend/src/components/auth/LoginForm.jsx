import { useState } from "react";
import { useLoginMutation } from "../../features/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // backend accepts "email" field but it can be email/username
      const payload = { email: identifier, password };

      const userData = await login(payload).unwrap();

      console.log("userData:", userData);

      
      dispatch(
        setCredentials({
          token: userData.token,
          username: userData.username,
          role: userData.role,
          process_ids: userData.process_ids,
          form_ids: userData.form_ids,
        })
      );

    
    } catch (err) {
      console.error(err);
      setError("Invalid email/username or password");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <div className="text-red-600">{error}</div>}
      </form>

      <p className="text-sm mt-2 text-gray-600">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600">
          Register here
        </a>
      </p>
    </div>
  );
}
