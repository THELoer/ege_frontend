import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import TaskStatement from "../components/TaskStatement";
import { getTrainingMaterials, listCheatSheets, type CheatSheet, type StudyMaterial } from "../api/study";

export default function Train() {
  const { number } = useParams();
  const taskNumber = Number(number);

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([]);
  const [openCheatId, setOpenCheatId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTrainingMaterials(taskNumber), listCheatSheets(taskNumber)])
      .then(([materialsRes, cheatsRes]) => {
        setMaterials(materialsRes.data ?? []);
        setCheatSheets(cheatsRes.data ?? []);
        setError(null);
      })
      .catch(() => setError("Не удалось загрузить материалы обучения. Проверь backend-эндпоинты."))
      .finally(() => setLoaded(true));
  }, [taskNumber]);

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Обучение по заданию №{number}</h1>

        <Card>
          <h2 className="text-xl font-semibold mb-3">Материалы от backend</h2>
          {!loaded && <p className="text-slate-500">Загрузка материалов…</p>}
          {error && <p className="text-red-500">{error}</p>}

          {loaded && !error && materials.length === 0 && (
            <p className="text-slate-500">Пока нет материалов для этого задания.</p>
          )}

          {loaded && !error && materials.length > 0 && (
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <h3 className="font-semibold text-lg">{material.title}</h3>
                  {material.description && <p className="text-slate-600 mt-1">{material.description}</p>}
                  <div className="mt-3">
                    <TaskStatement text={material.content} imageUrl={material.imageUrl} contentOrder="text-first" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-3">Шпаргалки</h2>
          {loaded && !error && cheatSheets.length === 0 && (
            <p className="text-slate-500">Для этого задания пока нет шпаргалок.</p>
          )}

          <div className="space-y-3">
            {cheatSheets.map((sheet) => {
              const isOpen = openCheatId === sheet.id;
              return (
                <div key={sheet.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 font-medium hover:bg-slate-50"
                    onClick={() => setOpenCheatId(isOpen ? null : sheet.id)}
                  >
                    {sheet.title}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4">
                      <TaskStatement text={sheet.content} imageUrl={sheet.imageUrl} contentOrder="text-first" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
