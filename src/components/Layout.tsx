import { Link } from "react-router-dom";
import { useAuth } from "../app/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout, token, role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-6">
          <Link
            to="/"
            className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          >
            ЕГЭ · Математика
          </Link>

          <div className="flex items-center gap-4 text-sm">
            {token && (
              <Link to="/profile" className="text-indigo-600 hover:text-indigo-700">
                Профиль
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin/tasks" className="text-indigo-600 hover:text-indigo-700">
                Админ-панель
              </Link>
            )}
            {token ? (
              <button onClick={logout} className="text-slate-600 hover:text-red-500 transition">
                Выйти
              </button>
            ) : (
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">{children}</main>
    </div>
  );
}
