'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/productcard';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  quantityInStore: number;
  color: string;
  sizes: string[];
  imageUrl?: string;
  available: boolean;
  homeDelivery: boolean;
  zrDelivery: boolean;
  description?: string;
}

const PRODUCTS_PER_PAGE = 8;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // جلب المنتجات من Firebase
 useEffect(() => {
  async function fetchProducts() {
    setLoading(true);
    try {
      const col = collection(db, 'products');
      const snapshot = await getDocs(col);
      const list = snapshot.docs.map(doc => {
        const data = doc.data() as Product;
        return {
          id: doc.id,
          ...data,
        };
      });
      setProducts(list);
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchProducts();
}, []);


  // تصفية المنتجات حسب البحث (اسم المنتج)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // المنتجات المعروضة في الصفحة الحالية
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // تغيير الصفحة
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  if (loading) {
    return <p className="text-center mt-10 text-white font-semibold text-lg">...جاري تحميل المنتجات</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-400 to-pink-600 p-24">
      <h1 className="text-white text-8xl font-bold mb-6 text-center text-stroke ">منتجاتنا</h1>

      {/* حقل البحث */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // إعادة التصفح للصفحة الأولى عند البحث
          }}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* عرض المنتجات */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-white text-lg">لا توجد منتجات تطابق البحث</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {currentProducts.map(product => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </section>
      )}

      {/* ترقيم الصفحات */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-3 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-white ${
              currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            السابق
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 rounded-md text-white ${
                currentPage === i + 1 ? 'bg-pink-800 font-bold' : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-white ${
              currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
