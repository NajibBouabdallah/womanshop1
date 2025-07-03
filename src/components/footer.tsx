// 📁 components/footer.tsx
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#eee] text-[#111] pt-12 pb-6 px-6 md:px-20 text-sm" data-aos="fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12" data-aos="fade-down">
        {/* Logo & Description */}
        <div className="flex flex-col gap-4 max-w-xs" data-aos="fade-up">
          <h2 className="text-xl font-bold">متجرنا</h2>
          <p className="text-gray-900 leading-relaxed">
            نوفر لكم أجمل تشكيلات الملابس النسائية مع توصيل سريع وآمن لكل ولايات الجزائر.
          </p>
        </div>

        {/* روابط الموقع */}
        <div data-aos="fade-up">
          <h3 className="font-semibold mb-4">روابط مهمة</h3>
          <ul className="flex flex-col gap-2 text-gray-900">
            <li><Link href="/">الرئيسية</Link></li>
            <li><Link href="/products">المنتجات</Link></li>
            <li><Link href="/contact">اتصل بنا</Link></li>
          </ul>
        </div>

        {/* معلومات التواصل */}
        <div data-aos="fade-up">
          <h3 className="font-semibold mb-4">معلومات الاتصال</h3>
          <ul className="flex flex-col gap-2 text-gray-900">
            <li className="flex items-center gap-2"><Phone size={16}/> +213 770 00 00 00</li>
            <li className="flex items-center gap-2"><Mail size={16}/> support@store.dz</li>
          </ul>
        </div>

        {/* تواصل اجتماعي */}
        <div data-aos="fade-up">
          <h3 className="font-semibold mb-4">تابعنا</h3>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-pink-400"><Facebook /></Link>
            <Link href="#" className="hover:text-pink-400"><Instagram /></Link>
          </div>
        </div>
      </div>

      {/* خط فاصل */}
      <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-800 text-xs" data-aos="fade-up">
        © {new Date().getFullYear()} متجرنا. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
