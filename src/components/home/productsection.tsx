'use client';

import ScrollVelocity from '../ui/scrollvelocity';
import FlowingMenu from '../ui/flowingmenu';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // ✅ تأكد أنه مستخدم
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

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        const productsCollection = collection(db, 'products'); // ✅ لازم تستعمله
        const productsSnapshot = await getDocs(productsCollection); // ✅ كان ناقص

        const productsList = productsSnapshot.docs.map(doc => {
          const data = doc.data() as Omit<Product, 'id'>;
          return {
            id: doc.id,
            ...data,
          };
        });

        if (!cancelled) {
          setProducts(productsList);
        }
      } catch (error) {
        console.error('❌ خطأ في جلب المنتجات:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-white font-semibold text-lg">...جاري تحميل المنتجات</p>;
  }

  if (products.length === 0) {
    return <p className="text-center mt-10 text-white font-semibold text-lg">لا توجد منتجات حالياً</p>;
  }

  const demoItems = [
    { link: '#', text: 'ملابس محجبات', image: '/download.jpg' },
    { link: '#', text: 'ملابس شتوية', image: '/download1.jpg' },
    { link: '#', text: 'إكسسوارات', image: '/download2.jpg' },
    { link: '#', text: 'حقائب', image: '/Hero-7.jpg' }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-pink-850 to-pink-600 relative overflow-hidden pt-20 pb-20 px-4 md:px-12">
      <ScrollVelocity
        texts={['اكتشفي تشكيلتنا الجديدة من الأزياء النسائية المميزة']}
        className="m-0 text-pink-600 font-bold text-4xl md:text-6xl lg:text-8xl select-none"
        data-aos="fade-down"
      />

      <div className="w-full max-w-7xl my-10" data-aos="fade-left">
        <FlowingMenu items={demoItems} />
      </div>

      <h1 
        className="text-white font-extrabold text-3xl md:text-5xl mb-8 text-center drop-shadow-lg"
        data-aos="fade-down"
      >
        اكتشفي تشكيلتنا الجديدة من الأزياء النسائية المميزة
      </h1>
      
      <section
        className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        data-aos="fade-up"
      >
        {products.map(product => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </section>
    </div>
  );
};

export default ProductSection;
