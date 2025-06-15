import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const Swiperr = ({data}) => {

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Swiper
                modules={[EffectCoverflow, A11y, Autoplay]}
                effect="coverflow"
                coverflowEffect={{
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="w-full h-full"
            >
                {data.map((item, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex flex-col items-center bg-transparent p-4 rounded-lg relative cursor-pointer"
                    >
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover rounded-md mb-2 swiper-image" />
                        <div className='absolute bottom-0 w-full h-[7vh] lg:h-[10vh] bg-black opacity-[0.5]'/>
                        <h3 className="text-white font-semibold text-md lg:text-lg mt-2 absolute left-7 bottom-8 lg:left-10 lg:bottom-8">{item.title}</h3>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Swiperr
