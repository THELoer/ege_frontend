import { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TaskStatement from "../../components/TaskStatement";
import type { TaskContentOrder } from "../../types/Task";
import { createTask as createTaskApi, listTasks, type AdminTaskListItem } from "../../api/admin";
import {
  PART_ONE_TASK_CATALOG,
  getCatalogItemByNumber,
  getDefaultTypeForNumber,
} from "../../constants/taskCatalog";

interface CreateTaskForm {
  number: string;
  type: string;
  text: string;
  contentOrder: TaskContentOrder;
  answer: string;
  solution: string;
}

const INITIAL_NUMBER = String(PART_ONE_TASK_CATALOG[0]?.number ?? 1);
const PAGE_SIZE = 10;

const INITIAL_CREATE_FORM: CreateTaskForm = {
  number: INITIAL_NUMBER,
  type: getDefaultTypeForNumber(Number(INITIAL_NUMBER)),
  text: "",
  contentOrder: "text-first",
  answer: "",
  solution: "",
};

const getTypeLabel = (number: number, type: string) => {
  const catalogItem = getCatalogItemByNumber(number);
  return catalogItem.subtypes?.find((sub) => sub.value === type)?.label ?? type;
};

export default function TasksAdmin() {
  const [createForm, setCreateForm] = useState<CreateTaskForm>(INITIAL_CREATE_FORM);
  const [taskImageFile, setTaskImageFile] = useState<File | null>(null);
  const [answerImageFile, setAnswerImageFile] = useState<File | null>(null);
  const [solutionImageFile, setSolutionImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [catalogNumber, setCatalogNumber] = useState(INITIAL_NUMBER);
  const [catalogType, setCatalogType] = useState(getDefaultTypeForNumber(Number(INITIAL_NUMBER)));
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogItems, setCatalogItems] = useState<AdminTaskListItem[]>([]);
  const [catalogTotal, setCatalogTotal] = useState(0);

  const selectedCreateCatalog = useMemo(() => getCatalogItemByNumber(Number(createForm.number)), [createForm.number]);
  const selectedCatalogFilter = useMemo(() => getCatalogItemByNumber(Number(catalogNumber)), [catalogNumber]);

  const taskImagePreviewUrl = useMemo(
    () => (taskImageFile ? URL.createObjectURL(taskImageFile) : ""),
    [taskImageFile]
  );

  useEffect(() => {
    return () => {
      if (taskImagePreviewUrl) {
        URL.revokeObjectURL(taskImagePreviewUrl);
      }
    };
  }, [taskImagePreviewUrl]);

  const createTaskTypeLabel = useMemo(() => {
    const subtypeLabel = selectedCreateCatalog.subtypes?.find((item) => item.value === createForm.type)?.label;
    return subtypeLabel ?? selectedCreateCatalog.title;
  }, [createForm.type, selectedCreateCatalog]);

  const createTypeOptions = useMemo(
    () =>
      selectedCreateCatalog.subtypes?.length
        ? selectedCreateCatalog.subtypes
        : [{ label: selectedCreateCatalog.title, value: getDefaultTypeForNumber(selectedCreateCatalog.number) }],
    [selectedCreateCatalog]
  );

  const catalogTypeOptions = useMemo(
    () =>
      selectedCatalogFilter.subtypes?.length
        ? selectedCatalogFilter.subtypes
        : [{ label: selectedCatalogFilter.title, value: getDefaultTypeForNumber(selectedCatalogFilter.number) }],
    [selectedCatalogFilter]
  );

  const canSubmitCreate = useMemo(() => {
    const hasTaskContent = createForm.text.trim().length > 0 || Boolean(taskImageFile);
    const hasAnswerContent = createForm.answer.trim().length > 0 || Boolean(answerImageFile);
    return hasTaskContent && hasAnswerContent;
  }, [answerImageFile, createForm.answer, createForm.text, taskImageFile]);

  const loadCatalog = async (page = catalogPage) => {
    setCatalogLoading(true);
    setCatalogError(null);

    try {
      const response = await listTasks({
        number: Number(catalogNumber),
        type: catalogType,
        page,
        pageSize: PAGE_SIZE,
      });
      setCatalogItems(response.data.items ?? []);
      setCatalogTotal(response.data.total ?? 0);
      setCatalogPage(response.data.page ?? page);
    } catch {
      setCatalogError("Не удалось загрузить каталог задач.");
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogNumber, catalogType]);

  const createTask = async () => {
    setPending(true);
    setStatus(null);

    try {
      await createTaskApi({
        number: Number(createForm.number),
        type: createForm.type,
        condition: createForm.text || null,
        contentOrder: createForm.contentOrder,
        answer: createForm.answer || null,
        solution: createForm.solution || null,
        taskImage: taskImageFile,
        answerImage: answerImageFile,
        solutionImage: solutionImageFile,
      });

      setStatus("Задача успешно добавлена.");
      setCreateForm((prev) => ({
        ...INITIAL_CREATE_FORM,
        number: prev.number,
        type: getDefaultTypeForNumber(Number(prev.number)),
      }));
      setTaskImageFile(null);
      setAnswerImageFile(null);
      setSolutionImageFile(null);
      void loadCatalog(1);
    } catch {
      setStatus("Ошибка при добавлении задачи.");
    } finally {
      setPending(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(catalogTotal / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-2">Добавить задачу вручную</h2>
        <p className="text-slate-600 mb-6">Выбери номер, подкатегорию и прикрепи изображения файлами.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Номер задания</span>
            <select
              className="input"
              value={createForm.number}
              onChange={(e) => {
                const nextNumber = e.target.value;
                setCreateForm((v) => ({ ...v, number: nextNumber, type: getDefaultTypeForNumber(Number(nextNumber)) }));
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
            <span className="text-sm text-slate-500">Подкатегория</span>
            <select
              className="input"
              value={createForm.type}
              onChange={(e) => setCreateForm((v) => ({ ...v, type: e.target.value }))}
            >
              {createTypeOptions.map((subtype) => (
                <option key={subtype.value} value={subtype.value}>
                  {subtype.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Раздел: <span className="font-medium text-slate-700">{selectedCreateCatalog.title}</span> · Подтип:{" "}
          <span className="font-medium text-slate-700">{createTaskTypeLabel}</span>
        </p>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Текст задачи (опционально, можно LaTeX)</span>
          <textarea
            className="input min-h-28"
            placeholder="Например: \\log_2(x-1)=3"
            value={createForm.text}
            onChange={(e) => setCreateForm((v) => ({ ...v, text: e.target.value }))}
          />
        </label>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Картинка условия (опционально)</span>
          <input type="file" accept="image/*" onChange={(e) => setTaskImageFile(e.target.files?.[0] ?? null)} />
        </label>

        <div className="mb-4">
          <span className="text-sm text-slate-500 block mb-2">Расположение текста и фото</span>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              className={`chip ${createForm.contentOrder === "image-first" ? "chip-active" : ""}`}
              onClick={() => setCreateForm((v) => ({ ...v, contentOrder: "image-first" }))}
            >
              Фото сверху, текст снизу
            </button>
            <button
              type="button"
              className={`chip ${createForm.contentOrder === "text-first" ? "chip-active" : ""}`}
              onClick={() => setCreateForm((v) => ({ ...v, contentOrder: "text-first" }))}
            >
              Текст сверху, фото снизу
            </button>
          </div>
        </div>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Ответ текстом (опционально, если прикрепляешь фото ответа)</span>
          <input
            className="input"
            value={createForm.answer}
            onChange={(e) => setCreateForm((v) => ({ ...v, answer: e.target.value }))}
          />
        </label>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Картинка ответа (опционально)</span>
          <input type="file" accept="image/*" onChange={(e) => setAnswerImageFile(e.target.files?.[0] ?? null)} />
        </label>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Решение текстом (опционально)</span>
          <textarea
            className="input min-h-24"
            value={createForm.solution}
            onChange={(e) => setCreateForm((v) => ({ ...v, solution: e.target.value }))}
          />
        </label>

        <label className="space-y-2 block mb-6">
          <span className="text-sm text-slate-500">Картинка решения (опционально)</span>
          <input type="file" accept="image/*" onChange={(e) => setSolutionImageFile(e.target.files?.[0] ?? null)} />
        </label>

        <Button disabled={!canSubmitCreate || pending} onClick={createTask}>
          {pending ? "Сохранение..." : "Добавить задачу"}
        </Button>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Превью отображения задачи</h3>
        <TaskStatement text={createForm.text} imageUrl={taskImagePreviewUrl} contentOrder={createForm.contentOrder} />
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Каталог задач</h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Фильтр по номеру</span>
            <select
              className="input"
              value={catalogNumber}
              onChange={(e) => {
                const nextNumber = e.target.value;
                setCatalogNumber(nextNumber);
                setCatalogType(getDefaultTypeForNumber(Number(nextNumber)));
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
            <select className="input" value={catalogType} onChange={(e) => setCatalogType(e.target.value)}>
              {catalogTypeOptions.map((subtype) => (
                <option key={subtype.value} value={subtype.value}>
                  {subtype.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {catalogLoading && <p className="text-slate-500">Загрузка каталога…</p>}
        {catalogError && <p className="text-red-500">{catalogError}</p>}

        {!catalogLoading && !catalogItems.length && !catalogError && (
          <p className="text-slate-500">По выбранным фильтрам задач пока нет.</p>
        )}

        <div className="space-y-4">
          {catalogItems.map((task) => (
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

              {(task.answer || task.answerImageUrl) && (
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Ответ:</span> {task.answer ?? "—"}
                  {task.answerImageUrl && (
                    <a className="ml-2 text-indigo-600" href={task.answerImageUrl} target="_blank" rel="noreferrer">
                      Открыть фото ответа
                    </a>
                  )}
                </div>
              )}

              {(task.solution || task.solutionImageUrl) && (
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Решение:</span> {task.solution ?? "—"}
                  {task.solutionImageUrl && (
                    <a className="ml-2 text-indigo-600" href={task.solutionImageUrl} target="_blank" rel="noreferrer">
                      Открыть фото решения
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Страница {catalogPage} из {totalPages} · Всего задач: {catalogTotal}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={catalogPage <= 1 || catalogLoading} onClick={() => void loadCatalog(catalogPage - 1)}>
              Назад
            </Button>
            <Button
              variant="secondary"
              disabled={catalogPage >= totalPages || catalogLoading}
              onClick={() => void loadCatalog(catalogPage + 1)}
            >
              Вперёд
            </Button>
          </div>
        </div>
      </Card>

      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  );
}
