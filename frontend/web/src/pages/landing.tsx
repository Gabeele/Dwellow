import React from "react";
import { Button } from "@/components/ui/button";
import LandingNavigation from "../components/LandingNavigation";

const Landing: React.FC = () => {
  return (
    <div>
      <LandingNavigation />
      <div
        id="PageTop"
        className="relative flex flex-col items-center justify-center h-screen bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/public/landing_bg.png')" }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">
            Property Management & Tenant Ticketing
          </h1>
          <p className="text-dwellow-white-100 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="flex flex-row space-x-10">
            <a href="/register">
              <Button
                variant="default"
                className="bg-dwellow-primary-300 hover:bg-dwellow-primary-500"
              >
                Get Started
              </Button>
            </a>
            <a href="#About">
              <Button variant="outline">Learn More</Button>
            </a>
          </div>
        </div>
      </div>
      <div id="About" className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">About</h1>
      </div>
      <footer className="w-full bg-dwellow-primary-300 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom left-0 right-0">
        <a href="" className="hover:underline">Terms of Use</a>
        <p>Dwellow © 2024</p>
        <a href="" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Landing;
