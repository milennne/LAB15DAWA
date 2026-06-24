'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'CUSTOMER' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) return setError(data.message);
      router.push('/login');
    } catch {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900  ">Registro</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Nombre completo" className="border p-3 rounded text-gray-900 placeholder-gray-400"
            value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <input type="email" placeholder="Email" className="border p-3 rounded text-gray-900 placeholder-gray-400"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" className="border p-3 rounded text-gray-900 placeholder-gray-400"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <select className="border p-3 rounded text-gray-900 placeholder-gray-400" value={form.rol}
            onChange={e => setForm({ ...form, rol: e.target.value })}>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Registrarse
          </button>
        </form>
        <p className="text-center mt-4 text-gray-900">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}