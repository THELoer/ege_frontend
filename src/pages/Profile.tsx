import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { getMyStats, type TaskStat } from "../api/stats";

function getPercent(stat: TaskStat) {
  const total = stat.correct + stat.incorrect;
  if (!total) return 0;
  return Math.round((stat.correct / total) * 100);
}

function getColor(percent: number) {
  if (percent === 0) return "bg-slate-300";
  if (percent <= 49) return "bg-rose-500";
  if (percent <= 79) return "bg-amber-400";
  return "bg-emerald-500";
}

const DEFAULT_STATS: TaskStat[] = Array.from({ length: 12 }, (_, idx) => ({
  taskNumber: idx + 1,
  correct: 0,
  incorrect: 0,
}));

export default function Profile() {
  const [stats, setStats] = useState<TaskStat[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyStats()
      .then((res) => {
        const incoming = res.data.tasks ?? [];
        const map = new Map(incoming.map((item) => [item.taskNumber, item]));
        const merged = DEFAULT_STATS.map((fallback) => map.get(fallback.taskNumber) ?? fallback);
        setStats(merged);
      })
      .catch(() => {
        setError("Не удалось загрузить статистику. Показаны нулевые значения.");
        setStats(DEFAULT_STATS);
      })
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...stats].sort((a, b) => a.taskNumber - b.taskNumber),
    [stats]
  );

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Профиль и статистика</h1>

        <Card>
          {loading && <p className="text-slate-500">Загрузка статистики…</p>}
          {error && <p className="text-amber-600">{error}</p>}

          {!loading && (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-[760px] flex items-end gap-4 h-80 pb-2">
                  {sorted.map((item) => {
                    const percent = getPercent(item);
                    return (
                      <div key={item.taskNumber} className="flex flex-col items-center gap-2 w-14">
                        <div className="text-xs text-slate-600 font-semibold">{percent}%</div>
                        <div className="h-56 w-6 rounded-md bg-slate-100 border border-slate-200 flex items-end overflow-hidden">
                          <div
                            className={`w-full ${getColor(percent)} transition-all`}
                            style={{ height: `${percent}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-700">№{item.taskNumber}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <p>0% — серый, 1–49% — красный, 50–79% — жёлтый, 80–100% — зелёный.</p>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-[520px] text-sm w-full">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2">Задание</th>
                      <th className="py-2">Верно</th>
                      <th className="py-2">Неверно</th>
                      <th className="py-2">Процент</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((item) => {
                      const percent = getPercent(item);
                      return (
                        <tr key={item.taskNumber} className="border-b border-slate-100">
                          <td className="py-2">№{item.taskNumber}</td>
                          <td className="py-2">{item.correct}</td>
                          <td className="py-2">{item.incorrect}</td>
                          <td className="py-2">{percent}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
