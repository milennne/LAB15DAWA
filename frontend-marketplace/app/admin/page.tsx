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

const inputClass =
  'w-full border border-gray-200 p-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white text-sm';

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
    const body = {
      ...form,
      precio: parseFloat(form.precio),
      CategoryId: form.CategoryId ? parseInt(form.CategoryId) : null,
    };
    const url = editId ? `${API}/products/${editId}` : `${API}/products`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(body) });
    setForm({ nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '' });
    setEditId(null);
    fetchAll();
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      precio: String(p.precio),
      descripcion: p.descripcion || '',
      imageUrl: p.imageUrl || '',
      CategoryId: String(p.CategoryId || ''),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers });
    fetchAll();
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    await fetch(`${API}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ nombre: newCategory }),
    });
    setNewCategory('');
    fetchAll();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona productos y categorías</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Categorías</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.length === 0 && (
            <span className="text-sm text-gray-400">Sin categorías aún</span>
          )}
          {categories.map(c => (
            <span key={c.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
              {c.nombre}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nueva categoría..."
            className={inputClass + ' flex-1'}
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
          />
          <button
            onClick={handleCreateCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            {editId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
              <input type="text" placeholder="Nombre del producto" className={inputClass}
                value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Precio (S/.)</label>
              <input type="number" placeholder="0.00" className={inputClass}
                value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Descripción</label>
              <textarea placeholder="Descripción del producto..." className={inputClass + ' resize-none'} rows={3}
                value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">URL de imagen</label>
              <input type="text" placeholder="https://..." className={inputClass}
                value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Categoría</label>
              <select className={inputClass}
                value={form.CategoryId} onChange={e => setForm({ ...form, CategoryId: e.target.value })}>
                <option value="">Sin categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {editId ? 'Actualizar producto' : 'Crear producto'}
              </button>
              {editId && (
                <button
                  onClick={() => { setEditId(null); setForm({ nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '' }); }}
                  className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Productos ({products.length})</h2>
          <div className="overflow-y-auto max-h-[480px] -mx-1 px-1">
            {products.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No hay productos aún</div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-3 text-sm text-gray-900 font-medium">{p.nombre}</td>
                      <td className="py-3 pr-3 text-sm text-blue-600 font-semibold whitespace-nowrap">
                        S/. {p.precio}
                      </td>
                      <td className="py-3 flex gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-xs text-blue-600 font-medium hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs text-red-500 font-medium hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
