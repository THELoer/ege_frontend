import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import TaskStatement from "../components/TaskStatement";
import { startDiagnostic, submitDiagnostic } from "../api/diagnostic";
import type { DiagnosticTask, TaskType } from "../types/Task";

const TYPE_LABELS: Record<TaskType, string> = {
  trigonometric: "Тригонометрия",
  logarithmic: "Логарифмы",
  exponential: "Показательные",
  rational: "Рациональные",
};

export default function Diagnostic() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<DiagnosticTask[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    startDiagnostic(Number(number))
      .then((res) => {
        setTitle(res.data.title);
        setTasks(res.data.tasks);
      })
      .finally(() => setLoading(false));
  }, [number]);

  const grouped = useMemo(
    () =>
      tasks.reduce<Record<string, DiagnosticTask[]>>((acc, task) => {
        acc[task.type] = [...(acc[task.type] ?? []), task];
        return acc;
      }, {}),
    [tasks]
  );

  const onSubmit = async () => {
    setSending(true);

    try {
      const response = await submitDiagnostic({
        taskNumber: Number(number),
        answers: tasks.map((task) => ({
          taskId: task.id,
          answer: answers[task.id] || null,
        })),
      });

      localStorage.setItem(`diagnostic-result-${number}`, JSON.stringify(response.data));
      navigate(`/tasks/${number}/diagnostic/result`, { state: response.data });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-slate-500">Загрузка диагностики…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Диагностика · Задание №{number}</h1>
          <p className="text-slate-500 mt-2">{title || "Решите 3 задачи каждого типа, чтобы выявить слабые темы."}</p>
        </div>

        {Object.entries(grouped).map(([type, typeTasks]) => (
          <section key={type} className="space-y-4">
            <h2 className="text-xl font-semibold">{TYPE_LABELS[type as TaskType]}</h2>
            <div className="grid gap-4">
              {typeTasks.map((task, i) => (
                <div key={task.id} className="card">
                  <div className="text-sm text-slate-400 mb-2">Задача {i + 1}</div>
                  <Formula value={task.condition} />
                  <input
                    className="input mt-6"
                    placeholder="Введите ответ"
                    value={answers[task.id] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [task.id]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        <Button onClick={onSubmit} disabled={sending}>
          {sending ? "Отправка..." : "Завершить диагностику"}
        </Button>
      </div>
    </Layout>
  );
}
