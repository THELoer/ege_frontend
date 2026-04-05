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
          Выбери режим: диагностика, обучение с материалами из backend или меню тестирования.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link to={`/tasks/${number}/diagnostic`}>
            <Button>Пройти диагностику</Button>
          </Link>

          <Link to={`/tasks/${number}/train`}>
            <Button variant="secondary">К обучению</Button>
          </Link>

          <Link to={`/tasks/${number}/testing`}>
            <Button variant="secondary">Меню тестирования</Button>
          </Link>
        </div>
      </Card>
    </Layout>
  );
}
