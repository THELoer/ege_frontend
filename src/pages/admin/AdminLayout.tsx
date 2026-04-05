import { Outlet, Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function AdminLayout() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Админ-панель</h1>
        <div className="flex gap-4">
          <Link to="/admin/tasks" className="text-indigo-600 hover:text-indigo-700">
            Управление заданиями
          </Link>
        </div>
        <Outlet />
      </div>
    </Layout>
  );
}
