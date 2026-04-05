import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Exam() {
  const { number } = useParams();

  return (
    <Layout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Режим экзамена · задание №{number}</h1>
        <p className="text-slate-600 mb-2">
          Здесь ученик решает смешанный набор задач без подсказок и получает итоговый результат.
        </p>
        <p className="text-slate-600">Фронтенд готов к подключению backend-эндпоинтов генерации и проверки попыток.</p>
      </Card>
    </Layout>
  );
}
