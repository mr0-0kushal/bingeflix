import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Toast from './Toast'

const HeaderLogin = () => {
    const { user, logout } = useAuth()
    const [message, setMessage] = useState({
        message: "",
        flag: ""
      });
    const navigate = useNavigate()

    const logOut = (e) => {
        setMessage({
            message: "User Logged out",
            flag: "success"
        })
        setTimeout(() => {
            logout()
            navigate('/')
        }, 1000)
    }
return (
    <>
        <div className='flex flex-row relative justify-between items-center w-full h-full bg-transparent'>
            <Link to='/' className='text-lg lg:text-sm font-extrabold lg:px-22 p-4 lg:py-4 relative flex flex-row items-baseline-last justify-start'>
                <span className='bg-transparent backlit-text text-[var(--color-primary)] text-4xl lg:text-5xl'>B</span><span>ingeFlix</span>
            </Link>
            <button className='button lg:w-[120px] lg:mr-6 mr-3' onClick={(e) => { logOut(e) }}>LogOut</button>
        </div>
        <Toast message={message.message} flag={message.flag} />
    </>
)
}

export default HeaderLogin
