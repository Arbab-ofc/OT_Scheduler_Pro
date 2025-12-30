import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { getDocument } from "../../services/firebase/firestore.service";

const normalizeRole = role => (role || "").toString().trim().toLowerCase();

const fallbackAdmins = {
  emails: ["arbabprvt@gmail.com"],
  uids: ["jh4gjk2lS7ZsJ8m1oIsRzI7d2kp2"]
};

const userHasRole = (user, requiredRole, fallbackRoles = []) => {
  if (!requiredRole) return true;
  const target = normalizeRole(requiredRole);
  const single = normalizeRole(user?.role);
  const list = Array.isArray(user?.roles) ? user.roles.map(normalizeRole) : [];
  const fallbacks = Array.isArray(fallbackRoles) ? fallbackRoles.map(normalizeRole) : [];
  const isWhitelistedAdmin =
    target === "admin" &&
    ((user?.email && fallbackAdmins.emails.some(e => normalizeRole(e) === normalizeRole(user.email))) ||
      (user?.uid && fallbackAdmins.uids.some(id => normalizeRole(id) === normalizeRole(user.uid))));
  return isWhitelistedAdmin || single === target || list.includes(target) || fallbacks.includes(target);
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const [fallbackRoles, setFallbackRoles] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);

  const isWhitelistedAdmin =
    requiredRole &&
    normalizeRole(requiredRole) === "admin" &&
    ((user?.email && fallbackAdmins.emails.some(e => normalizeRole(e) === normalizeRole(user.email))) ||
      (user?.uid && fallbackAdmins.uids.some(id => normalizeRole(id) === normalizeRole(user.uid))));

  useEffect(() => {
    let cancelled = false;
    const fetchRole = async () => {
      if (!requiredRole || !user) return;
      if (user.role || user.roles) {
        setFallbackRoles([]);
        return;
      }
      setRoleLoading(true);
      try {
        const profile = await getDocument("users", user.uid);
        if (!cancelled && profile) {
          const roles = [];
          if (profile.role) roles.push(profile.role);
          if (Array.isArray(profile.roles)) roles.push(...profile.roles);
          setFallbackRoles(roles);
        }
      } finally {
        if (!cancelled) setRoleLoading(false);
      }
    };
    fetchRole();
    return () => {
      cancelled = true;
    };
  }, [user, requiredRole]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (isWhitelistedAdmin) return children || <Outlet />;

  if (requiredRole) {
    const hasRoleInfo = user?.role || user?.roles || fallbackRoles.length > 0;
    if (hasRoleInfo && !userHasRole(user, requiredRole, fallbackRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
