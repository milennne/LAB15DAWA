import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 font-medium"
      >
        ← Volver a productos
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {product.imageUrl ? (
            <div className="h-72 md:h-96">
              <img
                src={product.imageUrl}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-72 bg-slate-100 flex items-center justify-center">
              <span className="text-slate-400 text-6xl">📷</span>
            </div>
          )}

          <div className="p-8 flex flex-col gap-5">
            <div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Producto #{product.id}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4 leading-tight">
                {product.nombre}
              </h1>
              {product.descripcion && (
                <p className="text-gray-500 mt-4 leading-relaxed text-sm">
                  {product.descripcion}
                </p>
              )}
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-600">
                S/. {product.precio}
              </div>
              <p className="text-xs text-gray-400 mt-1">Precio incluye IGV</p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/"
                  className="flex-1 text-center border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  ← Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
