import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import TaskStatement from "../components/TaskStatement";
import { listTaskCatalog, type CatalogTaskItem } from "../api/study";
import { PART_ONE_TASK_CATALOG, getCatalogItemByNumber, getDefaultTypeForNumber } from "../constants/taskCatalog";

const PAGE_SIZE = 10;
const INITIAL_NUMBER = String(PART_ONE_TASK_CATALOG[0]?.number ?? 1);

const getTypeLabel = (number: number, type: string) => {
  const catalogItem = getCatalogItemByNumber(number);
  return catalogItem.subtypes?.find((sub) => sub.value === type)?.label ?? type;
};

export default function Catalog() {
  const [number, setNumber] = useState(INITIAL_NUMBER);
  const [type, setType] = useState(getDefaultTypeForNumber(Number(INITIAL_NUMBER)));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CatalogTaskItem[]>([]);
  const [total, setTotal] = useState(0);

  const selectedFilter = useMemo(() => getCatalogItemByNumber(Number(number)), [number]);
  const typeOptions = useMemo(
    () =>
      selectedFilter.subtypes?.length
        ? selectedFilter.subtypes
        : [{ label: selectedFilter.title, value: getDefaultTypeForNumber(selectedFilter.number) }],
    [selectedFilter]
  );

  const loadCatalog = async (nextPage = page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listTaskCatalog({
        number: Number(number),
        type,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });

      setItems(response.data.items ?? []);
      setTotal(response.data.total ?? 0);
      setPage(response.data.page ?? nextPage);
    } catch {
      setError("Не удалось загрузить каталог задач.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number, type]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Каталог задач</h1>

        <Card>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label className="space-y-2">
              <span className="text-sm text-slate-500">Фильтр по номеру</span>
              <select
                className="input"
                value={number}
                onChange={(e) => {
                  const nextNumber = e.target.value;
                  setNumber(nextNumber);
                  setType(getDefaultTypeForNumber(Number(nextNumber)));
                }}
              >
                {PART_ONE_TASK_CATALOG.map((item) => (
                  <option key={item.number} value={item.number}>
                    {item.number}. {item.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm text-slate-500">Фильтр по подкатегории</span>
              <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                {typeOptions.map((subtype) => (
                  <option key={subtype.value} value={subtype.value}>
                    {subtype.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading && <p className="text-slate-500">Загрузка каталога…</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && !items.length && (
            <p className="text-slate-500">По выбранным фильтрам задач пока нет.</p>
          )}

          <div className="space-y-4">
            {items.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-slate-500">ID: {task.id}</div>
                  <div className="text-sm text-slate-700 font-medium">
                    №{task.number} · {getTypeLabel(task.number, task.type)}
                  </div>
                </div>

                <TaskStatement
                  text={task.condition ?? undefined}
                  imageUrl={task.imageUrl ?? undefined}
                  contentOrder={task.contentOrder ?? "text-first"}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Страница {page} из {totalPages} · Всего задач: {total}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1 || loading} onClick={() => void loadCatalog(page - 1)}>
                Назад
              </Button>
              <Button variant="secondary" disabled={page >= totalPages || loading} onClick={() => void loadCatalog(page + 1)}>
                Вперёд
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
