import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./components/common/Sidebar";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const EmailVerification = lazy(() => import("./pages/auth/EmailVerification"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageDoctors = lazy(() => import("./pages/admin/ManageDoctors"));
const ManagePatients = lazy(() => import("./pages/admin/ManagePatients"));
const PostSchedule = lazy(() => import("./pages/admin/PostSchedule"));

const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const ViewDoctors = lazy(() => import("./pages/user/ViewDoctors"));
const SurgicalInformation = lazy(() => import("./pages/user/SurgicalInformation"));
const Profile = lazy(() => import("./pages/user/Profile"));

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "user") return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/schedules" replace />;
};

const AdminLayout = () => (
  <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
    <Sidebar />
    <div className="flex-1 p-4 lg:p-6">
      <Outlet />
    </div>
  </div>
);

const UserLayout = () => (
  <div className="w-full px-4 lg:px-8 py-6">
    <OutletContainer />
  </div>
);

const OutletContainer = () => (
  <div className="max-w-6xl mx-auto">
    <Outlet />
  </div>
);

const UnauthorizedPage = () => (
  <div className="max-w-3xl mx-auto p-6 text-center">
    <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
    <p className="text-gray-500">You do not have permission to access this resource.</p>
  </div>
);

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-email", element: <EmailVerification /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/doctors", element: <ViewDoctors /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <Terms /> },
  {
    path: "/schedules",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <PostSchedule /> }]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardRedirect />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "doctors", element: <ManageDoctors /> },
      { path: "patients", element: <ManagePatients /> }
    ]
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { path: "dashboard", element: <UserDashboard /> },
      { path: "surgical-info", element: <SurgicalInformation /> },
      { path: "profile", element: <Profile /> }
    ]
  },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
