// components/Faqs.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "ما هي طرق التوصيل المتوفرة؟",
    answer: "نقترح طريقتين: التوصيل إلى المنزل أو عبر نقاط ZR Express في ولايتك."
  },
  {
    question: "كم يستغرق التوصيل؟",
    answer: "مدة التوصيل تختلف حسب الولاية، لكن في العادة بين 2 إلى 5 أيام عمل."
  },
  {
    question: "هل يمكنني الدفع عند الاستلام؟",
    answer: "نعم، الدفع عند الاستلام متاح في جميع الولايات الجزائرية."
  },
  {
    question: "ما هي رسوم التوصيل؟",
    answer: "تختلف حسب الولاية وطريقة التوصيل، وستُحسب تلقائيًا عند تأكيد الطلب."
  },
  {
    question: "كيف أتابع طلبي؟",
    answer: "بعد تأكيد الطلب، ستحصل على رقم تتبع يمكنك استعماله على موقع ZR Express."
  },
  {
    question: "ماذا أفعل إذا كان المنتج تالفًا أو خاطئًا؟",
    answer: "تواصل معنا خلال 48 ساعة من الاستلام وسنقوم بالتبديل أو الإرجاع مجانًا."
  },
];

export default function Faqs() {
  return (
      <section className="max-w-2xl mx-auto my-10 px-4" >
          
      <h2 className="text-8xl font-bold text-center mb-6 text-pink-700">الأسئلة الشائعة</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-right text-lg font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-right text-sm leading-relaxed text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
