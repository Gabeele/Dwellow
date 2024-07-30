import React from "react";
import FeatureCard from "./FeatureCard";
import {
  PenTool,
  Users,
  Home,
  Settings,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Globe,
  Calendar,
} from "lucide-react";

const Features: React.FC = () => {
  return (
    <section id="Features" className="p-8 md:p-16 w-full m-auto">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">
        Features
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-7xl">
        <FeatureCard
          icon={<PenTool size={48} className="text-white mb-4" />}
          title="Maintenance Requests"
          description="Easily submit and track maintenance requests through the tenant app."
        />
        <FeatureCard
          icon={<Users size={48} className="text-white mb-4" />}
          title="Tenant Management"
          description="Comprehensive tools for managing tenant information and communication."
        />
        <FeatureCard
          icon={<Home size={48} className="text-white mb-4" />}
          title="User and Property Management"
          description="Admins can manage users and properties efficiently from the web portal."
        />
        <FeatureCard
          icon={<Settings size={48} className="text-white mb-4" />}
          title="Resource Networks"
          description="Connect with service providers and manage resources seamlessly."
        />
        <FeatureCard
          icon={<MessageCircle size={48} className="text-white mb-4" />}
          title="Chatbot Assistance"
          description="Tenants can use a chatbot to find information, submit requests, and more."
        />
        <FeatureCard
          icon={<AlertCircle size={48} className="text-white mb-4" />}
          title="Property-Wide Announcements"
          description="Keep tenants informed with property-wide announcements."
        />
        <FeatureCard
          icon={<CheckCircle size={48} className="text-white mb-4" />}
          title="Maintenance Ticket Queuing"
          description="Admins can manage and prioritize maintenance tickets with ease."
        />
        <FeatureCard
          icon={<Globe size={48} className="text-white mb-4" />}
          title="Public-Facing Website"
          description="Users can search an address and view a 'walkability' score, response time, communication level, ticket resolution speed, and more."
        />
        <FeatureCard
          icon={<Calendar size={48} className="text-white mb-4" />}
          title="Future AI Integration"
          description="Planned AI features to assist with onboarding, ticket management, and network communication."
        />
      </div>
    </section>
  );
};

export default Features;
