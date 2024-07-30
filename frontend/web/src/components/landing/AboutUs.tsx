import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section id="About" className="p-8 md:p-16  w-full max-w-5xl m-auto">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">
        About Us
      </h1>
      <p className="mt-6 text-center text-white text-lg leading-relaxed px-4 md:px-16">
        Dwellow is the ultimate apartment management solution designed to
        simplify your property management needs. Our platform offers a
        comprehensive suite of tools to handle maintenance requests, manage
        tenants, users, properties, resource networks, contacts, and more. With
        our online web admin portal, you can manage your properties and units
        from anywhere. Tenants can download a companion app that allows them to
        use a chatbot to submit requests, find details in their contracts, get
        information about amenities, legal issues, and more. Our app also
        enables tenants to see property-wide announcements and view and update
        open maintenance tickets, while admins can efficiently manage tickets
        with queuing.
      </p>
    </section>
  );
};

export default AboutUs;
