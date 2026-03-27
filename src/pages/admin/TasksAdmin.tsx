import { useMemo, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TaskStatement from "../../components/TaskStatement";
import type { TaskContentOrder, TaskType } from "../../types/Task";
import { createTask as createTaskApi, uploadTasksFile } from "../../api/admin";

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
  const [uploadNumber, setUploadNumber] = useState("1");
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
    setPending(true);
    setStatus(null);

    try {
      await uploadTasksFile({
        file,
        number: uploadNumber,
        type: uploadType,
        part: uploadPart,
      });

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

      await createTaskApi(payload);

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
      {/* ================= ЗАГРУЗКА JSON ================= */}
      <Card>
        <h2 className="text-xl font-semibold mb-2">1) Массовая загрузка JSON</h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Номер задания</span>
            <input
              className="input"
              value={uploadNumber}
              onChange={(e) => setUploadNumber(e.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Тип</span>
            <select
              className="input"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as TaskType)}
            >
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Часть</span>
            <select
              className="input"
              value={uploadPart}
              onChange={(e) => setUploadPart(e.target.value as "1" | "2")}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </label>
        </div>

        <input
          type="file"
          accept=".json"
          onChange={(e) => e.target.files && upload(e.target.files[0])}
        />
      </Card>

      {/* ================= СОЗДАНИЕ ЗАДАЧИ ================= */}
      <Card>
        <h2 className="text-xl font-semibold mb-2">2) Добавить задачу вручную</h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Номер задания</span>
            <input
              className="input"
              value={createForm.number}
              onChange={(e) =>
                setCreateForm((v) => ({ ...v, number: e.target.value }))
              }
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-500">Часть</span>
            <select
              className="input"
              value={createForm.part}
              onChange={(e) =>
                setCreateForm((v) => ({ ...v, part: e.target.value as "1" | "2" }))
              }
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
              onChange={(e) =>
                setCreateForm((v) => ({ ...v, type: e.target.value as TaskType }))
              }
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
          <span className="text-sm text-slate-500">Текст задачи</span>
          <textarea
            className="input min-h-28"
            value={createForm.text}
            onChange={(e) =>
              setCreateForm((v) => ({ ...v, text: e.target.value }))
            }
          />
        </label>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Ссылка на фото</span>
          <input
            className="input"
            value={createForm.imageUrl}
            onChange={(e) =>
              setCreateForm((v) => ({ ...v, imageUrl: e.target.value }))
            }
          />
        </label>

        <div className="mb-4">
          <span className="text-sm text-slate-500 block mb-2">
            Расположение
          </span>

          <div className="flex gap-3">
            <button
              type="button"
              className={`chip ${
                createForm.contentOrder === "image-first" ? "chip-active" : ""
              }`}
              onClick={() =>
                setCreateForm((v) => ({ ...v, contentOrder: "image-first" }))
              }
            >
              Фото сверху
            </button>

            <button
              type="button"
              className={`chip ${
                createForm.contentOrder === "text-first" ? "chip-active" : ""
              }`}
              onClick={() =>
                setCreateForm((v) => ({ ...v, contentOrder: "text-first" }))
              }
            >
              Текст сверху
            </button>
          </div>
        </div>

        <label className="space-y-2 block mb-4">
          <span className="text-sm text-slate-500">Ответ *</span>
          <input
            className="input"
            value={createForm.answer}
            onChange={(e) =>
              setCreateForm((v) => ({ ...v, answer: e.target.value }))
            }
          />
        </label>

        <label className="space-y-2 block mb-6">
          <span className="text-sm text-slate-500">Решение</span>
          <textarea
            className="input min-h-24"
            value={createForm.solution}
            onChange={(e) =>
              setCreateForm((v) => ({ ...v, solution: e.target.value }))
            }
          />
        </label>

        <Button disabled={!canSubmitCreate || pending} onClick={createTask}>
          {pending ? "Сохранение..." : "Добавить задачу"}
        </Button>
      </Card>

      {/* ================= ПРЕВЬЮ ================= */}
      <Card>
        <h3 className="font-semibold mb-3">Превью</h3>
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
