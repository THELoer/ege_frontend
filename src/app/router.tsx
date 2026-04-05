import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import TaskPage from "../pages/TaskPage";
import Diagnostic from "../pages/Diagnostic";
import DiagnosticResult from "../pages/DiagnosticResult";
import Train from "../pages/Train";
import Exam from "../pages/Exam";
import AdminLayout from "../pages/admin/AdminLayout";
import TasksAdmin from "../pages/admin/TasksAdmin";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/tasks/:number",
    element: (
      <ProtectedRoute>
        <TaskPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:number/diagnostic",
    element: (
      <ProtectedRoute>
        <Diagnostic />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:number/diagnostic/result",
    element: (
      <ProtectedRoute>
        <DiagnosticResult />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:number/train",
    element: (
      <ProtectedRoute>
        <Train />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:number/exam",
    element: (
      <ProtectedRoute>
        <Exam />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute admin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="tasks" replace /> },
      { path: "tasks", element: <TasksAdmin /> },
    ],
  },
]);
