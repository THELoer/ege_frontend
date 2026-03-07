export default function TasksAdmin() {
  const upload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/admin/tasks/upload", {
      method: "POST",
      body: form,
    });
  };

  return (
    <input
      type="file"
      accept=".json"
      onChange={(e) => e.target.files && upload(e.target.files[0])}
    />
  );
}
