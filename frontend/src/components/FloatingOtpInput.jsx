import React, { useState } from "react";
import EyeSlash from "./icons/EyeSlash";
import Eye from "./icons/Eye";

const FloatingOtpInput = ({ label, value, onChange ,verifyOtp,isVerifying,userverified}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [show ,setShow] = useState(false);


  return (
    <div className="flex items-center gap-2">
    <div className={`relative w-full  flex items-center border-[1.5px] rounded-md pr-2 ${isFocused ?"border-blue-500":'border-[#D9D9D9] '}`}>
      <input
        type={show?"number":"password"}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== "")}
        className="w-full  px-4 py-2 rounded-md  outline-none text-[#232323] focus:border-blue-500"
      />
      {show?
      <div className=" cursor-pointer" onClick={()=>setShow(false)}>
      <Eye/>  
      </div>
        :
        <div className=" cursor-pointer" onClick={()=>setShow(true)}>
        <EyeSlash/>
      </div>
        }
      <label
      className={`text-[#9A9A9A] absolute transition-all bg-white px-1 ${isFocused?'-top-[13px] left-2 text-sm':'top-2 left-4'}`}
      >{label}</label>
    </div>
    <button disable={userverified} className={`py-2 px-4 disabled:opacity-60  text-white rounded-lg hover:opacity-60 ${userverified?'bg-green-500':'bg-blue-500'}`} onClick={()=>verifyOtp()}>{isVerifying?"Verifying":userverified?"Verified":'Verify'}</button>
    </div>
  );
};

export default FloatingOtpInput;
