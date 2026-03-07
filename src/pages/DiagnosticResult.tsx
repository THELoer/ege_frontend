import { useLocation, useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

const LABELS: Record<string, string> = {
  trigonometric: "Тригонометрия",
  logarithmic: "Логарифмы",
  exponential: "Показательные",
  rational: "Рациональные",
};

export default function DiagnosticResult() {
  const { state } = useLocation() as any;
  const { number } = useParams();

  if (!state) {
    return (
      <Layout>
        <p className="text-slate-500">
          Нет данных диагностики
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10">
        <h1 className="text-3xl font-bold">
          Результаты диагностики
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(state.summary).map(([type, score]: any) => {
            const percent = Math.round((score / state.max) * 100);

            return (
              <Card key={type}>
                <h3 className="font-semibold mb-2">
                  {LABELS[type]}
                </h3>

                <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      percent >= 70
                        ? "bg-green-500"
                        : percent >= 40
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-sm text-slate-600">
                  {score} из {state.max} ({percent}%)
                </p>
              </Card>
            );
          })}
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Рекомендации
          </h2>

          <p className="text-slate-600 mb-6">
            Начни обучение с тем, где результат ниже 70%.
          </p>

          <Link to={`/tasks/${number}/train`}>
            <Button>Перейти к обучению</Button>
          </Link>
        </Card>
      </div>
    </Layout>
  );
}
