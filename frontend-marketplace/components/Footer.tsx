export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-blue-600 font-bold text-sm">🛒 Mini Marketplace</span>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Mini Marketplace. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
