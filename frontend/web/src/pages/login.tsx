import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import LandingNavigation from "@/components/LandingNavigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message);
      if (
        error.message === "Firebase: Error (auth/user-not-found)." ||
        error.message === "Firebase: Error (auth/wrong-password)."
      ) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("An error occurred during login. Please try again.");
      }
      setIsAuthenticating(false);
    }
  };

  return (
    <div>
      <LandingNavigation />
      <div className="flex justify-center flex-col items-center h-screen bg-dwellow-white-200">
        <div className="bg-dwellow-white-100 p-8 rounded shadow px-20 pt-8">
          <h1 className="text-3xl font-bold mb-8 text-dwellow-dark-200 flex justify-center items-center">
            Log into Dwellow
          </h1>
          {errorMessage && (
            <div className="mb-4 text-center text-red-500">{errorMessage}</div>
          )}
          <p className="font-semibold text-dwellow-dark-200">Email Address</p>
          <Input
            className="w-96"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="h-4" />
          <p className="font-semibold text-dwellow-dark-200">Password</p>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a
            href=""
            className="text-dwellow-dark-200 text-sm font-medium mt-2 hover:underline"
          >
            Forgot password?
          </a>
          <div className="h-4" />
          <div className="justify-center flex items-center">
            <Button
              className="bg-dwellow-dark-200 text-xl p-6 pt-4 pb-4"
              onClick={handleLogin}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? "Logging in..." : "Login"}
            </Button>
          </div>
        </div>
        <p className="text-center mt-4 text-dwellow-dark-200 text-sm font-semibold">
          Don't have an account?{" "}
          <a
            href="/register/admin"
            className="text-dwellow-dark-200 font-semibold hover:underline"
          >
            Create Account
          </a>
        </p>
        <footer className="w-full bg-dwellow-dark-200 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom-0">
          <a href="" className="hover:underline">
            Terms of Use
          </a>
          <p>Dwellow © 2024</p>
          <a href="" className="hover:underline">
            Privacy Policy
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Login;
