'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
        try {
            setUser(JSON.parse(userCookie));
        } catch {
            console.error('Error parsing user cookie');
        }
        }
    };
    
    checkUser();
    window.addEventListener('focus', checkUser);
    return () => window.removeEventListener('focus', checkUser);
    }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        🛒 Mini Marketplace
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:underline">Inicio</Link>
        {user?.rol === 'ADMIN' && (
          <Link href="/admin" className="hover:underline">Admin</Link>
        )}
        {user && (
          <span className="text-sm">Hola, {user.nombre} ({user.rol})</span>
        )}
        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}