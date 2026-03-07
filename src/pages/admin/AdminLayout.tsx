import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="p-6">
      <Link to="/admin/tasks" className="text-blue-500">
        Задания
      </Link>
      <Outlet />
    </div>
  );
}
