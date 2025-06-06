import React from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRef, useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { login2, login } from '../../context/imageData';
import { useAuth } from '../../context/AuthContext.jsx'
import Toast from '../../components/Toast.jsx'
import ClipLoader from 'react-spinners/ClipLoader.js';
import OTPInput from './LoginWithOTP.jsx';


const Login = () => {

  const { login, sendOTP } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUp = () => setShowPassword(false);
  const handleMouseLeave = () => setShowPassword(false);
  const handleTouchStart = () => setShowPassword(true);
  const handleTouchEnd = () => setShowPassword(false);

  const navigate = useNavigate()
  const [showOTP, setShowOTP] = useState(false)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({
    message: "",
    flag: "",
  });

  const sendOTPBtn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!(username.trim() || email.trim())) {
        setMessage({
          message: "Username or email is required",
          flag: "warning"
        });
        return;
      }
      setMessage({})
      const formData = {
        username: username,
        email: email,
        phone: phone
      }
      await sendOTP(formData); // API call
      setMessage({
        message: "OTP Sended",
        flag: "success"
      });
      setTimeout(() => {
        setShowOTP(true);
      }, 1000)

    } catch (err) {
      console.log(err)
      setMessage({
        message: err.response.data.data.message,
        flag: err.status >= 400 ? "error" : "warning"
      })
    } finally {
      setLoading(false);
    }
  }

  const handelVerifyOTP = () => {
    setMessage({
      message: "Logged In successfully",
      flag: 'success'
    })

  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!(username.trim() || email.trim())) {
        setMessage({
          message: "Username or email is required",
          flag: "warning"
        });
        return;
      }
      setMessage({})
      const formData = {
        username: username,
        email: email,
        password: password,
      }
      await login(formData)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage({
        message: "Logged in Successfully \n Redirecting......",
        flag: "success"
      })
      setTimeout(() => {
        navigate("/main");
      }, 2000)
    } catch (err) {
      setMessage({
        message: err.response.data.message,
        flag: err.status >= 400 ? "error" : "warning"
      })
    } finally {
      setLoading(false);
    }
    // console.log(e);
    // console.log(formData);
  }

  return (
    <div className="flex flex-col items-center px-5 pt-6 h-screen min-w-full 2xl:justify-center">
      <div className="w-[95%] h-auto lg:w-[70%] rounded-2xl p-4 flex justify-between bg-[var(--color-primary)] ">
        <div className="lg:flex flex-col items-center lg:w-[40%] p-4 justify-center hidden">
          <div>
            <img src={`${login}`} alt="" />
            <img src={login2} alt="" />
          </div>
        </div>
        <div className="flex flex-col items-center w-full h-full lg:w-[60%] gap-6 p-2">
          <span className='lg:text-4xl text-3xl font-extrabold text-shadow-lg shadow-black'>Login</span>
          {!showOTP ? (<form
            onSubmit={(e) => {
              onSubmit(e)
            }}
            className='flex flex-col gap-4 lg:gap-6 items-center relative signup font-bold'>
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
            />
            OR
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
            />
            <span>
              <input
                type={showPassword ? 'text' : 'password'}
                name='passoword'
                id='password'
                minLength={6}
                maxLength={10}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                placeholder='Enter password'
                required
                className='border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white bg-transparent' />
              <button
                type="button"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className='absolute top-auto bottom-auto right-2'
              >
                {showPassword ? (<FaEyeSlash size={25} />) : (<FaEye size={25} />)}
              </button>
            </span>
            {loading ? (
              <ClipLoader color="white" loading={true} size={40} />
            ) : (
              <div className='w-full gap-6 justify-center flex items-center'>
                <button type="submit" className='text-white shadow-2xl shadow-black font-bold p-3 rounded-2xl mt-3 lg:w-[100px] border-none bg-black hover:scale-[1.03] lg:text-lg transition-all ease-in-out'>Submit</button>
                <button type='button' className='text-white shadow-2xl shadow-black font-bold p-3 lg:py-3 lg:px-1  rounded-2xl mt-3 lg:w-[100px] border-none bg-black hover:scale-[1.03] lg:text-lg transition-all ease-in-out'
                  onClick={(e) => {
                    sendOTPBtn(e);
                  }}
                >Send OTP</button>
              </div>
            )}
            <div className="flex flex-col gap-2 lg:gap-0">
              <span className='text-center text-xs lg:text-md lg:font-semibold'>
                Are you new ? &nbsp;
                <Link to='/auth/signup' className='text-black hover:text-white'>Create your account</Link>
              </span>
              <span className='text-center text-xs lg:text-md lg:font-semibold'>
                <Link className='text-black hover:text-white'>Forgot your password</Link>
              </span>
              <span className='text-center lg:font-semibold'>
                <Link to='/auth' className='text-[#fcc9bd] lg:text-lg font-extrabold  hover:text-white'>More Options....</Link>
              </span>
            </div>
          </form>) :
            (
              <div className="w-full h-full p-4">
                <OTPInput email={email} username={username} onSuccess={handelVerifyOTP} />
              </div>
            )
          }
        </div>
      </div>
      <Toast message={message.message} flag={message.flag} />
    </div>
  )
}
<Outlet />

export default Login;