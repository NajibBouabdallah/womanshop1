'use client';

import { db } from '@/lib/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";


const sizesOptions = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditData({ ...product });
  };

  const handleSave = async () => {
    const ref = doc(db, 'products', editingId!);
    await updateDoc(ref, {
      ...editData,
      price: parseFloat(editData.price),
      quantityInStore: parseInt(editData.quantityInStore),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === editingId ? { ...editData } : p))
    );
    setEditingId(null);
  };

  const handleSizeChange = (size: string) => {
    setEditData((prev: any) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s: string) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <div className="p-6 pt-28 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-pink-700">إدارة المنتجات</h1>
      {products.length === 0 && <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>}

      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-6 rounded-xl shadow-md space-y-4 border"
        >
          {editingId === product.id ? (
            <>
              <Label>الاسم</Label>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />

              <Label>الوصف</Label>
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    value={editData.quantityInStore}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        quantityInStore: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Label>الألوان</Label>
              <Input
                value={editData.color}
                onChange={(e) =>
                  setEditData({ ...editData, color: e.target.value })
                }
              />

              <Label>المقاسات</Label>
              <div className="flex gap-3 flex-wrap">
                {sizesOptions.map((size) => (
                  <label key={size} className="flex items-center gap-1">
                    <Checkbox
                      checked={editData.sizes.includes(size)}
                      onCheckedChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label>متوفر؟</Label>
                  <Switch
                    checked={editData.available}
                    onCheckedChange={(value) =>
                      setEditData({ ...editData, available: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>توصيل للمنزل</Label>
                  <Switch
                    checked={editData.homeDelivery}
                    onCheckedChange={(value) =>
                      setEditData({ ...editData, homeDelivery: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>ZR Post</Label>
                  <Switch
                    checked={editData.zrDelivery}
                    onCheckedChange={(value) =>
                      setEditData({ ...editData, zrDelivery: value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="bg-green-600">
                  حفظ
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="outline"
                  className="text-gray-500"
                >
                  إلغاء
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-pink-800">
                {product.name}
              </h2>
              <p className="text-gray-600">{product.description}</p>
              <div className="flex gap-2 flex-wrap text-sm text-gray-500">
                <span>السعر: {product.price} دج</span>
                <span>الكمية: {product.quantityInStore}</span>
                <span>اللون: {product.color}</span>
                <span>المقاسات: {product.sizes?.join(', ')}</span>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500"
                >
                  تعديل
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  variant="destructive"
                >
                  حذف
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
