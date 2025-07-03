'use client';

import HeroSection from "@/components/home/hero-section";
import ProductSection from "@/components/home/productsection";
import FaqsSection from "@/components/home/faqssection";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "@/components/footer";
import ZRInfo from "@/components/home/zrinfo";



export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-out",
      once: false,
      mirror: true,
    });

    const handleScroll = () => {
      AOS.refresh();  // يحدث الأنيميشن مع كل تمرير
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <main className="min-h-screen bg-pink-50 text-gray-900">
      <HeroSection />
      <ProductSection />
      <ZRInfo />
      <FaqsSection />
      
       <Footer/>
    </main>
  );
}
