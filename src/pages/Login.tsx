import { useAuth } from "../app/store";

export default function Login() {
  const setAuth = useAuth((s) => s.setAuth);

  return (
    <div className="p-6">
      <button
        onClick={() => setAuth("fake-token", "student")}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Войти (заглушка)
      </button>
    </div>
  );
}
