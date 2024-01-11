import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import 'swiper/css/free-mode'
// import 'swiper/css/autoplay'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { Autoplay } from 'swiper'

import img1 from "./img/1.png"
import img2 from "./img/2.png"
import img3 from "./img/3.png"
import img4 from "./img/4.png"
import img5 from "./img/5.png"
import img6 from "./img/6.png"
import img7 from "./img/7.png"
import img8 from "./img/8.png"
import img9 from "./img/9.png"
import img10 from "./img/10.png"

const LogoSlider = () => {
    const [numOfPages, setNumOfPages] = useState(6)
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            setNumOfPages(6)
        } else if (window.innerWidth <= 576) {
            setNumOfPages(2)
        } else if (window.innerWidth <= 768) {
            setNumOfPages(4)
        }
    })
    return (
        <div className='mt170' style={{ background: '#e5e7eb' }}  >
            {/* <h1 className=' text-center display-5 main-heading fw-bolder mb-2 pt-3'>We Power Brands that Power the World</h1>style={{border: '2px solid #a0a0a0'}} */}

            <div className=' d-flex justify-content-center  align-items-center '>
                <Swiper
                    spaceBetween={30}
                    slidesPerView={numOfPages}
                    navigation={false}
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false
                    }}
                    modules={[Autoplay]}
                    className='px-3 py-2 d-flex justify-content-center  align-items-center'
                >

                    <SwiperSlide ><img src={img1} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img2} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img3} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img4} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img5} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img6} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img7} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img8} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img9} width={150} /></SwiperSlide>
                    <SwiperSlide ><img src={img10} width={150} /></SwiperSlide>
                    
                </Swiper>
            </div>

        </div >
    )
}

export default LogoSlider