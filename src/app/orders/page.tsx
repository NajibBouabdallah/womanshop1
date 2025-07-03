'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';



interface Wilaya {
  id: string;
  name: string;
  homeDelivery: boolean;
  zrpost: boolean;
}

export default function OrderPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'zr'>('home');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // جلب بيانات الولايات من Firestore عند أول تحميل
  useEffect(() => {
    async function fetchWilayas() {
      const snapshot = await getDocs(collection(db, 'wilayas'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Wilaya),
      }));
      setWilayas(data);
      if(data.length > 0) setSelectedWilaya(data[0]);
    }
    fetchWilayas();
  }, []);

  // تحديث طريقة التوصيل إذا الولاية الجديدة لا تدعم التوصيل للمنزل
  useEffect(() => {
    if (selectedWilaya && !selectedWilaya.homeDelivery && deliveryMethod === 'home') {
      setDeliveryMethod('zr'); // اجبار على ZR Express
    }
  }, [selectedWilaya, deliveryMethod]);

  const validate = () => {
    if (items.length === 0) {
      alert('سلة التسوق فارغة');
      return false;
    }
    if (name.trim() === '') {
      alert('يرجى إدخال الاسم');
      return false;
    }
    if (phone.trim() === '') {
      alert('يرجى إدخال رقم الهاتف');
      return false;
    }
    if (!selectedWilaya) {
      alert('يرجى اختيار الولاية');
      return false;
    }
    if (deliveryMethod === 'home' && address.trim() === '') {
      alert('يرجى إدخال العنوان للتوصيل إلى المنزل');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        name: name.trim(),
        phone: phone.trim(),
        zrpost: deliveryMethod === 'zr',
        home: deliveryMethod === 'home',
        wilaya: selectedWilaya?.name || '',
        address: deliveryMethod === 'home' ? address.trim() : '',
        items,
        totalPrice,
        status: 'في الانتظار',
        createdAt: serverTimestamp(),
      });
      setMessage('تم تأكيد الطلب بنجاح! شكراً لثقتك.');
      clearCart();
      setName('');
      setPhone('');
      setAddress('');
      setDeliveryMethod('home');
      setSelectedWilaya(wilayas[0] || null);
    } catch (error) {
      alert('حدث خطأ أثناء تأكيد الطلب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md mt-24">
      <h1 className="text-3xl font-bold mb-8 text-center">صفحة تأكيد الطلب</h1>

      {/* بيانات العميل */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">الاسم الكامل</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك الكامل"
            className="w-full border border-gray-300 rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">رقم الهاتف</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 0555123456"
            className="w-full border border-gray-300 rounded p-3"
          />
        </div>

        {/* اختيار الولاية */}
        <div>
          <label className="block mb-1 font-medium">اختر الولاية</label>
          <select
            value={selectedWilaya?.id || ''}
            onChange={(e) => {
              const wilaya = wilayas.find(w => w.id === e.target.value) || null;
              setSelectedWilaya(wilaya);
            }}
            className="w-full border border-gray-300 rounded p-3"
          >
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* طريقة التوصيل */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">طريقة التوصيل</h2>
        <div className="flex gap-6">
          <label className={`flex items-center gap-2 cursor-pointer ${selectedWilaya?.homeDelivery ? '' : 'opacity-50 cursor-not-allowed'}`}>
            <input
              type="radio"
              name="deliveryMethod"
              value="home"
              checked={deliveryMethod === 'home'}
              disabled={!selectedWilaya?.homeDelivery}
              onChange={() => setDeliveryMethod('home')}
              className="w-5 h-5"
            />
            التوصيل إلى المنزل
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deliveryMethod"
              value="zr"
              checked={deliveryMethod === 'zr'}
              onChange={() => setDeliveryMethod('zr')}
              className="w-5 h-5"
            />
            التوصيل عبر ZR Express
          </label>
        </div>
        {!selectedWilaya?.homeDelivery && (
          <p className="mt-2 text-red-600 font-semibold">
            التوصيل للمنزل غير متوفر في هذه الولاية
          </p>
        )}
      </div>

      {/* العنوان يظهر فقط لو التوصيل للمنزل */}
      {deliveryMethod === 'home' && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">العنوان الكامل</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="اكتب عنوان التوصيل بالتفصيل"
            className="w-full border border-gray-300 rounded p-3"
          />
        </div>
      )}

      {/* المجموع الكلي */}
      <p className="text-xl font-semibold mb-6 text-right">
        المجموع الكلي: {totalPrice.toLocaleString()} دج
      </p>

      {/* زر تأكيد الطلب */}
      <Button
        onClick={handlePlaceOrder}
        disabled={loading || items.length === 0}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-bold rounded-md"
      >
        {loading ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
      </Button>

      {/* رسالة تأكيد الطلب */}
      {message && (
        <p className="mt-6 text-green-600 font-semibold text-center">{message}</p>
      )}
    </div>
  );
}

