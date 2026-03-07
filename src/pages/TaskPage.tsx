import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function TaskPage() {
  const { number } = useParams();

  return (
    <Layout>
      <Card>
        <h1 className="text-2xl font-bold mb-2">
          Задание №{number}
        </h1>

        <p className="text-gray-600 mb-6">
          Сначала пройди диагностику — мы определим твои слабые места.
        </p>

        <div className="flex gap-4">
          <Link to={`/tasks/${number}/diagnostic`}>
            <Button>Пройти диагностику</Button>
          </Link>

          <Link to={`/tasks/${number}/train`}>
            <Button variant="secondary">К обучению</Button>
          </Link>
        </div>
      </Card>
    </Layout>
  );
}
