import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import Formula from "../components/Formula";
import type { TaskType, DiagnosticSubmitResponse } from "../types/Task";

const THEORY: Record<
  TaskType,
  {
    title: string;
    theory: string;
    example: string;
    solution: string;
  }
> = {
  logarithmic: {
    title: "Логарифмические уравнения",
    theory: "\\log_a x = b \\Leftrightarrow x = a^b",
    example: "\\log_2(x - 1) = 3",
    solution: "x - 1 = 2^3 \\Rightarrow x = 9",
  },
  trigonometric: {
    title: "Тригонометрические уравнения",
    theory: "\\sin x = a \\Rightarrow x = (-1)^k\\arcsin(a)+\\pi k",
    example: "\\sin x = \\frac{1}{2}",
    solution: "x = \\frac{\\pi}{6} + 2\\pi k \\; \\text{или} \\; x = \\frac{5\\pi}{6} + 2\\pi k",
  },
  exponential: {
    title: "Показательные уравнения",
    theory: "a^{f(x)} = a^{g(x)} \\Rightarrow f(x)=g(x), \\; a>0, a \\neq 1",
    example: "3^{2x-1}=3^5",
    solution: "2x-1=5 \\Rightarrow x=3",
  },
  rational: {
    title: "Рациональные уравнения",
    theory: "\\frac{P(x)}{Q(x)}=0 \\Rightarrow P(x)=0,\\; Q(x)\\neq 0",
    example: "\\frac{x^2-9}{x-3}=0",
    solution: "x^2-9=0 \\Rightarrow x=\\pm 3, \\; x\\neq 3 \\Rightarrow x=-3",
  },
};

export default function Train() {
  const { number } = useParams();
  const [type, setType] = useState<TaskType>("logarithmic");

  const resultRaw = localStorage.getItem(`diagnostic-result-${number}`);
  const result = resultRaw ? (JSON.parse(resultRaw) as DiagnosticSubmitResponse) : null;

  const recommended = useMemo(() => result?.weakTypes ?? [], [result]);
  const current = THEORY[type];

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Обучение по заданию №{number}</h1>

        <Card>
          <h2 className="text-xl font-semibold mb-2">Персональные рекомендации</h2>
          <p className="text-slate-600">
            {recommended.length > 0
              ? `Начните с тем: ${recommended.join(", ")}.`
              : "Сначала пройдите диагностику, чтобы получить персональный план."}
          </p>
        </Card>

        <div className="flex gap-3 flex-wrap">
          {(Object.keys(THEORY) as TaskType[]).map((key) => (
            <button key={key} className={`chip ${type === key ? "chip-active" : ""}`} onClick={() => setType(key)}>
              {THEORY[key].title}
            </button>
          ))}
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{current.title}</h2>
          <Formula value={current.theory} />

          <div className="mt-6">
            <p className="font-semibold mb-2">Пример:</p>
            <Formula value={current.example} />
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Решение:</p>
            <Formula value={current.solution} />
          </div>
        </Card>

        <Button variant="secondary">Открыть тренировочный набор по теме</Button>
      </div>
    </Layout>
  );
}
