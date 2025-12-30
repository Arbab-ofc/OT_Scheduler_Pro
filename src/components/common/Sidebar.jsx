import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiClipboard } from "react-icons/fi";
import { useState } from "react";

const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/admin/doctors", label: "Doctors", icon: <FiUsers /> },
  { to: "/admin/patients", label: "Patients", icon: <FiClipboard /> },
  { to: "/schedules", label: "Schedules", icon: <FiClipboard /> }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`hidden lg:block transition-all duration-300 ${collapsed ? "w-20" : "w-64"} bg-surface-light dark:bg-surface-dark border-r border-border-light/60 dark:border-border-dark/60`}>
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && <div className="font-semibold">Admin Panel</div>}
        <button aria-label="Toggle sidebar" className="text-sm" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>
      <nav className="px-2 space-y-1">
        {adminNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 ${
                isActive ? "text-primary bg-primary/10" : "text-text-secondary-light dark:text-text-secondary-dark"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
