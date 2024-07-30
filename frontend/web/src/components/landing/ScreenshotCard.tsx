import React from "react";

interface ScreenshotCardProps {
  imageUrl: string;
  description: string;
}

const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  imageUrl,
  description,
}) => (
  <div className="flex flex-col items-center relative p-1 bg-gradient-to-r from-green-400 to-dwellow-dark-300 rounded-lg">
    <div className="bg-white rounded-lg p-6 shadow-md w-full">
      <img src={imageUrl} alt={description} className="mb-4 rounded-lg" />
      <p>{description}</p>
    </div>
  </div>
);

export default ScreenshotCard;
