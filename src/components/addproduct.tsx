'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantityInStore: '',
    sizes: [] as string[],
    colors: [] as string[],
    imageUrl: '',
    available: true,
    homeDelivery: true,
    zrDelivery: false,
  });

  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // تعطيل الإرسال المؤقت
    if (!formData.name || !formData.price) return;
  
    try {
      const productRef = collection(db, 'products');
      await addDoc(productRef, {
        ...formData,
        price: parseFloat(formData.price),
        quantityInStore: parseInt(formData.quantityInStore),
        createdAt: serverTimestamp(),
      });
  
      alert('✅ تم حفظ المنتج بنجاح! يرجى عدم تكرار نفس المنتج.');
  
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        description: '',
        price: '',
        quantityInStore: '',
        sizes: [],
        colors: [],
        imageUrl: '',
        available: true,
        homeDelivery: true,
        zrDelivery: false,
      });
  
      setColorInput('');
      setSizeInput('');
  
      // الرجوع إلى صفحة المنتجات
      router.push('/products');
    } catch (error) {
      console.error('❌ فشل في إضافة المنتج:', error);
      alert('حدث خطأ أثناء إضافة المنتج، حاول مرة أخرى.');
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">إضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <Label>اسم المنتج</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>الوصف</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label>السعر (دج)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="w-1/2">
            <Label>الكمية في المخزن</Label>
            <Input
              type="number"
              value={formData.quantityInStore}
              onChange={(e) =>
                setFormData({ ...formData, quantityInStore: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* إضافة مقاسات */}
        <div>
          <Label>المقاسات</Label>
          <div className="flex gap-2">
            <Input
              placeholder="مثلاً: M أو XL"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => {
                if (sizeInput.trim()) {
                  setFormData((prev) => ({
                    ...prev,
                    sizes: [...prev.sizes, sizeInput.trim()],
                  }));
                  setSizeInput('');
                }
              }}
            >
              إضافة
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.sizes.map((size, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* إضافة ألوان */}
        <div>
          <Label>الألوان</Label>
          <div className="flex gap-2">
            <Input
              placeholder="مثلاً: زهري"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => {
                if (colorInput.trim()) {
                  setFormData((prev) => ({
                    ...prev,
                    colors: [...prev.colors, colorInput.trim()],
                  }));
                  setColorInput('');
                }
              }}
            >
              إضافة
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.colors.map((color, idx) => (
              <span key={idx} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">
                {color}
              </span>
            ))}
          </div>
        </div>

        <div>
          <Label>رابط الصورة</Label>
          <Input
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={formData.available}
            onCheckedChange={(value: boolean) =>
              setFormData({ ...formData, available: value })
            }
          />
          <Label htmlFor="available">متوفر حالياً</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="homeDelivery"
            checked={formData.homeDelivery}
            onCheckedChange={(value: boolean) =>
              setFormData({ ...formData, homeDelivery: value })
            }
          />
          <Label htmlFor="homeDelivery">توصيل إلى المنزل</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="zrDelivery"
            checked={formData.zrDelivery}
            onCheckedChange={(value: boolean) =>
              setFormData({ ...formData, zrDelivery: value })
            }
          />
          <Label htmlFor="zrDelivery">ZR توصيل عبر</Label>
        </div>

        <Button type="submit" className="w-full">
          حفظ المنتج
        </Button>
      </form>
    </div>
  );
}
