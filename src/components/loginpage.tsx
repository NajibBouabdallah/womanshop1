// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log("المستخدم:", user.email);

      // ✅ تحقق من الإيميل المسموح فقط
      if (user.email === 'admin@example.com') {
        router.push('/dashboard');
      } else {
        setError('غير مصرح لك بالدخول');
      }
    } catch (err) {
      console.error(err);
      setError('فشل تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-lg space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-pink-700">تسجيل الدخول</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label className="block mb-1">الإيميل</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">كلمة المرور</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-pink-700 text-white p-2 rounded hover:bg-pink-800">
          دخول
        </button>
      </form>
    </div>
  );
}
