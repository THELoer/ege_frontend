import { Link } from "react-router-dom";
import { useAuth } from "../app/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          >
            ЕГЭ · Математика
          </Link>

          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-red-500 transition"
          >
            Выйти
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  );
}
