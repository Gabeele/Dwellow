import React from "react";

import { Button } from "@/components/ui/button";
import LandingNavigation from "../components/LandingNavigation";
import FakeBusinessScroll from "../components/landing/AutoScroll";
import AboutUs from "../components/landing/AboutUs";
import Features from "../components/landing/Features";
import MobileScreenshots from "../components/landing/MobileScreenshots";
import AdminScreenshots from "../components/landing/AdminScreenshots";
import DemoVideo from "../components/landing/DemoVideo";
import ContactUs from "../components/landing/ContactUs";

const Landing: React.FC = () => {
  return (
    <div className="bg-dwellow-dark-400">
      <LandingNavigation />
      <header
        id="PageTop"
        className="relative flex flex-col items-center justify-center h-screen bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/landing_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative flex flex-col items-center justify-center p-3">
          <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">
            Property Management & Tenant Ticketing
          </h1>
          <p className="text-dwellow-white-100 mb-8">
            Efficiently manage properties, handle maintenance requests, and
            streamline tenant communications.
          </p>
          <div className="flex flex-row space-x-10">
            <a href="/register/admin">
              <Button className="text-dwellow-white-200 bg-dwellow-dark-200 hover:bg-dwellow-dark-100 hover:text-dwellow-white-200">
                Get Started
              </Button>
            </a>
            <a href="#About">
              <Button className="bg-dwellow-white-200 hover:bg-gray-300 text-black">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </header>

      <FakeBusinessScroll />
      <AboutUs />
      <DemoVideo />
      <Features />
      <MobileScreenshots />
      <AdminScreenshots />

      <ContactUs />

      <footer className="w-full bg-dwellow-dark-200 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm py-4">
        <a href="" className="hover:underline">
          Terms of Use
        </a>
        <p>Dwellow © 2024</p>
        <a href="" className="hover:underline">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default Landing;
