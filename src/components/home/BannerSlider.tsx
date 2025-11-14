'use client';

import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

const BannerSlider = () => {
  return (
    <div className="mb-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={500}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        <SwiperSlide>
          <div className="hero min-h-[600px] bg-cover bg-no-repeat bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="hero-overlay bg-opacity-10"></div>
            <div className="hero-content text-neutral-content text-center">
              <div className="max-w-lg">
                <h1 className="mb-5 text-4xl font-bold">
                  Discover Beautiful Fine Art
                </h1>
                <p className="mb-5">
                  Explore our curated collection of contemporary and abstract artwork.
                  Transform your space with unique pieces from talented artists.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero min-h-[600px] bg-gradient-to-r from-pink-500 to-orange-500 bg-cover bg-no-repeat">
            <div className="hero-overlay bg-opacity-10"></div>
            <div className="hero-content text-neutral-content text-center">
              <div className="max-w-lg">
                <h1 className="mb-5 text-4xl font-bold">
                  Custom Portraits & Commissions
                </h1>
                <p className="mb-5">
                  Get personalized artwork created just for you. Work directly with our artists
                  to bring your vision to life with custom portraits and commissioned pieces.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero min-h-[600px] bg-gradient-to-r from-teal-500 to-green-500 bg-cover bg-no-repeat">
            <div className="hero-overlay bg-opacity-10"></div>
            <div className="hero-content text-neutral-content text-center">
              <div className="max-w-lg">
                <h1 className="mb-5 text-4xl font-bold">
                  Premium Print Services
                </h1>
                <p className="mb-5">
                  High-quality prints on various materials. From canvas to phone cases,
                  we offer professional printing services with worldwide shipping.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerSlider;
