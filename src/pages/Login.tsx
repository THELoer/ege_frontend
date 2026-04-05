import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../app/store";
import { login, register } from "../api/auth";

export default function Login() {
  const setAuth = useAuth((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response =
        mode === "login"
          ? await login(form.email, form.password)
          : await register({ email: form.email, password: form.password, name: form.name });

      setAuth({
        token: response.data.token,
        role: response.data.role,
        email: response.data.user.email,
        name: response.data.user.name,
      });

      navigate(location.state?.from ?? "/", { replace: true });
    } catch {
      setError("Не удалось выполнить вход. Проверьте данные и попробуйте снова.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-2">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-slate-500 mb-6">
            После входа вы сможете пройти диагностику и сохранить прогресс по заданиям.
          </p>

          <div className="flex gap-2 mb-6 rounded-xl bg-slate-100 p-1">
            <button className={`tab ${mode === "login" ? "tab-active" : ""}`} onClick={() => setMode("login")}>
              Вход
            </button>
            <button className={`tab ${mode === "register" ? "tab-active" : ""}`} onClick={() => setMode("register")}>
              Регистрация
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "register" && (
              <input
                className="input"
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            )}

            <input
              className="input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Отправка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </Button>
          </form>

          <p className="text-xs text-slate-500 mt-4">
            Для доступа к админ-разделу аккаунт должен иметь роль admin.
          </p>
          <Link to="/" className="text-sm text-indigo-600 mt-3 inline-block">
            Вернуться на главную
          </Link>
        </Card>
      </div>
    </Layout>
  );
}
