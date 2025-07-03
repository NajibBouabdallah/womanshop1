// ✅ هذا الشكل الصحيح لمكون بطاقة المنتج:
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';

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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      key={product.id}
      className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 px-0 pt-0 pb-10"
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      )}
      <CardHeader>
        <h3 className="text-lg font-bold text-pink-700">{product.name}</h3>
        <p className='text-md font-light text-gray-800'>{product.description}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-800">السعر: {product.price} دج</p>
        <p className="text-sm text-gray-600">الكمية: {product.quantityInStore}</p>
        <p className="text-sm text-gray-600">
          المقاسات: {product.sizes.length > 0 ? product.sizes.join(', ') : 'غير متوفرة'}
        </p>
        <p className="text-sm text-gray-600">اللون: {product.color}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="bg-pink-700 hover:bg-pink-800 w-full"
          disabled={!product.available}
          onClick={() =>
            useCartStore.getState().addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
            })
          }
        >
          {product.available ? 'أضف إلى السلة' : 'غير متوفر'}
        </Button>
      </CardFooter>
    </Card>
  );
}
