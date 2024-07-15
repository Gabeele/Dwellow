import React from "react";

interface CharacterCountProps {
  currentCount: number;
  maxCount: number;
}

const CharacterCount: React.FC<CharacterCountProps> = ({ currentCount, maxCount }) => {
  return (
    <span className="absolute bottom-1 right-2 text-xs text-dwellow-dark-100">
      {maxCount - currentCount}
    </span>
  );
};

export default CharacterCount;
