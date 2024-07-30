import React from "react";
import { Button } from "../ui/button";

const ContactUs: React.FC = () => {
  return (
    <section id="Contact" className="p-8 md:p-16">
      <div className="flex justify-center w-full items-center">
        <div className="p-1 rounded-lg shadow-lg bg-gradient-to-r from-green-700 to-dwellow-dark-300 w-full md:w-1/2">
          <div className="bg-dwellow-dark-300  bg-opacity-75 py-12 px-8 md:py-24 md:px-16 rounded-lg shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              What are you waiting for?
            </h1>
            <p className="text-white mb-6">
              Get started with Dwellow and improve your tenant relations while
              managing your properties more efficiently.
            </p>
            <div className="flex justify-center md:justify-end">
              <a href="mailto:hello@dwellow.ca">
                <Button
                  className="bg-dwellow-dark-200  text-white px-4 py-2 rounded-lg hover:bg-dwellow-dark-200 "
                  style={{
                    position: "relative",
                    boxShadow: "0 0 5px 2px rgba(0, 255, 0, 0.8)",
                    animation: "pulsate 10s infinite",
                  }}
                >
                  Get Dwellow
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes pulsate {
            0% {
              box-shadow: 0 0 5px 2px rgba(0, 255, 0, 0.8);
            }
            50% {
              box-shadow: 0 0 20px 10px rgba(0, 255, 0, 0.4);
            }
            100% {
              box-shadow: 0 0 5px 2px rgba(0, 255, 0, 0.8);
            }
          }
        `}
      </style>
    </section>
  );
};

export default ContactUs;
