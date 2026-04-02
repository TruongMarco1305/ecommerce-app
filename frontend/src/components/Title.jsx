import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-bamboo-400 font-body">
        {text1}{" "}
        <span className="text-bamboo-700 font-semibold font-body">{text2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-bamboo-500"></p>
    </div>
  );
};

export default Title;
