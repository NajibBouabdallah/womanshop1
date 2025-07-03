"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">شكراً لك!</h1>
      <p className="text-lg text-green-800 mb-6 text-center max-w-md">
        تم استلام طلبك بنجاح. سنتواصل معك قريبًا لإتمام العملية.
      </p>
      <Link href="/">
        <a className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition">
          العودة إلى الصفحة الرئيسية
        </a>
      </Link>
    </div>
  );
}
