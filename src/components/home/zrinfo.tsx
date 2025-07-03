import React from 'react';
import ScrollReveal from '../ui/scrollreval';

const ZRInfo = () => {
  return (
      <section className="w-full min-h-screen bg-gradient-to-b from-pink-600 to-gray-300 px-6 py-20 flex flex-col items-center justify-center text-white text-center relative overflow-hidden  ">
          <div className='w-full h-full absolute  p-10'>
              <div className='w-full h-full backdrop-blur-md bg-black/30 rounded-4xl'></div>
          </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-md text-stroke">
        كيف تعمل خدمة ZR Express في الجزائر؟
      </h2>

      <div className="max-w-3xl">
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={0}
          blurStrength={10}
          wordAnimationEnd='bottom bottom'
          
            className="text-lg md:text-xl text-gray-800 leading-relaxed"
        >
          ZR Express هي خدمة توصيل جزائرية مبتكرة، تربط بين البائعين والعملاء في جميع الولايات.
          عند طلب المنتج، يتم تأكيد الطلب عبر الهاتف من طرف فريق ZR، ثم يُرسل عبر أحد نقاط التوزيع.
          يسلّم المندوب المنتج للعميل ويدفع الأخير عند الاستلام نقدًا.
          توفر الخدمة تتبعًا للطلب وتعمل بسرعة وكفاءة، مما يجعل تجربة الشراء مريحة وآمنة.
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ZRInfo;
