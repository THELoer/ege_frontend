import { useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import Formula from "../components/Formula";

const THEORY = {
  logarithmic: {
    title: "Логарифмические уравнения",
    theory: "log_a x = b ⇔ x = a^b",
    example: "log_2(x - 1) = 3",
    solution: "x - 1 = 2^3 ⇒ x = 9",
  },
};

type TheoryKey = keyof typeof THEORY;

export default function Train() {
  const [type, setType] = useState<TheoryKey>("logarithmic");
  const t = THEORY[type];

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          Обучение
        </h1>

        <div className="flex gap-4">
          <Button onClick={() => setType("logarithmic")}>
            Логарифмы
          </Button>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {t.title}
          </h2>

          <Formula value={t.theory} />

          <div className="mt-6">
            <p className="font-semibold mb-2">Пример:</p>
            <Formula value={t.example} />
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Решение:</p>
            <Formula value={t.solution} />
          </div>
        </Card>

        <Button variant="secondary">
          Решить задачу
        </Button>
      </div>
    </Layout>
  );
}
