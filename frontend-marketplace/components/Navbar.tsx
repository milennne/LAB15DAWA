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
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
            🛒 <span>Mini Marketplace</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
              Inicio
            </Link>
            {user?.rol === 'ADMIN' && (
              <Link href="/admin" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
                Admin
              </Link>
            )}
            {user && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                {user.nombre}
                <span className="opacity-60">· {user.rol}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
