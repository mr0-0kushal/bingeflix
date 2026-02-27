import React, { useRef, useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { login2, login } from '../../context/imageData'
import { useAuth } from '../../context/AuthContext.jsx'
import Toast from '../../components/Toast.jsx'
import ClipLoader from 'react-spinners/ClipLoader.js'
import OTPInput from './LoginWithOTP.jsx'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const { login, sendOTP, user } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(false)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ message: "", flag: "" })

  const handleMouseDown = () => setShowPassword(true)
  const handleMouseUp = () => setShowPassword(false)
  const handleMouseLeave = () => setShowPassword(false)
  const handleTouchStart = () => setShowPassword(true)
  const handleTouchEnd = () => setShowPassword(false)

  const navigate = useNavigate()

  const sendOTPBtn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!(username.trim() || email.trim())) {
        setMessage({ message: "Username or email is required", flag: "warning" })
        return
      }
      setMessage({})
      const formData = { username, email, phone }
      await sendOTP(formData)
      setMessage({ message: "OTP Sent", flag: "success" })
      setTimeout(() => setShowOTP(true), 1000)
    } catch (err) {
      console.log(err)
      setMessage({
        message: err?.response?.data?.data?.message || "Something went wrong",
        flag: err?.status >= 400 ? "error" : "warning"
      })
    } finally {
      setLoading(false)
    }
  }

  const handelVerifyOTP = () => {
    setMessage({ message: "Logged In successfully", flag: 'success' })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!(username.trim() || email.trim())) {
        setMessage({ message: "Username or email is required", flag: "warning" })
        return
      }
      setMessage({})
      const formData = { username, email, password }
      const res = await login(formData)
      await new Promise((res) => setTimeout(res, 2000))
      setMessage({ message: "Logged in Successfully\nRedirecting...", flag: "success" })
      setTimeout(() => {
        if (res) {
          if (res.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/main");
          }
        }
      }, 2000)
      // console.log(res.data.data)
    } catch (err) {
      setMessage({
        message: err?.response?.data?.message || "Something went wrong",
        flag: err?.status >= 400 ? "error" : "warning"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center px-5 pt-6 h-screen min-w-full 2xl:justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-[95%] h-auto lg:w-[70%] rounded-2xl p-4 flex justify-between bg-[var(--color-primary)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="lg:flex flex-col items-center lg:w-[40%] p-4 justify-center hidden">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src={`${login}`} alt="" />
            <img src={login2} alt="" />
          </motion.div>
        </div>

        <div className="flex flex-col items-center w-full h-full lg:w-[60%] gap-6 p-2">
          <motion.span
            className='lg:text-4xl text-3xl font-extrabold text-shadow-lg shadow-black'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Login
          </motion.span>

          <AnimatePresence>
            {!showOTP ? (
              <motion.form
                key="loginForm"
                onSubmit={onSubmit}
                className='flex flex-col gap-4 lg:gap-6 items-center relative signup font-bold'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
                />
                OR
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-white outline-none pr-5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white"
                />
                <span className='relative w-full flex items-center'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    minLength={6}
                    maxLength={10}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter password'
                    required
                    className='border-b border-white outline-none pr- 5 pl-1 pt-3 lg:text-lg text-white font-bold shadow-black placeholder-white bg-transparent w-full'
                  />
                  <motion.button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className='absolute right-2'
                    whileTap={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </motion.button>
                </span>

                {loading ? (
                  <ClipLoader color="white" loading={true} size={40} />
                ) : (
                  <div className='w-full gap-6 justify-center flex items-center'>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      className='text-white shadow-2xl shadow-black font-bold p-3 rounded-2xl mt-3 lg:w-[100px] border-none bg-black lg:text-lg transition-all ease-in-out'
                    >
                      Submit
                    </motion.button>
                    <motion.button
                      type='button'
                      onClick={sendOTPBtn}
                      whileHover={{ scale: 1.05 }}
                      className='text-white shadow-2xl shadow-black font-bold p-3 rounded-2xl mt-3 lg:w-[110px] border-none bg-black lg:text-lg transition-all ease-in-out'
                    >
                      Send OTP
                    </motion.button>
                  </div>
                )}

                <div className="flex flex-col gap-2 lg:gap-0">
                  <span className='text-center text-xs lg:text-md lg:font-semibold'>
                    Are you new? &nbsp;
                    <Link to='/auth/signup' className='text-black hover:text-white'>Create your account</Link>
                  </span>
                  <span className='text-center text-xs lg:text-md lg:font-semibold'>
                    <Link className='text-black hover:text-white'>Forgot your password</Link>
                  </span>
                  <span className='text-center lg:font-semibold'>
                    <Link to='/auth' className='text-[#fcc9bd] lg:text-lg font-extrabold hover:text-white'>More Options....</Link>
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otpSection"
                className="w-full h-full p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <OTPInput email={email} username={username} onSuccess={handelVerifyOTP} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Toast message={message.message} flag={message.flag} />
    </motion.div>
  )
}

<Outlet />
export default Login
