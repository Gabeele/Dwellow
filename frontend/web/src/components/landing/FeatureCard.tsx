import React from "react";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-dwellow-dark-300 rounded-lg shadow-lg h-60 w-80">
    <div className="bg-dwellow-dark-300  rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
      {" "}
      <span className="text-center mb-4">{icon && icon}</span>{" "}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-dwellow-white-300">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
