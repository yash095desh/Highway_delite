import { useState,useEffect } from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingOtpInput from "./FloatingOtpInput";
import toast from 'react-hot-toast';
import {  Link ,useNavigate} from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [otp, setOtp] = useState("");
  const [userverified, setuserVerified] = useState(false);
  const [isVerifying,setIsVerifying] = useState(false);
  const [IsOtpGenerating,setIsOtpGenerating] = useState(false)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userverified) {
      console.log("Please Verify Email first");
      toast.error("Please Verify Email ")
      return;
    }
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({dateOfBirth,email,name}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error sending OTP.");
      }

      const data = await response.json();
      console.log("result:", data);
      if(data.user){
        toast.success("Sign Up Successfull")
        localStorage.setItem("jwtToken", data.token);
        navigate("/home");
        // Redirect to homepage
      }else{
        toast.error("Something went Wrong")
        //PopUp something went wrong please verify email and try again
      }
    } catch (error) {
      console.log("Error in SignUp:", error);
      toast.error(error.message)
    }
    setLoading(false)
  };

  const sendOtp = async () => {
    if(IsOtpGenerating){
      return;
    }
    if (!email) {
      console.log("Please Provide email");
      toast.error("Please Provide Email")
      return;
    }
    try {
      setIsOtpGenerating(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sendOtpVerificationEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error sending OTP.");
      }

      const data = await response.json();
      console.log("OTP send:", data);
      toast.success("Otp sent Successfully")
    } catch (error) {
      console.log("Error in sending Otp:", error);
      toast.error("Something went Wrong")
    }
    setIsOtpGenerating(false)
  };

  const verifyOtp = async () => {
    if (!email || !otp) {
      console.log("Please provide email and otp");
      toast.error("Please provide Email and Otp")
      return;
    }
    try {
      setIsVerifying(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email , otp}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error sending OTP.");
      }

      const data = await response.json();
      console.log("OTP send:", data);
      if(data.status == "VERIFIED"){
        setuserVerified(true)
      }
    } catch (error) {
      toast.error(error.message)
      console.log("Error in verifying Otp:", error);
    }
    setIsVerifying(false)
  };

  useEffect(()=>{
    if(!email){
      setuserVerified(false)
    }
  },[email])

  return (
    <div className=" flex flex-row h-screen w-screen justify-between ">
      <div className=" flex flex-col h-full w-full min-w-[50%] mx-6">
        <div className=" text-3xl font-semibold uppercase flex items-center gap-2 p-4">
          <img src="assets/icon.svg" className="w-8 h-8" />
          HD
        </div>
        <div className=" h-full  flex flex-col items-center justify-center">
          <div className="w-full max-w-sm flex flex-col gap-2">
            <h1 className=" text-4xl font-semibold ">Sign Up</h1>
            <p className=" text-[#969696] mb-4 text-lg ">
              Sign Up to enjoy the features of HD
            </p>
            <FloatingLabelInput
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FloatingLabelInput
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              type={"Date"}
            />
            <FloatingLabelInput
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            <FloatingOtpInput
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              verifyOtp={verifyOtp}
              userverified={userverified}
              isVerifying={isVerifying}
            />
            <p
              className={`text-blue-500 underline mb-2 cursor-pointer ${IsOtpGenerating && 'opacity-60'}`}
              onClick={() => sendOtp()}
            >
              {IsOtpGenerating ? 'Generating..':'Generate Otp'}
            </p>
            <button className="py-3 px-4 bg-blue-500 text-white rounded-lg hover:opacity-60" onClick={()=>handleSubmit()}>
              {loading?"Processing..":"Submit"}
            </button>
            <p className=" text-[#6C6C6C]">
              Already have an account?
              <Link to="/sign-in" className="mx-2 text-blue-500 hover:underline">
            Sign In
          </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-full h-screen">
        <img
          src="/assets/container.svg"
          alt="Homepage"
          className="w-full h-full object-cover p-2 rounded-3xl"
        />
      </div>
    </div>
  );
}

export default SignUp;
