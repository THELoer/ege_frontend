import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import TaskStatement from "../components/TaskStatement";
import { listTaskCatalog, type CatalogTaskItem } from "../api/study";
import { resolveImageUrl } from "../utils/image";

const PAGE_SIZE = 100;

function normalizeAnswer(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/\s+/g, "");
}

function getConditionText(task: CatalogTaskItem) {
  const extendedTask = task as CatalogTaskItem & { conditionText?: string | null; text?: string | null };
  return task.condition ?? extendedTask.conditionText ?? extendedTask.text ?? undefined;
}

export default function ErrorPractice() {
  const { number } = useParams();
  const taskNumber = Number(number);

  const [tasks, setTasks] = useState<CatalogTaskItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTaskCatalog({ number: taskNumber, page: 1, pageSize: PAGE_SIZE })
      .then((res) => {
        const items = (res.data.items ?? []).filter((item) => item.answer?.trim() || item.answerImageUrl?.trim());
        setTasks(items);
        setCurrentIndex(0);
        setUserAnswer("");
        setSubmitted(false);
        setError(null);
      })
      .catch(() => setError("Не удалось загрузить задания для отработки."))
      .finally(() => setLoading(false));
  }, [taskNumber]);

  const currentTask = tasks[currentIndex];
  const isLastTask = currentIndex >= tasks.length - 1;

  const isCorrect = useMemo(() => {
    if (!submitted || !currentTask) return false;
    return normalizeAnswer(userAnswer) === normalizeAnswer(currentTask.answer);
  }, [submitted, currentTask, userAnswer]);

  const onSubmit = () => {
    setSubmitted(true);
  };

  const onNextTask = () => {
    if (isLastTask) return;
    setCurrentIndex((prev) => prev + 1);
    setUserAnswer("");
    setSubmitted(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Отработка ошибок · Задание №{number}</h1>
            <p className="text-slate-500 mt-2">
              Решай задания по одному: после ответа увидишь правильный ответ и решение.
            </p>
          </div>
          <Link to={`/tasks/${number}/testing`}>
            <Button variant="secondary">Назад в меню тестирования</Button>
          </Link>
        </div>

        {loading && <Card>Загрузка заданий…</Card>}
        {!loading && error && <Card>{error}</Card>}

        {!loading && !error && tasks.length === 0 && (
          <Card>
            <p className="text-slate-600">
              Для этого номера пока нет задач с правильными ответами. Добавь задачи в каталог, чтобы включить режим
              отработки.
            </p>
          </Card>
        )}

        {!loading && !error && currentTask && (
          <Card>
            <div className="text-sm text-slate-400 mb-2">
              Задача {currentIndex + 1} из {tasks.length}
            </div>

            <TaskStatement
              text={getConditionText(currentTask)}
              imageUrl={currentTask.imageUrl ?? undefined}
              contentOrder={currentTask.contentOrder ?? "text-first"}
            />

            <label className="space-y-2 block mt-6">
              <span className="text-sm text-slate-500">Твой ответ</span>
              <input
                className="input"
                placeholder="Введите ответ"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={submitted}
              />
            </label>

            {!submitted && (
              <div className="mt-4">
                <Button disabled={!userAnswer.trim()} onClick={onSubmit}>
                  Проверить
                </Button>
              </div>
            )}

            {submitted && (
              <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className={`font-semibold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                  {isCorrect ? "Верно! Отличная работа." : "Есть ошибка. Разберём решение."}
                </p>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Правильный ответ</p>
                  <p className="font-medium text-slate-800">{currentTask.answer || "Ответ доступен в изображении ниже."}</p>
                  {currentTask.answerImageUrl && (
                    <img
                      src={resolveImageUrl(currentTask.answerImageUrl)}
                      alt="Правильный ответ"
                      className="mt-2 max-h-[320px] w-full rounded-xl border border-slate-200 object-contain bg-white"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Решение</p>
                  <TaskStatement
                    text={currentTask.solution ?? "Решение не добавлено."}
                    imageUrl={currentTask.solutionImageUrl ?? undefined}
                    contentOrder="text-first"
                  />
                </div>

                {!isLastTask ? (
                  <Button onClick={onNextTask}>Следующая задача</Button>
                ) : (
                  <div className="space-y-3">
                    <p className="font-medium text-slate-700">Ты прошёл все доступные задачи в этом режиме.</p>
                    <Link to={`/tasks/${number}/testing`}>
                      <Button variant="secondary">Вернуться в меню тестирования</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
}
