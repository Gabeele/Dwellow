import React from "react";
import VideoPlaceholder from "./VideoPlaceholder";

const DemoVideo: React.FC = () => {
  return (
    <section id="DemoVideo" className="p-8 md:p-16 ">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">
        Watch Our Demo Video
      </h1>
      <div className="flex justify-center">
        <VideoPlaceholder />
      </div>
    </section>
  );
};

export default DemoVideo;
