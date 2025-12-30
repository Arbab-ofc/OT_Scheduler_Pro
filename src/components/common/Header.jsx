import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Doctors" },
    ...(user?.role === "admin" ? [{ to: "/schedules", label: "Schedules" }] : []),
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : [])
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b border-border-light/60 dark:border-border-dark/60 bg-white/80 dark:bg-surface-dark/70 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.45)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg shadow-primary/30 flex items-center justify-center text-white font-black">
            <span className="text-sm tracking-tight">OT</span>
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="leading-tight">
            <p className="font-black text-lg text-text-primary-light dark:text-text-primary-dark tracking-tight">OT Scheduler Pro</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Realtime OT orchestration</p>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `hover:text-primary ${isActive ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:block text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/user/profile" className="hover:text-primary">
                  Hi, {user.displayName || "User"}
                </Link>
                <button
                  onClick={async () => {
                    await logoutUser();
                    navigate("/");
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-sm font-semibold hover:text-primary"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-primary font-semibold">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <button className="lg:hidden p-2 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-4 pb-4 space-y-2 bg-white dark:bg-surface-dark"
          >
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/user/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`
                }
              >
                Profile
              </NavLink>
            )}
            {!user && (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
            {user && (
              <button
                onClick={async () => {
                  await logoutUser();
                  setOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold flex items-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
