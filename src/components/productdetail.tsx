'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';

interface Product {
  id: string;
  name: string;
  price: number;
  quantityInStore: number;
  colors: string[]; // ✅ تعديل هنا
  sizes: string[];
  imageUrl?: string;
  available: boolean;
  description?: string;
}


export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);
  const params = useParams();
  const productId = params?.id as string;

  useEffect(() => {
    if (!productId) {
      setError('معرف المنتج غير موجود');
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
  const data = docSnap.data() as Omit<Product, 'id'>; // ✅ حذف id
  setProduct({ id: docSnap.id, ...data }); // ✅ الآن id موجود مرة وحدة فقط
  if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
  if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
}
else {
          setError('المنتج غير موجود');
        }
      } catch {
        setError('حدث خطأ أثناء جلب بيانات المنتج');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes.length > 0 && !selectedSize) {
      alert('يرجى اختيار المقاس');
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      alert('يرجى اختيار اللون');
      return;
    }

    addToCart({
  id: product.id + (selectedSize ?? '') + (selectedColor ?? ''),
  name:
    product.name +
    (selectedSize ? ` - مقاس ${selectedSize}` : '') +
    (selectedColor ? ` - لون ${selectedColor}` : ''),
  price: product.price,
  imageUrl: product.imageUrl,
  quantity: selectedQuantity, // ✅ صحيح هنا لأنك ترسله لـ الكارت
});

    alert('✅ تم إضافة المنتج إلى السلة');
  };

  if (loading) return <p className="text-center mt-10">...جاري تحميل المنتج</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-md shadow-lg my-10">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full max-w-md object-contain rounded-md shadow"
          />
        </div>

        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl text-pink-600 font-extrabold mb-6">
            السعر: {product.price.toLocaleString()} دج
          </p>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">اختر اللون:</h3>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 border rounded cursor-pointer transition ${
                      selectedColor === c
                        ? 'border-pink-600 bg-pink-100 font-semibold'
                        : 'border-gray-300 hover:border-pink-500'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">اختر المقاس:</h3>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded cursor-pointer transition ${
                      selectedSize === size
                        ? 'border-pink-600 bg-pink-100 font-semibold'
                        : 'border-gray-300 hover:border-pink-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <label htmlFor="quantity" className="block font-semibold mb-2">
              الكمية:
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={product.quantityInStore}
              value={selectedQuantity}
              onChange={(e) =>
                setSelectedQuantity(
                  Math.min(
                    Math.max(1, Number(e.target.value)),
                    product.quantityInStore
                  )
                )
              }
              className="w-20 border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              الكمية المتوفرة: {product.quantityInStore}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.available || product.quantityInStore === 0}
            className={`bg-pink-600 text-white py-4 rounded-md font-semibold text-lg transition ${
              !product.available || product.quantityInStore === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-pink-700'
            }`}
          >
            {product.available && product.quantityInStore > 0
              ? 'أضف إلى السلة'
              : 'غير متوفر'}
          </button>

          <div className="mt-12 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">وصف المنتج</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description || 'لا يوجد وصف للمنتج.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
