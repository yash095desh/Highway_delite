import { useState ,useEffect} from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingOtpInput from "./FloatingOtpInput";
import toast from 'react-hot-toast';
import {  Link ,useNavigate} from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userverified, setuserVerified] = useState(false);
  const [loading ,setLoading] = useState(false);
  const [isVerifying,setIsVerifying] = useState(false)
  const [IsOtpGenerating,setIsOtpGenerating] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!userverified) {
      console.log("Please Verify Email first");
      toast.error("Please Verify Email First")
      return;
    }
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error sending OTP.");
      }

      const data = await response.json();
      console.log("result:", data);
      if(data.user){
        toast.success("User SignIn Success")
        localStorage.setItem("jwtToken", data.token);
        navigate("/home")
      }else{
        toast.error("Something Went Wrong")
      }
    } catch (error) {
      console.log("Error in SignIn:", error);
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
      toast.error('Please Provide Email');
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
      toast.success("Otp sent successfully")
    } catch (error) {
      console.log("Error in sending Otp:", error);
      toast.error("Error in sending Otp")
    }
    setIsOtpGenerating(false)
  };

  const verifyOtp = async () => {
    if (!email || !otp) {
      console.log("Please provide email and otp");
      toast.error("Please Provide email and Otp")
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
        toast.success("Email Verified Successfully")
      }
    } catch (error) {
      console.log("Error in verifying Otp:", error);
      toast.error(error.message)
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
      <div className=" flex flex-col h-full w-full min-w-[50%] mx-6 ">
        <div className=" text-3xl font-semibold uppercase flex items-center gap-2 p-4">
          <img src="assets/icon.svg" className="w-8 h-8" />
          HD
        </div>
        <div className=" h-full  flex flex-col items-center justify-center">
          <div className="w-full max-w-sm flex flex-col gap-2">
            <h1 className=" text-4xl font-semibold ">Sign in</h1>
            <p className=" text-[#969696] mb-4 text-lg ">
            Please login to continue to your account.
            </p>
            <FloatingLabelInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FloatingOtpInput
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              verifyOtp={verifyOtp}
              isVerifying={isVerifying}
              userverified={userverified}
            />
            <p
              className={` text-blue-500 underline mb-2 cursor-pointer hover:opacity-60 ${IsOtpGenerating&& 'opacity-60'}`}
              onClick={() => sendOtp()}
            >
              {IsOtpGenerating?'Generating...':'Generate Otp'}
            </p>
            <button className="py-3 px-4 bg-blue-500 text-white rounded-lg hover:opacity-60" onClick={()=>handleSubmit()}>
              {loading?"Processing..":"Submit"}
            </button>
            <p className=" text-[#6C6C6C]">
              Need an account?
              <Link to="/" className="mx-2 text-blue-500 hover:underline">
            Create One
            </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-screen hidden lg:block">
        <img
          src="/assets/container.svg"
          alt="Homepage"
          className="w-full h-full object-cover p-2 rounded-3xl"
        />
      </div>
    </div>
  );
}

export default SignIn;
