'use client';

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import Image from "next/image"

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // حساب المجموع الكلي
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen bg-white rounded-md shadow-lg my-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">سلة التسوق</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-600 text-xl mt-20">سلة التسوق فارغة.</p>
      ) : (
        <>
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row items-center md:items-start justify-between border-b pb-6"
              >
                {/* صورة المنتج */}
                <Image 
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  width={32}
                  height={32}
                  Cover
                  className=" object-cover rounded-md mb-4 md:mb-0 md:mr-6"
                />

                {/* تفاصيل المنتج */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">{item.name}</h2>
                  <p className="text-gray-600 mb-1">
                    السعر: <span className="font-semibold">{item.price.toLocaleString()} دج</span>
                  </p>
                  <p className="text-gray-600 mb-1">
                    الكمية: <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-gray-800 font-bold text-lg">
                    المجموع: {(item.price * item.quantity).toLocaleString()} دج
                  </p>
                </div>

                {/* زر الحذف */}
                <div className="mt-4 md:mt-0">
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.id)}
                    className="px-4 py-2 text-lg"
                  >
                    إزالة
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* المجموع الكلي وأزرار التحكم */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 border-t pt-6">
            <p className="text-3xl font-extrabold text-gray-900">
              المجموع الكلي: {totalPrice.toLocaleString()} دج
            </p>
            <div className="flex gap-4 mt-6 md:mt-0">
              <Button variant="secondary" onClick={clearCart} className="px-6 py-3 text-lg">
                تفريغ السلة
              </Button>
              <Link href="/orders" className="w-full md:w-auto">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg">
                  الذهاب لصفحة الدفع
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
