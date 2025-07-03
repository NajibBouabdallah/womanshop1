"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const total = useCartStore((state) => state.totalItems());

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="w-full shadow-md fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">


          {/* أيقونة العربة */}
          <Link href="/checkout" className="relative inline-flex items-center hover:bg-amber-100 px-6 py-4 rounded-full">السلة
            <ShoppingCart className="w-6 h-6 text-pink-600 mr-4" />  
            {total > 0 && (
              <span className="absolute -top-1 -right-2 bg-pink-600 text-white text-xs px-1.5 py-0.5 rounded-full" suppressHydrationWarning={true}
>
                {total}
              </span>
            )}
          </Link>
        {/* شعار الموقع */}
        <h1 className="text-2xl font-bold text-pink-600">متجري</h1>

        {/* روابط التنقل + أيقونة العربة */}
        <div className="flex items-center gap-6 text-gray-700 font-medium text-lg">
          <ul className="flex gap-6">
            <li className="hover:text-pink-500 transition cursor-pointer"><Link href={'/'}>الرئيسية</Link></li>
            <li className="hover:text-pink-500 transition cursor-pointer">
  <Link href="/products">المنتجات</Link>
</li>

          </ul>

        </div>
      </div>
    </motion.nav>
  );
}
