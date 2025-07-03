'use client';

import { useState } from 'react';
import AddProduct from '@/components/addproduct';
import ManageProductsPage from '@/components/editproduct';
import OrderPage from '@/components/orderspage'; // ✅ استيراد صفحة الطلبات

export default function DashboardPage() {
  const [view, setView] = useState<'add' | 'manage' | 'orders'>('manage'); // ✅ إضافة "orders"

  return (
    <div className="min-h-screen p-6 pt-24 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">
        مرحبًا بك في لوحة التحكم
      </h1>

      {/* أزرار التنقل */}
      <div className="flex justify-center gap-8 text-lg font-semibold mb-8">
        <button
          onClick={() => setView('add')}
          className={`px-4 py-2 rounded ${
            view === 'add' ? 'bg-pink-700 text-white' : 'text-pink-700 hover:underline'
          }`}
        >
          إضافة منتج
        </button>
        <button
          onClick={() => setView('manage')}
          className={`px-4 py-2 rounded ${
            view === 'manage' ? 'bg-pink-700 text-white' : 'text-pink-700 hover:underline'
          }`}
        >
          تعديل / حذف منتج
        </button>
        <button
          onClick={() => setView('orders')}
          className={`px-4 py-2 rounded ${
            view === 'orders' ? 'bg-pink-700 text-white' : 'text-pink-700 hover:underline'
          }`}
        >
          الطلبات
        </button>
      </div>

      {/* عرض المحتوى حسب الحالة */}
      {view === 'add' && <AddProduct />}
      {view === 'manage' && <ManageProductsPage />}
      {view === 'orders' && <OrderPage />} {/* ✅ عرض الطلبات */}
    </div>
  );
}
