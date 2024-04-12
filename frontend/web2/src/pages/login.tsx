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
    <div className="flex justify-center flex-col items-center h-screen bg-dwellow-white">
      <div className="bg-white p-8 rounded shadow px-20 pt-8">
      <h1 className="text-3xl font-bold mb-8 text-dwellow-primary flex justify-center items-center">Log into Dwellow</h1>
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <p className="font-semibold text-dwellow-black">Email Address</p>
          <Input
            className="w-96"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        <div className="h-4" />

        <p className="font-semibold text-dwellow-black">Password</p>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <a href="/forgot-password" className="text-dwellow-primary text-sm font-medium mt-2 hover:underline">
          Forgot password?
        </a>
        <div className="h-4" />
        <div className="justify-center flex items-center"><Button className="bg-dwellow-primary text-xl p-6 pt-4 pb-4" onClick={handleLogin}>Login</Button></div>
      </div>
      <p className="text-center mt-4 text-dwellow-primary text-sm font-semibold">
        Don't have an account?{" "}
          <a href="/register" className="text-dwellow-primary font-semibold hover:underline">
          Create Account
          </a>
        </p>
      <footer className="w-screen bg-dwellow-primary flex flex-row items-center space-x-7 justify-center text-white font-normal text-sm absolute bottom-0">
        <a href="" className="hover:underline">Terms of Use</a>
        <p>Dwellow © 2024</p>
        <a href="" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Login;
