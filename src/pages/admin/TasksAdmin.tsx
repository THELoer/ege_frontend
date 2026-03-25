import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";

export default function TasksAdmin() {
  const [number, setNumber] = useState("13");
  const [type, setType] = useState("logarithmic");
  const [part, setPart] = useState<"1" | "2">("1");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const upload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("number", number);
    form.append("type", type);
    form.append("part", part);

    setPending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/tasks/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setStatus("Файл успешно загружен.");
    } catch {
      setStatus("Ошибка загрузки файла.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Загрузка задач без изменения кода</h2>
      <p className="text-slate-600 mb-6">
        Загрузите JSON-файл с задачами и укажите метаданные, чтобы backend распределил их по каталогу/БД.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <label className="space-y-2">
          <span className="text-sm text-slate-500">Номер задания</span>
          <input className="input" value={number} onChange={(e) => setNumber(e.target.value)} />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500">Тип</span>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="logarithmic">logarithmic</option>
            <option value="trigonometric">trigonometric</option>
            <option value="exponential">exponential</option>
            <option value="rational">rational</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500">Часть</span>
          <select className="input" value={part} onChange={(e) => setPart(e.target.value as "1" | "2")}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
      </div>

      <input type="file" accept=".json" onChange={(e) => e.target.files && upload(e.target.files[0])} />

      <div className="mt-4">
        <Button disabled={pending}>{pending ? "Загрузка..." : "Готово к загрузке"}</Button>
      </div>

      {status && <p className="text-sm mt-3 text-slate-600">{status}</p>}
    </Card>
  );
}
