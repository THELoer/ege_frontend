import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function TestingMenu() {
  const { number } = useParams();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Меню тестирования · Задание №{number}</h1>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <h2 className="font-semibold text-lg mb-2">Диагностика</h2>
            <p className="text-slate-600 text-sm mb-4">
              3 задачи по типам для определения слабых мест и построения плана тренировки.
            </p>
            <Link to={`/tasks/${number}/diagnostic`}>
              <Button className="w-full">Запустить</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="font-semibold text-lg mb-2">Отработка ошибок</h2>
            <p className="text-slate-600 text-sm mb-4">
              Поштучный режим: решай задачу, сразу смотри правильный ответ и подробное решение.
            </p>
            <Link to={`/tasks/${number}/practice-errors`}>
              <Button className="w-full" variant="secondary">Начать</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="font-semibold text-lg mb-2">Итоговый тест</h2>
            <p className="text-slate-600 text-sm mb-4">Режим экзамена с таймером и итоговой оценкой.</p>
            <Link to={`/tasks/${number}/exam`}>
              <Button className="w-full" variant="secondary">Открыть</Button>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
