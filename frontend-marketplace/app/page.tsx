'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Product } from '@/types/product';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Todos
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {cat.nombre}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(product => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.nombre} className="w-full h-48 object-cover rounded mb-3" />
              )}
              <h2 className="text-xl font-semibold">{product.nombre}</h2>
              <p className="text-gray-600">{product.descripcion}</p>
              <p className="text-blue-600 font-bold mt-2">S/. {product.precio}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}