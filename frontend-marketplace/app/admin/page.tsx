'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imageUrl?: string;
  CategoryId?: number;
}

interface Category {
  id: number;
  nombre: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const token = Cookies.get('token');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    const [p, c] = await Promise.all([
      fetch(`${API}/products`).then(r => r.json()),
      fetch(`${API}/categories`, { headers }).then(r => r.json()),
    ]);
    setProducts(p.data || []);
    setCategories(c.data || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    const body = { ...form, precio: parseFloat(form.precio), CategoryId: form.CategoryId ? parseInt(form.CategoryId) : null };
    const url = editId ? `${API}/products/${editId}` : `${API}/products`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(body) });
    setForm({ nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '' });
    setEditId(null);
    fetchAll();
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ nombre: p.nombre, precio: String(p.precio), descripcion: p.descripcion || '', imageUrl: p.imageUrl || '', CategoryId: String(p.CategoryId || '') });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers });
    fetchAll();
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    await fetch(`${API}/categories`, { method: 'POST', headers, body: JSON.stringify({ nombre: newCategory }) });
    setNewCategory('');
    fetchAll();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Administración de Productos</h1>

      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categorías</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {categories.map(c => (
            <span key={c.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{c.nombre}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Nueva categoría" className="border p-2 rounded text-gray-900 flex-1"
            value={newCategory} onChange={e => setNewCategory(e.target.value)} />
          <button onClick={handleCreateCategory} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Agregar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{editId ? 'Editar Producto' : 'Crear Producto'}</h2>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Nombre" className="border p-3 rounded text-gray-900"
              value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input type="number" placeholder="Precio" className="border p-3 rounded text-gray-900"
              value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
            <textarea placeholder="Descripción" className="border p-3 rounded text-gray-900"
              value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <input type="text" placeholder="URL de imagen" className="border p-3 rounded text-gray-900"
              value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <select className="border p-3 rounded text-gray-900"
              value={form.CategoryId} onChange={e => setForm({ ...form, CategoryId: e.target.value })}>
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <button onClick={handleSubmit} className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
              {editId ? 'Actualizar' : 'Crear'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '' }); }}
                className="bg-gray-400 text-white py-3 rounded hover:bg-gray-500">
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Productos</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-2">Nombre</th>
                  <th className="pb-2">Precio</th>
                  <th className="pb-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="py-2 text-gray-900">{p.nombre}</td>
                    <td className="py-2 text-gray-900">S/. {p.precio}</td>
                    <td className="py-2 flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}