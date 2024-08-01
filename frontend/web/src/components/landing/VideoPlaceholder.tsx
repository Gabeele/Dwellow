import React from "react";

const VideoPlayer: React.FC = () => (
  <div className=" max-w-1/2 flex items-center justify-center rounded-lg shadow-lg relative p-1 bg-gradient-to-r from-green-600 to-dwellow-dark-200">
    <div className="bg-white rounded-lg shadow-md w-full h-full flex items-center justify-center">
      <video className="w-full h-full" controls src="/Dwellow Features.mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
);

export default VideoPlayer;
