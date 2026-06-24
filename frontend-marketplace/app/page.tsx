'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Product } from '@/types/product';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Category {
  id: number;
  nombre: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData.data || []);
      setCategories(catData.data || []);
    };
    fetchData();
  }, [token]);

  const filtered = selectedCategory
    ? products.filter(p => p.CategoryId === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="text-gray-500 mt-1 text-sm">Encuentra los mejores productos disponibles</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedCategory
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium">No hay productos disponibles</p>
          <p className="text-sm mt-1">Intenta con otra categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
                {product.imageUrl ? (
                  <div className="overflow-hidden h-52 flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.nombre}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-52 flex-shrink-0 bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 text-5xl">📷</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                    {product.nombre}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">
                    {product.descripcion}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="text-blue-600 font-bold text-lg">S/. {product.precio}</span>
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                      Ver más →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
