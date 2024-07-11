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
        style={{ backgroundImage: "url('/landing_bg.png')" }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">
            Property Management & Tenant Ticketing
          </h1>
          <p className="text-dwellow-white-100 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="flex flex-row space-x-10">
            <a href="/register/admin">
              <Button
                variant="outline"
                className="text-dwellow-white-200 bg-dwellow-dark-200 hover:bg-dwellow-dark-100 hover:text-dwellow-white-200"
              >
                Get Started
              </Button>
            </a>
            <a href="#About">
              <Button variant="outline" className="bg-dwellow-white-200 hover:bg-gray-300">Learn More</Button>
            </a>
          </div>
        </div>
      </div>
      <div id="About" className="pt-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">About Us</h1>
        <p className="ml-56 mr-56 mt-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
         dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
         proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div id="Features" className="pt-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">Features</h1>
      </div>
      <div id="Contact" className="pt-16 mb-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">Contact Us</h1>
      </div>
      <footer className="w-full bg-dwellow-dark-200 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom left-0 right-0">
        <a href="" className="hover:underline">Terms of Use</a>
        <p>Dwellow © 2024</p>
        <a href="" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Landing;
