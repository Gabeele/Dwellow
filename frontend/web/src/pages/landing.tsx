import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel } from "@/components/ui/carousel";
import { Link } from "react-scroll";
import {
  Settings,
  Users,
  Home,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Globe,
  Calendar,
  PenTool,
} from "lucide-react";
import LandingNavigation from "../components/LandingNavigation";

const Landing: React.FC = () => {
  return (
    <div>
      <LandingNavigation />
      <div
        id="PageTop"
        className="relative flex flex-col items-center justify-center h-screen bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/landing_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-dwellow-white-100">
            Property Management & Tenant Ticketing
          </h1>
          <p className="text-dwellow-white-100 mb-8">
            Efficiently manage properties, handle maintenance requests, and
            streamline tenant communications.
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
            <Link to="About" smooth={true} duration={500}>
              <Button
                variant="outline"
                className="bg-dwellow-white-200 hover:bg-gray-300"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div id="About" className="pt-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">
          About Us
        </h1>
        <p className="ml-56 mr-56 mt-6">
          Welcome to Dwellow, the ultimate apartment management solution
          designed to simplify your property management needs. Our platform
          offers a comprehensive suite of tools to handle maintenance requests,
          manage tenants, users, properties, resource networks, contacts, and
          more. With our online web admin portal, you can manage your properties
          and units from anywhere. Tenants can download a companion app that
          allows them to use a chatbot to submit requests, find details in their
          contracts, get information about amenities, legal issues, and more.
          Our app also enables tenants to see property-wide announcements and
          view and update open maintenance tickets, while admins can efficiently
          manage tickets with queuing.
        </p>
      </div>
      <div id="Features" className="pt-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">
          Features
        </h1>
        <div className="ml-56 mr-56 grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <PenTool size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Maintenance Requests
            </h3>
            <p className="text-center">
              Easily submit and track maintenance requests through the tenant
              app.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Tenant Management
            </h3>
            <p className="text-center">
              Comprehensive tools for managing tenant information and
              communication.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Home size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              User and Property Management
            </h3>
            <p className="text-center">
              Admins can manage users and properties efficiently from the web
              portal.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Settings size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Resource Networks
            </h3>
            <p className="text-center">
              Connect with service providers and manage resources seamlessly.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Chatbot Assistance
            </h3>
            <p className="text-center">
              Tenants can use a chatbot to find information, submit requests,
              and more.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <AlertCircle size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Property-Wide Announcements
            </h3>
            <p className="text-center">
              Keep tenants informed with property-wide announcements.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Maintenance Ticket Queuing
            </h3>
            <p className="text-center">
              Admins can manage and prioritize maintenance tickets with ease.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Globe size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Public-Facing Website
            </h3>
            <p className="text-center">
              Users can search an address and view a "walkability" score,
              response time, communication level, ticket resolution speed, and
              more.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Calendar size={48} className="text-dwellow-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dwellow-dark-200">
              Future AI Integration
            </h3>
            <p className="text-center">
              Planned AI features to assist with onboarding, ticket management,
              and network communication.
            </p>
          </div>
        </div>
      </div>
      <div id="Screenshots" className="pt-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">
          Screenshots
        </h1>
        <div className="ml-56 mr-56">
          <Carousel>
            <div>
              <img src="/screenshots/mobile_view.png" alt="Mobile View" />
              <p className="legend">Mobile View</p>
            </div>
            <div>
              <img src="/screenshots/desktop_view.png" alt="Desktop View" />
              <p className="legend">Desktop View</p>
            </div>
          </Carousel>
        </div>
      </div>
      <div id="Contact" className="pt-16 mb-16">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-dark-200 flex justify-center">
          Contact Us
        </h1>
        <div className="flex justify-center">
          <form className="w-full max-w-lg bg-dwellow-light-100 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label
                className="block text-dwellow-dark-200 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <Input
                className="w-full px-3 py-2 text-dwellow-dark-200 border rounded-lg focus:outline-none focus:ring focus:border-dwellow-dark-200"
                type="text"
                id="name"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-dwellow-dark-200 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                className="w-full px-3 py-2 text-dwellow-dark-200 border rounded-lg focus:outline-none focus:ring focus:border-dwellow-dark-200"
                type="email"
                id="email"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-dwellow-dark-200 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <Textarea
                className="w-full px-3 py-2 text-dwellow-dark-200 border rounded-lg focus:outline-none focus:ring focus:border-dwellow-dark-200"
                id="message"
                rows={4}
                placeholder="Your Message"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-dwellow-dark-200 text-dwellow-white-200 hover:bg-dwellow-dark-100"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
      <footer className="w-full bg-dwellow-dark-200 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom left-0 right-0">
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
