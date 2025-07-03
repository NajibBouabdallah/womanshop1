import React from 'react';
import CardSwap, { Card } from '@/components/ui/cardSwap';
import Link from 'next/link';
import { Button } from '../ui/button';
import RotatingText from '../ui/rotatingtext';
import Image from 'next/image';






const HeroSection = () => {

    return (
    <div className="w-full h-screen overflow-hidden  flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/pexels-steve-28901845.jpg')" }} > 
            <div className='w-full h-full absolute p-10'>
            <div className='w-full h-full backdrop-blur-xl rounded-4xl '></div>
            </div>
  
   
    <div className='w-full h-full p-20 flex flex-col items-center justify-center relative'>
 
    <div
  className="flex justify-center items-center flex-wrap gap-4 overflow-hidden"
  data-aos="fade-up"
>
<h1 className='text-8xl sm:text-3xl text-stroke'>من هنا تبدا</h1>

  <RotatingText
    texts={["الأناقة", "الأنوثة", "الثقة", "الراحة"]}
    mainClassName="px-4 py-2 sm:px-6 sm:py-3 bg-pink-100 text-pink-800 text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold rounded-lg transition-all duration-300 ease-in-out hover:bg-pink-200 hover:text-pink-900"
    staggerFrom="last"
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "-120%" }}
    staggerDuration={0.025}
    splitLevelClassName="overflow-visible"
    transition={{ type: "spring", damping: 30, stiffness: 400 }}
    rotationInterval={2000}
    splitBy="words"
  />
</div>

      

      <p className="text-pink-100 md:text-xl mt-4 drop-shadow lg:text-3xl sm:text-lg text-center">
          اكتشفي تشكيلات الملابس النسائية الراقية بأسعار مناسبة وتوصيل لكل الولايات.
                </p>  
        <Link href="/products">
        <Button className='mt-8 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 z-100'>
                        تسوقي الآن
        </Button>
        </Link>        
    </div>

        
    <div className='h-[700px] right-0' style={{ position: 'absolute' }} data-aos="fade-right">
    <CardSwap
      cardDistance={60}
      verticalDistance={100}
      delay={3000}
      pauseOnHover={false}
    >
      <Card >
        <Image
          src="/pexels-ceutth-20454259-15788298.jpg"
          alt="Card 1"
          fill
          className="object-cover overflow-hidden rounded-lg"
        />
     
      </Card>

      <Card >
        <Image
          src="/pexels-gizem-gokce-1072613075-32720992.jpg"
          alt="Card 2"
          fill
          className="object-cover overflow-hidden rounded-lg"
        />

      </Card>

      <Card >
        <Image
          src="/pexels-pnw-prod-9218414.jpg"
          alt="Card 3"
          fill
         className="object-cover overflow-hidden rounded-lg"
        />
      
      </Card>
    </CardSwap>
            </div>
        </div>
  );
}

export default HeroSection;
