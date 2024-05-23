import React from "react";
import { Button } from "@/components/ui/button";
import LandingNavigation from "../components/LandingNavigation";

const Landing: React.FC = () => {
  return (
    <div>
      <LandingNavigation></LandingNavigation>
      <div id="PageTop" className="flex flex-col items-center justify-center h-screen bg-black/85">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">Property Management & Tenant Ticketing</h1>
          <p className="text-dwellow-dark-100 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="flex space-x-4"></div>
          <div className="flex flex-row space-x-10">
            <a href="/register">
              <Button variant="default" className="bg-dwellow-primary-300 hover:bg-dwellow-primary-500">Get Started</Button>
            </a>
            <a href="#About">
              <Button variant="outline">Learn More</Button>
            </a>
          </div>
      </div>
      <div id="About">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">About</h1>

      </div>
      <footer className="w-full bg-dwellow-primary-300 flex flex-row items-center space-x-7 
      justify-center text-dwellow-white-100 font-normal text-sm absolute bottom left-0 right-0">
          <a href="" className="hover:underline">Terms of Use</a>
          <p>Dwellow © 2024</p>
          <a href="" className="hover:underline">Privacy Policy</a>
        </footer>
    </div>
  );
};

export default Landing;
