import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = ({data}) => {
    return (
        <div className='w-full h-full'>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 2000,
                }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                }}
                className='w-full h-full'
            >
                {data.map((item, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex flex-col items-center bg-transparent p-4 rounded-lg relative cursor-pointer"
                    >
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-md mb-2 swiper-image" />
                        <div className='absolute bottom-0 w-full h-[11vh] lg:h-[10vh] bg-black opacity-[0.5]' />
                        <h3 className="text-white font-semibold text-md lg:text-lg mt-2 absolute left-7 bottom-7 lg:left-10 lg:bottom-8">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Slider
