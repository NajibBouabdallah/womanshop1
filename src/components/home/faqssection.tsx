import React from 'react';
import Faqs from '../faqs';

const FaqsSection = () => {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-32 text-stroke bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/pexels-karolina-grabowska-7680155.jpg')",
      }}
    >
      <div className="bg-white/30 w-full h-full absolute top-0 left-0 z-0" data-aos="fade-up"/>
      <div className="z-10 w-full max-w-4xl" data-aos="fade-down">
        <Faqs />
      </div>
    </div>
  );
};

export default FaqsSection;

