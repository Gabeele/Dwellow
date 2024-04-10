import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform login logic here
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login to Dwellow</h1>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
