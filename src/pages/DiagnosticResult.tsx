import { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import type { DiagnosticSubmitResponse, TaskType } from "../types/Task";

const LABELS: Record<TaskType, string> = {
  trigonometric: "Тригонометрия",
  logarithmic: "Логарифмы",
  exponential: "Показательные",
  rational: "Рациональные",
};

export default function DiagnosticResult() {
  const location = useLocation() as { state?: DiagnosticSubmitResponse };
  const { number } = useParams();
  const localResult = localStorage.getItem(`diagnostic-result-${number}`);
  const state = (location.state ?? (localResult ? JSON.parse(localResult) : null)) as DiagnosticSubmitResponse | null;
  const [selfScore, setSelfScore] = useState<Record<string, 0 | 1>>({});

  const partTwoTotal = state?.partTwo?.length
    ? state.partTwo.reduce((acc, item) => acc + (selfScore[item.taskId] ?? 0), 0)
    : 0;

  if (!state) {
    return (
      <Layout>
        <p className="text-slate-500">Нет данных диагностики</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10">
        <h1 className="text-3xl font-bold">Результаты диагностики</h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(state.summary).map(([type, score]: [string, number]) => {
            const percent = Math.round((score / state.maxByType) * 100);

            return (
              <Card key={type}>
                <h3 className="font-semibold mb-2">{LABELS[type as TaskType]}</h3>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      percent >= 70 ? "bg-green-500" : percent >= 40 ? "bg-yellow-400" : "bg-red-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  {score} из {state.maxByType} ({percent}%)
                </p>
              </Card>
            );
          })}
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-2">Часть 1 (автопроверка)</h2>
          <p className="text-slate-600">
            Набрано {state.partOne.scored} из {state.partOne.total}.
          </p>
        </Card>

        {state.partTwo.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Часть 2 (самооценка по полному решению)</h2>
            <div className="space-y-4">
              {state.partTwo.map((task: DiagnosticSubmitResponse["partTwo"][number]) => (
                <div key={task.taskId} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium mb-2">Задача:</p>
                  <p className="text-slate-600 mb-3">{task.condition}</p>
                  <p className="font-medium mb-2">Решение:</p>
                  <p className="text-slate-600 mb-3 whitespace-pre-wrap">{task.solution}</p>

                  <div className="flex items-center gap-3">
                    <button className={`chip ${selfScore[task.taskId] === 1 ? "chip-active" : ""}`} onClick={() => setSelfScore((v) => ({ ...v, [task.taskId]: 1 }))}>
                      Решил верно
                    </button>
                    <button className={`chip ${selfScore[task.taskId] === 0 ? "chip-active" : ""}`} onClick={() => setSelfScore((v) => ({ ...v, [task.taskId]: 0 }))}>
                      Нужна доработка
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-slate-600">
              Самооценка части 2: {partTwoTotal} из {state.partTwo.length}
            </p>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-semibold mb-4">Рекомендации</h2>
          <p className="text-slate-600 mb-4">
            Сначала проработай: {state.weakTypes.map((type: TaskType) => LABELS[type]).join(", ") || "сильные темы, затем переходи к экзамену"}.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link to={`/tasks/${number}/train`}>
              <Button>Перейти к обучению</Button>
            </Link>
            <Link to={`/tasks/${number}/exam`}>
              <Button variant="secondary">Перейти к экзамену</Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
