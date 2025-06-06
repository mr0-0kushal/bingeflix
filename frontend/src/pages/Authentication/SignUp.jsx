import React from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { signup, welcome } from '../../context/imageData';
import axios, { isCancel, AxiosError } from 'axios';
import { LOCAL_SERVER } from '../../utils/constants.js';
import Toast from '../../components/Toast.jsx';
import ClipLoader from "react-spinners/ClipLoader";

const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUp = () => setShowPassword(false);
  const handleMouseLeave = () => setShowPassword(false);
  const handleTouchStart = () => setShowPassword(true);
  const handleTouchEnd = () => setShowPassword(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    message: "",
    flag: "",
    success: null
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setMessage({
          message: "Passwords do not match!",
          flag: "error"
        });
        return;
      }
      setMessage({})
      const formData = {
        fullname: name,
        username: username,
        email: email,
        password: password,
        phone: `${code}${phone}`
      }
      await axios.post(`${LOCAL_SERVER}/users/register`, formData)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage({
        message: "Registered Successfully",
        flag: "success",
        success: true
      })
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000)
    } catch (err) {
      setMessage({
        message: err.response.data.message,
        flag: err.status >= 400 ? 'error' : "warning"
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
        <div className="lg:flex flex-col items-center lg:w-[50%] p-4 justify-center hidden">
          <div className='w-full h-full flex items-center justify-center ml-20'>
            {/* <img src={welcome} alt="" /> */}
            <img src={signup} alt="" />
          </div>
        </div>
        <div className="flex flex-col items-center w-full h-full lg:w-[60%] p-2">
          <span className='lg:text-4xl text-3xl font-extrabold text-shadow-lg shadow-black'>Sign Up</span>
          <form
            onSubmit={(e) => {
              onSubmit(e)
            }}
            className='flex flex-col gap-4 lg:gap-6 items-center relative signup'>
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
              className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
            />
            <input
              type="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
            />
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
            />
            <input
              type="tel"
              pattern="\d{10}"
              placeholder="Phone number"
              required
              minLength={10}
              maxLength={10}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
              }}
              className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
            />
            <span>
              <input
                type={showPassword ? 'text' : 'password'}
                name='passoword'
                id='createpassword'
                minLength={6}
                maxLength={10}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                placeholder='Create password'
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
            <span>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='confirmpassword'
              minLength={6}
              maxLength={10}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
              placeholder='Comfirm password'
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
            {/* {message.success && (
              <p className="text-black absolute -top-4 text-sm lg:text-lg font-bold text-center">{message.message}</p>
            )} */}
            {loading ? (
              <ClipLoader color="white" loading={true} size={40} />
            ) : (
              <button type="submit" className='text-white shadow-2xl shadow-black font-bold p-3 rounded-2xl mt-3 lg:w-[100px] border-none bg-black hover:scale-[1.03] lg:text-lg transition-all ease-in-out'>Submit</button>)}

            <div>
              <span className='text-center font-semibold'>
                <Link to='/auth' className='text-[#fcc9bd] text-lg font-extrabold  hover:text-white'>More Options....</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <Toast flag={message.flag} message={message.message} />
    </div>
  )
}

export default SignUp;