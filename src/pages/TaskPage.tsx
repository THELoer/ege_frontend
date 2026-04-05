import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function TaskPage() {
  const { number } = useParams();

  return (
    <Layout>
      <Card>
        <h1 className="text-2xl font-bold mb-2">Задание №{number}</h1>

        <p className="text-gray-600 mb-6">
          1) Пройдите диагностику (3 задачи каждого типа) 2) изучите разбор слабых тем 3) закрепите в тренировке.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link to={`/tasks/${number}/diagnostic`}>
            <Button>Пройти диагностику</Button>
          </Link>

          <Link to={`/tasks/${number}/train`}>
            <Button variant="secondary">К обучению (материалы с сервера)</Button>
          </Link>

          <Link to={`/tasks/${number}/exam`}>
            <Button variant="secondary">Режим экзамена</Button>
          </Link>

          <Link to={`/tasks/${number}/exam`}>
            <Button variant="secondary">Режим экзамена</Button>
          </Link>
        </div>
      </Card>
    </Layout>
  );
}
