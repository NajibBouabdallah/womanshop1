'use client';

import { db } from '@/lib/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const sizesOptions = ['S', 'M', 'L', 'XL', 'XXL'];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantityInStore: number;
  color: string;
  sizes: string[];
  available: boolean;
  homeDelivery: boolean;
  zrDelivery: boolean;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product });
  };

  const handleSave = async () => {
    if (!editData) return;
    const ref = doc(db, 'products', editData.id);
    await updateDoc(ref, {
      ...editData,
      price: parseFloat(String(editData.price)),
      quantityInStore: parseInt(String(editData.quantityInStore)),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === editingId ? { ...editData } : p))
    );
    setEditingId(null);
    setEditData(null);
  };

  const handleSizeChange = (size: string) => {
    if (!editData) return;
    const sizes = editData.sizes.includes(size)
      ? editData.sizes.filter((s) => s !== size)
      : [...editData.sizes, size];

    setEditData({ ...editData, sizes });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <div className="p-6 pt-28 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-pink-700">إدارة المنتجات</h1>

      {products.length === 0 && (
        <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-6 rounded-xl shadow-md space-y-4 border"
        >
          {editingId === product.id && editData ? (
            <>
              <Label>الاسم</Label>
              <Input
                name="name"
                value={editData.name}
                onChange={handleChange}
              />

              <Label>الوصف</Label>
              <Textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    name="quantityInStore"
                    value={editData.quantityInStore}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Label>الألوان</Label>
              <Input
                name="color"
                value={editData.color}
                onChange={handleChange}
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
                    onCheckedChange={(val) =>
                      setEditData({ ...editData, available: val })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>توصيل للمنزل</Label>
                  <Switch
                    checked={editData.homeDelivery}
                    onCheckedChange={(val) =>
                      setEditData({ ...editData, homeDelivery: val })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>ZR Post</Label>
                  <Switch
                    checked={editData.zrDelivery}
                    onCheckedChange={(val) =>
                      setEditData({ ...editData, zrDelivery: val })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="bg-green-600">
                  حفظ
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setEditData(null);
                  }}
                  variant="outline"
                  className="text-gray-500"
                >
                  إلغاء
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-pink-800">{product.name}</h2>
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
