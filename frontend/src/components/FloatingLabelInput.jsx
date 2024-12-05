import React, { useState } from "react";

const FloatingLabelInput = ({ label, value, onChange ,type}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full mb-2">
      <input
        type={type ||"text"}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== "")}
        className="w-full border-[1.5px] border-[#D9D9D9] px-4 py-2 rounded-md outline-none text-[#232323] focus:border-blue-500"
      />
      <label
      className={`text-[#9A9A9A] absolute transition-all bg-white px-1 ${isFocused?'-top-[13px] left-2 text-sm':'top-2 left-4'}`}
      >{label}</label>
    </div>
  );
};

export default FloatingLabelInput;
