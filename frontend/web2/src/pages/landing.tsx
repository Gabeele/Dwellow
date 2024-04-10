import React from "react";
import { Button } from "@/components/ui/button";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to our website!</h1>
        <p className="text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex space-x-4"></div>
        <a href="/login">
          <Button variant="link">Login</Button>
        </a>
        <a href="/signup">
          <Button variant="link">Sign up</Button>
        </a>
      </div>
    </div>
  );
};

export default Landing;
