import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader.js';
import Toast from '../../components/Toast';


const OTPInput = ({ email, username, onSuccess }) => {

  const { verifyOTP, sendOTP } = useAuth();
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState({
    message: "",
    flag: "",
  });

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      setCanResend(false);
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(countdown);
  }, [timer]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true)
    try {
      await sendOTP({
        emails: email,
        username
      }); // Your existing function
      setMessage({ message: "OTP resent successfully", flag: "success" });
      setTimer(120); // reset timer
    } catch (err) {
      setMessage({ message: "Failed to resend OTP", flag: "error" });
    }
    finally {
      setLoading(false)
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const key = e.nativeEvent.inputType; // for detecting delete

    const newOTP = [...otp];

    if (/^\d$/.test(value)) {
      newOTP[index] = value;
      setOTP(newOTP);

      // Auto-focus to next input
      if (index < 5) {
        const next = document.getElementById(`otp-${index + 1}`);
        if (next) next.focus();
      }
    } else if (value === '' && key === 'deleteContentBackward') {
      // Clear current
      newOTP[index] = '';
      setOTP(newOTP);

      // Move focus back
      if (index > 0) {
        const prev = document.getElementById(`otp-${index - 1}`);
        if (prev) prev.focus();
      }
    }
  };

  const handleVerify = async () => {
    setMessage({})
    const finalOTP = otp.join('');
    if (finalOTP.length < 6) {
      setMessage({
        message: 'Please enter all 6 digits',
        flag: "warning"
      });
      return;
    }

    try {
      setLoading(true);
      const formData = {
        username,
        email,
        otp: finalOTP
      }
      const res = await verifyOTP(formData)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage({
        message: "OTP Verified",
        flag: "success"
      });
      setLoading(false);

      if (onSuccess) onSuccess(); // Callback after success (e.g., redirect)
    } catch (err) {
      console.log(err)
      setLoading(false);
      setMessage({
        message: err?.response?.data?.data?.message || 'Invalid OTP',
        flag: "error"
      });
    }
  };

  return (
    <>
      <div className="w-full mt-4 flex flex-col items-center gap-3">
        <h3 className="text-lg font-medium mb-2 text-center">Enter OTP</h3>
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-center rounded text-lg font-extrabold outline-none border-2 border-white"
              value={digit}
              autoComplete="off"
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </div>
        <div className=''>
          <button
            onClick={handleResendOTP}
            disabled={!canResend}
            className={`border-none outline-none font-bold text-white ${canResend ? "text-white" : "text-gray-400 cursor-not-allowed"
              }`}
          >
            {canResend ? "Resend OTP" : `Resend in ${timer}s`}
          </button>
        </div>
        {loading ? (<ClipLoader color="white" loading={true} size={40} />) :
          (<button
            onClick={handleVerify}
            className='text-white shadow-2xl shadow-black font-bold p-3 rounded-2xl mt-3 lg:w-[130px] border-none bg-black hover:scale-[1.03] lg:text-lg transition-all ease-in-out'
            disabled={loading}
          >
            Verify OTP
          </button>)
        }
      </div>
      <Toast message={message.message} flag={message.flag} />
    </>
  );
};

export default OTPInput;
