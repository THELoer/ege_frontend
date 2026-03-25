import { useMemo, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TaskStatement from "../../components/TaskStatement";
import type { TaskContentOrder, TaskType } from "../../types/Task";

const TASK_TYPES: TaskType[] = ["logarithmic", "trigonometric", "exponential", "rational"];

interface CreateTaskForm {
  number: string;
  part: "1" | "2";
  type: TaskType;
  text: string;
  imageUrl: string;
  contentOrder: TaskContentOrder;
  answer: string;
  solution: string;
}

const INITIAL_CREATE_FORM: CreateTaskForm = {
  number: "1",
  part: "1",
  type: "logarithmic",
  text: "",
  imageUrl: "",
  contentOrder: "text-first",
  answer: "",
  solution: "",
};

export default function TasksAdmin() {
  const [uploadNumber, setUploadNumber] = useState("13");
  const [uploadType, setUploadType] = useState<TaskType>("logarithmic");
  const [uploadPart, setUploadPart] = useState<"1" | "2">("1");
  const [createForm, setCreateForm] = useState<CreateTaskForm>(INITIAL_CREATE_FORM);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmitCreate = useMemo(() => {
    const hasText = createForm.text.trim().length > 0;
    const hasImage = createForm.imageUrl.trim().length > 0;
    return (hasText || hasImage) && createForm.answer.trim().length > 0;
  }, [createForm]);

  const upload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("number", uploadNumber);
    form.append("type", uploadType);
    form.append("part", uploadPart);

    setPending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/tasks/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      setStatus("JSON-файл успешно загружен.");
    } catch {
      setStatus("Ошибка загрузки JSON-файла.");
    } finally {
      setPending(false);
    }
  };

  const createTask = async () => {
    setPending(true);
    setStatus(null);

    try {
      const payload = {
        number: Number(createForm.number),
        part: Number(createForm.part),
        type: createForm.type,
        condition: createForm.text || null,
        imageUrl: createForm.imageUrl || null,
        contentOrder: createForm.contentOrder,
        answer: createForm.answer,
        solution: createForm.solution || null,
      };

      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Create failed");
      setStatus("Задача успешно добавлена.");
      setCreateForm(INITIAL_CREATE_FORM);
    } catch {
      setStatus("Ошибка при добавлении задачи.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-2">1) Массовая загрузка JSON</h2>
        <p className="text-slate-600 mb-6">Используйте, если добавляете много задач сразу из подготовленного файла.</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Номер задания</span>
            <input className="input" value={uploadNumber} onChange={(e) => setUploadNumber(e.target.value)} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Тип</span>
            <select className="input" value={uploadType} onChange={(e) => setUploadType(e.target.value as TaskType)}>
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Часть</span>
            <select className="input" value={uploadPart} onChange={(e) => setUploadPart(e.target.value as "1" | "2") }>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </label>
        </div>

        <input type="file" accept=".json" onChange={(e) => e.target.files && upload(e.target.files[0])} />
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-2">2) Добавить задачу вручную</h2>
        <p className="text-slate-600 mb-6">
          Для задач 1-12: можно добавить только текст, только фото или оба блока. Обязательно укажите ответ.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Номер задания</span>
            <input
              className="input"
              value={createForm.number}
              onChange={(e) => setCreateForm((v) => ({ ...v, number: e.target.value }))}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Часть</span>
            <select
              className="input"
              value={createForm.part}
              onChange={(e) => setCreateForm((v) => ({ ...v, part: e.target.value as "1" | "2" }))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Тип</span>
            <select
              className="input"
              value={createForm.type}
              onChange={(e) => setCreateForm((v) => ({ ...v, type: e.target.value as TaskType }))}
            >
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Текст задачи (можно LaTeX для степеней/корней/логарифмов)</span>
          <textarea
            className="input min-h-28"
            placeholder="Например: \\log_2(x-1)=3"
            value={createForm.text}
            onChange={(e) => setCreateForm((v) => ({ ...v, text: e.target.value }))}
          />
        </label>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Ссылка на фото задачи</span>
          <input
            className="input"
            placeholder="https://..."
            value={createForm.imageUrl}
            onChange={(e) => setCreateForm((v) => ({ ...v, imageUrl: e.target.value }))}
          />
        </label>

        <div className="mb-4">
          <span className="text-sm text-slate-500 block mb-2">Расположение текста и фото</span>
          <div className="flex gap-3 flex-wrap">
            <button
              className={`chip ${createForm.contentOrder === "image-first" ? "chip-active" : ""}`}
              onClick={() => setCreateForm((v) => ({ ...v, contentOrder: "image-first" }))}
            >
              Фото сверху, текст снизу
            </button>
            <button
              className={`chip ${createForm.contentOrder === "text-first" ? "chip-active" : ""}`}
              onClick={() => setCreateForm((v) => ({ ...v, contentOrder: "text-first" }))}
            >
              Текст сверху, фото снизу
            </button>
          </div>
        </div>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Ответ (обязательно)</span>
          <input
            className="input"
            value={createForm.answer}
            onChange={(e) => setCreateForm((v) => ({ ...v, answer: e.target.value }))}
          />
        </label>

        <label className="space-y-2 block mb-6">
          <span className="text-sm text-slate-500">Решение (опционально)</span>
          <textarea
            className="input min-h-24"
            value={createForm.solution}
            onChange={(e) => setCreateForm((v) => ({ ...v, solution: e.target.value }))}
          />
        </label>

        <Button disabled={!canSubmitCreate || pending} onClick={createTask}>
          {pending ? "Сохранение..." : "Добавить задачу"}
        </Button>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Превью отображения задачи</h3>
        <TaskStatement
          text={createForm.text}
          imageUrl={createForm.imageUrl}
          contentOrder={createForm.contentOrder}
        />
      </Card>

      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  );
}
