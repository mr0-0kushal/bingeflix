import React from 'react'
import {Link} from 'react-router-dom'

const HeaderHome = () => {
  return (
    <div className='flex flex-row justify-between items-center w-full h-full bg-transparent'>
      <Link to='/' className='text-lg lg:text-sm font-extrabold lg:px-22 p-4 lg:py-4 relative flex flex-row items-baseline-last justify-start'>
        <span className='bg-transparent backlit-text text-[var(--color-primary)] text-4xl lg:text-5xl'>B</span><span>ingeFlix</span>
      </Link>
      <Link className='p-4' to='/auth'>
        <button className='button lg:w-[120px]'>Join Now</button>
      </Link>
    </div>
  )
}

export default HeaderHome
