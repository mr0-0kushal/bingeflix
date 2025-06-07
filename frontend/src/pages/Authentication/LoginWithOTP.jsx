import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';
import Toast from '../../components/Toast';
import { motion } from 'framer-motion';

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
    setLoading(true);
    try {
      await sendOTP({ emails: email, username });
      setMessage({ message: "OTP resent successfully", flag: "success" });
      setTimer(120);
    } catch (err) {
      setMessage({ message: "Failed to resend OTP", flag: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const key = e.nativeEvent.inputType;
    const newOTP = [...otp];

    if (/^\d$/.test(value)) {
      newOTP[index] = value;
      setOTP(newOTP);
      if (index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    } else if (value === '' && key === 'deleteContentBackward') {
      newOTP[index] = '';
      setOTP(newOTP);
      if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    setMessage({});
    const finalOTP = otp.join('');
    if (finalOTP.length < 6) {
      return setMessage({ message: 'Please enter all 6 digits', flag: "warning" });
    }

    try {
      setLoading(true);
      const formData = { username, email, otp: finalOTP };
      await verifyOTP(formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage({ message: "OTP Verified", flag: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage({ message: err?.response?.data?.data?.message || 'Invalid OTP', flag: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full mt-4 flex flex-col items-center gap-3"
    >
      <h3 className="text-lg font-semibold text-center mb-2">Enter OTP</h3>
      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            autoComplete="off"
            onChange={(e) => handleChange(e, index)}
            className="w-9 h-10 md:w-12 md:h-12 text-center rounded-lg text-xl font-extrabold outline-none border-2 border-white transition-all focus:scale-110 focus:border-black duration-200 ease-in-out bg-transparent text-white"
            whileFocus={{ scale: 1.1 }}
          />
        ))}
      </div>
      <button
        onClick={handleResendOTP}
        disabled={!canResend}
        className={`font-bold ${canResend ? "text-white" : "text-white cursor-not-allowed"}`}
      >
        {canResend ? "Resend OTP" : `Resend in ${timer}s`}
      </button>
      {loading ? (
        <ClipLoader color="white" loading={true} size={40} />
      ) : (
        <motion.button
          onClick={handleVerify}
          whileTap={{ scale: 0.97 }}
          className="text-white shadow-2xl shadow-black font-bold p-3 rounded-2xl mt-3 lg:w-[130px] border-none bg-black hover:scale-[1.05] transition-all ease-in-out duration-200"
        >
          Verify OTP
        </motion.button>
      )}
      <Toast message={message.message} flag={message.flag} />
    </motion.div>
  );
};

export default OTPInput;
