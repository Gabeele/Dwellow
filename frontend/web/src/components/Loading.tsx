import React from "react";
import { Loader } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin" size={48} />
      <h1 className="text-xl ml-2">Loading</h1>
    </div>
  );
};

export default Loading;
