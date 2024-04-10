import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/home");
    } catch (error: any) {
      console.error("Login error:", error.message);
      if (
        error.message == "Firebase: Error (auth/user-not-found)." ||
        error.message == "Firebase: Error (auth/wrong-password)."
      ) {
        setErrorMessage("Invalid email or password");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login to Dwellow</h1>
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="h-4" />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="h-4" />
        <Button onClick={handleLogin}>Login</Button>
        <a href="/forgot-password" className="text-primary block mt-2">
          Forgot password?
        </a>
        <p className="text-center mt-4 text-gray-600 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
