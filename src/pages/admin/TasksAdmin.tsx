import { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TaskStatement from "../../components/TaskStatement";
import type { TaskContentOrder } from "../../types/Task";
import { createTask as createTaskApi, uploadTasksFile } from "../../api/admin";
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

const INITIAL_CREATE_FORM: CreateTaskForm = {
  number: INITIAL_NUMBER,
  type: getDefaultTypeForNumber(Number(INITIAL_NUMBER)),
  text: "",
  contentOrder: "text-first",
  answer: "",
  solution: "",
};

export default function TasksAdmin() {
  const [uploadNumber, setUploadNumber] = useState(INITIAL_NUMBER);
  const [uploadType, setUploadType] = useState(getDefaultTypeForNumber(Number(INITIAL_NUMBER)));
  const [createForm, setCreateForm] = useState<CreateTaskForm>(INITIAL_CREATE_FORM);

  const [taskImageFile, setTaskImageFile] = useState<File | null>(null);
  const [answerImageFile, setAnswerImageFile] = useState<File | null>(null);
  const [solutionImageFile, setSolutionImageFile] = useState<File | null>(null);

  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const selectedUploadCatalog = useMemo(() => getCatalogItemByNumber(Number(uploadNumber)), [uploadNumber]);
  const selectedCreateCatalog = useMemo(() => getCatalogItemByNumber(Number(createForm.number)), [createForm.number]);

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

  const uploadTypeOptions = useMemo(
    () =>
      selectedUploadCatalog.subtypes?.length
        ? selectedUploadCatalog.subtypes
        : [{ label: selectedUploadCatalog.title, value: getDefaultTypeForNumber(selectedUploadCatalog.number) }],
    [selectedUploadCatalog]
  );

  const createTypeOptions = useMemo(
    () =>
      selectedCreateCatalog.subtypes?.length
        ? selectedCreateCatalog.subtypes
        : [{ label: selectedCreateCatalog.title, value: getDefaultTypeForNumber(selectedCreateCatalog.number) }],
    [selectedCreateCatalog]
  );

  const canSubmitCreate = useMemo(() => {
    const hasTaskContent = createForm.text.trim().length > 0 || Boolean(taskImageFile);
    const hasAnswerContent = createForm.answer.trim().length > 0 || Boolean(answerImageFile);
    return hasTaskContent && hasAnswerContent;
  }, [answerImageFile, createForm.answer, createForm.text, taskImageFile]);

  const upload = async (file: File) => {
    setPending(true);
    setStatus(null);

    try {
      await uploadTasksFile({
        file,
        number: uploadNumber,
        type: uploadType,
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
        <p className="text-slate-600 mb-6">Выберите номер задания 1–12 и подкатегорию. Поле «часть» убрано.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-500">Номер задания (1-12)</span>
            <select
              className="input"
              value={uploadNumber}
              onChange={(e) => {
                const nextNumber = e.target.value;
                setUploadNumber(nextNumber);
                setUploadType(getDefaultTypeForNumber(Number(nextNumber)));
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
            <select className="input" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
              {uploadTypeOptions.map((subtype) => (
                <option key={subtype.value} value={subtype.value}>
                  {subtype.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <input type="file" accept=".json" onChange={(e) => e.target.files && upload(e.target.files[0])} />
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-2">2) Добавить задачу вручную</h2>
        <p className="text-slate-600 mb-6">
          Выбери номер задания и подкатегорию. Для условия, ответа и решения можно прикрепить изображения файлами.
        </p>

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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTaskImageFile(e.target.files?.[0] ?? null)}
          />
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAnswerImageFile(e.target.files?.[0] ?? null)}
          />
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSolutionImageFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <Button disabled={!canSubmitCreate || pending} onClick={createTask}>
          {pending ? "Сохранение..." : "Добавить задачу"}
        </Button>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Превью отображения задачи</h3>
        <TaskStatement text={createForm.text} imageUrl={taskImagePreviewUrl} contentOrder={createForm.contentOrder} />
      </Card>

      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  );
}
