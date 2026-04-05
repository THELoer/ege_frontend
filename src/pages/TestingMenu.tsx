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
            <p className="text-slate-600 text-sm mb-4">3 задачи по типам для определения слабых мест.</p>
            <Link to={`/tasks/${number}/diagnostic`}>
              <Button className="w-full">Запустить</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="font-semibold text-lg mb-2">Мини-тест</h2>
            <p className="text-slate-600 text-sm mb-4">Короткий тренировочный тест по текущему номеру.</p>
            <Link to={`/tasks/${number}/exam`}>
              <Button className="w-full" variant="secondary">Открыть</Button>
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
