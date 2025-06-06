import React from 'react'
import Slider from '../components/Slider'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full gap-4 p-3'>
      <div className='slider flex'>
        {/* <Slider></Slider> */}
      </div>
      <div className="history">
        History
      </div>
      <div className="categories">
        Categories
      </div>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  )
}

export default Main
