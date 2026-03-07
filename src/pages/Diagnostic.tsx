import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Formula from "../components/Formula";
import { startDiagnostic, submitDiagnostic } from "../api/diagnostic";
import type { Task } from "../types/Task";

export default function Diagnostic() {
  const { number } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startDiagnostic(Number(number)).then((res) => {
      setTasks(res.data);
      setLoading(false);
    });
  }, [number]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-slate-500">
          Загрузка диагностики…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {tasks.map((task, i) => (
          <div key={task.id} className="card">
            <div className="text-sm text-slate-400 mb-2">
              Задание {i + 1}
            </div>

            <Formula value={task.condition} />

            <input
              className="input mt-6"
              placeholder="Введите ответ"
              onChange={(e) =>
                setAnswers({ ...answers, [task.id]: e.target.value })
              }
            />
          </div>
        ))}

        <Button
          onClick={() =>
            submitDiagnostic(
              tasks.map((t) => ({
                taskId: t.id,
                answer: answers[t.id] ?? null,
              }))
            )
          }
        >
          Завершить диагностику
        </Button>
      </div>
    </Layout>
  );
}

