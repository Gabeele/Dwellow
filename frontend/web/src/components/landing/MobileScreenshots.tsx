import React from "react";

const MobileScreenshots: React.FC = () => {
  return (
    <section id="MobileScreenshots" className="p-16">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">
        Companion App
      </h1>
      <p className="text-white text-center mb-8">
        Tenants connect through a mobile app and have access to your Kiwi
        chatbot, tickets, and more!
      </p>
      <div className="flex justify-center gap-4">
        <figure className="text-center">
          <img
            src="mobile1.jpg"
            alt="Mobile Screenshot 1"
            className="w-64 rounded-lg shadow-lg"
          />
          <figcaption className="text-white mt-2">Kiwi Chatbot</figcaption>
        </figure>
        <figure className="text-center">
          <img
            src="mobile2.jpg"
            alt="Mobile Screenshot 2"
            className="w-64 rounded-lg shadow-lg"
          />
          <figcaption className="text-white mt-2">Ticket Management</figcaption>
        </figure>
        <figure className="text-center">
          <img
            src="mobile3.jpg"
            alt="Mobile Screenshot 3"
            className="w-64 rounded-lg shadow-lg"
          />
          <figcaption className="text-white mt-2">More Features</figcaption>
        </figure>
      </div>
    </section>
  );
};

export default MobileScreenshots;
