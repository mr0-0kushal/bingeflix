import React from 'react'
import { Link } from 'react-router-dom'
import heroPoster from '../assets/images/heroPoster.png'
import Swiperr from '../components/Swiperr'
import { cardImagesData } from '../context/imageData'
import { useNavigate } from 'react-router-dom'



const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center lg:justify-between min-h-screen gap-1 lg:gap-4">
      <Link className='p-4 absolute top-0 right-0 lg:top-2 lg:right-3' to='/auth'>
        <button className='button text-xs lg:text-md lg:w-[120px]'>Join Now</button>
      </Link>
      {/* Hero Section */}
      <section className="hero flex flex-col items-center justify-between gap-3 p-3 relative overflow-hidden">
        <img src={heroPoster} alt="Hero Poster" className="w-full lg:w-[60%]  absolute -z-10 lg:-top-13" />
        <div className='w-full h-[60vh] absolute bg-black opacity-[0.6] -z-5 -top-20' />
        <div className="text-center text-sm lg:text-xl w-[70%] flex flex-col justify-center items-center gap-3">
          <span className='text-2xl lg:text-5xl font-bold text-wrap lg:w-[500px]'>Unlimited movies,TV shows, and exclusive</span>
          <span className='text-md lg:text-2xl font-semibold text-wrap'>Start for just ₹99. Cancel at anytime.</span>
          <form className='w-full h-full flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-3'
            onSubmit={(e) => {
              e.preventDefault()
              console.log(e.target.email.value)
              navigate('/auth/signup')
            }}
          >
            <input required type="email" name='email' placeholder='Email address' className='px-5 py-2 lg:w-[25vw] rounded-3xl outline-none border border-[var(--color-primary)]' />
            <button type='submit' className="button lg:mt-6 cursor-pointer lg:my-3 items-center gap-3 py-2 flex justify-center relative lg:w-[150px]">Get Started →</button>
          </form>
          <span className='text-wrap w-full'>All in one place. Dive into the world of stories that never stop.From epic blockbusters to binge-worthy originals — experience entertainment like never before.</span>
        </div>
      </section>

      {/* Latest Releases Section */}
      <section className="latest flex flex-col items-center justify-between p-3 mx-auto w-full max-w-6xl gap-y-1 lg:gap-y-9">
        <span className="heading text-2xl lg:text-[2.5em] font-bold mb-4 text-white">Latest Releases</span>
        <div className='w-[80%] h-full flex items-center justify-center'>
          <Swiperr data={cardImagesData} />
        </div>
      </section>

      {/* More Reasons to join */}
      <section className='flex flex-col items-center justify-center p-3 mx-auto w-full h-full'>
        <span className="heading text-2xl lg:text-[2.5em] font-bold mb-4 text-white">More Reasons to Join</span>
        <div className="grid grid-cols-2 grid-rows-2 place-content-center items-center justify-center gap-8 lg:flex lg:gap-8 lg:flex-row text-xs lg:text-lg">
          <div className="reasons-card">
            <span>Cancel or switch plans anytime</span>
          </div>
          <div className="reasons-card">
            <span>Watch on any device</span>
          </div>
          <div className="reasons-card">
            <span>Exclusive content</span>
          </div>
          <div className="reasons-card">
            <span>No ads</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
