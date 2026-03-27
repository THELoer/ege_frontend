import Layout from "../components/Layout";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../app/store";

export default function Home() {
  const { token } = useAuth();

  return (
    <Layout>
      <div className="space-y-16">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-10 py-16 text-white">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">Подготовка к ЕГЭ по математике</h1>
            <p className="text-lg text-indigo-100 mb-3">
              При первом входе в номер задания ты проходишь входную диагностику: 3 задачи каждого типа.
            </p>
            <p className="text-lg text-indigo-100 mb-10">
              После этого строится персональный маршрут: теория, тренировки и имитация экзамена.
            </p>

            <Link
              to={token ? "/tasks/1" : "/login"}
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-700 shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-indigo-50"
            >
              🚀 {token ? "Перейти к заданиям" : "Создать аккаунт и начать"}
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8">Номера заданий ЕГЭ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, idx) => idx + 1).map((n) => (
              <Link key={n} to={`/tasks/${n}`}>
                <Card>
                  <div className="text-center text-2xl font-bold text-indigo-600">№{n}</div>
                  <p className="mt-2 text-sm text-slate-500 text-center">Диагностика + обучение + тренировка</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
