import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiActivity, FiCalendar, FiClock, FiShield, FiUsers } from "react-icons/fi";
import { subscribeToCollection, queryDocuments } from "../services/firebase/firestore.service";
import { formatDateTime, toDateSafe } from "../utils/helpers/dateHelpers";
import { useAuth } from "../hooks/useAuth";

const stats = [
  { label: "On-time starts", value: "94%", accent: "text-primary" },
  { label: "Conflicts prevented", value: "120+", accent: "text-secondary" },
  { label: "Avg. scheduling time", value: "-38%", accent: "text-accent" }
];

const featureCards = [
  {
    icon: <FiCalendar />,
    title: "Conflict-free scheduling",
    copy: "Detect overlaps before they happen with intelligent OT and staff availability checks."
  },
  {
    icon: <FiUsers />,
    title: "Role-aware workflows",
    copy: "Admins assign theatres, clinicians confirm readiness, everyone stays aligned."
  },
  {
    icon: <FiShield />,
    title: "Built-in governance",
    copy: "Audit trails, approvals, and secure document uploads keep compliance simple."
  }
];

const workflow = [
  { title: "Capture the request", detail: "Single intake for patient, surgeon, and resource needs." },
  { title: "Check availability", detail: "Smart slots account for room prep, sterilization, and recovery." },
  { title: "Confirm & notify", detail: "Automatic updates keep surgeons, nurses, and admin teams synced." }
];

const buildName = entity =>
  entity ? `${entity.firstName || ""} ${entity.lastName || ""}`.trim() || entity.displayName || entity.email || "" : "";

const Home = () => {
  const { user } = useAuth();
  const [liveTimeline, setLiveTimeline] = useState([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardError, setBoardError] = useState("");
  const [doctorMap, setDoctorMap] = useState({});
  const [patientMap, setPatientMap] = useState({});
  const [userMap, setUserMap] = useState({});

  const cleanName = value => {
    if (!value) return "";
    const v = String(value).trim();
    return v.toLowerCase().includes("unknown") ? "" : v;
  };

  useEffect(() => {
    const loadMappings = async () => {
      try {
        const [doctors, patients, users] = await Promise.all([
          queryDocuments("doctors"),
          queryDocuments("patients"),
          queryDocuments("users")
        ]);
        setDoctorMap(Object.fromEntries(doctors.map(d => [d.id || d.doctorId, d])));
        setPatientMap(Object.fromEntries(patients.map(p => [p.id || p.patientId, p])));
        setUserMap(Object.fromEntries(users.map(u => [u.id, u])));
      } catch (error) {
        console.warn("Profile mapping load failed", error);
      }
    };
    loadMappings();
  }, []);

  const fallbackSeed = () => {
    const now = new Date();
    const slot = (mins, room, doctor, status, patient) => {
      const start = new Date(now.getTime() + mins * 60000);
      return {
        id: `${room}-${status}`,
        time: formatDateTime(start, "HH:mm"),
        title: `${room} • ${doctor}`,
        status,
        detail: `Patient: ${patient}`,
        startDate: start
      };
    };
    return [
      slot(15, "OT-1", "Dr. Priya Menon", "in-progress", "Rahul Verma"),
      slot(90, "OT-2", "Dr. Arjun Mehta", "pre-op", "Ananya Rao"),
      slot(160, "OT-3", "Dr. Sara Khan", "scheduled", "Michael Davis")
    ];
  };

  useEffect(() => {
    let unsubscribe;
    setBoardLoading(true);
    setBoardError("");
    unsubscribe = subscribeToCollection(
      "schedules",
      [],
      data => {
        const normalized = (data || [])
          .map(item => {
            const start = toDateSafe(item.scheduledStartTime) || toDateSafe(item.surgeryDate);
            const doctorDoc = doctorMap[item.doctorId] || userMap[item.doctorId] || item.doctor;
            const patientDoc = patientMap[item.patientId] || userMap[item.patientId] || item.patient;
            const doctorName =
              cleanName(item.doctorName) ||
              buildName(doctorDoc) ||
              cleanName(doctorDoc?.displayName) ||
              item.doctorId;
            const patientName =
              cleanName(item.patientName) ||
              buildName(patientDoc) ||
              cleanName(patientDoc?.displayName) ||
              item.patientId;
            return {
              id: item.id || item.scheduleId,
              time: formatDateTime(start, "HH:mm") || "—",
              title: `${item.otRoomNumber || "OT"} • ${doctorName || "Unassigned"}`,
              status: item.status || "scheduled",
              detail: patientName ? `Patient: ${patientName}` : "",
              startDate: start
            };
          })
          .sort((a, b) => {
            const aTime = a.startDate?.getTime?.() || 0;
            const bTime = b.startDate?.getTime?.() || 0;
            return aTime - bTime;
          })
          .slice(0, 5);
        setLiveTimeline(normalized);
        setBoardLoading(false);
        setBoardError("");
      },
      async err => {
        console.error("Live board subscription error", err);
        if (err?.code === "permission-denied") {
          setLiveTimeline(fallbackSeed());
          setBoardError("");
          setBoardLoading(false);
          return;
        }
        try {
          const fallback = await queryDocuments("schedules", [], [{ field: "surgeryDate", direction: "asc" }], 5);
          const normalized = (fallback || [])
            .map(item => {
              const start = toDateSafe(item.scheduledStartTime) || toDateSafe(item.surgeryDate);
              const doctorDoc = doctorMap[item.doctorId] || userMap[item.doctorId] || item.doctor;
              const patientDoc = patientMap[item.patientId] || userMap[item.patientId] || item.patient;
              const doctorName =
                cleanName(item.doctorName) ||
                buildName(doctorDoc) ||
                cleanName(doctorDoc?.displayName) ||
                item.doctorId;
              const patientName =
                cleanName(item.patientName) ||
                buildName(patientDoc) ||
                cleanName(patientDoc?.displayName) ||
                item.patientId;
              return {
                id: item.id || item.scheduleId,
                time: formatDateTime(start, "HH:mm") || "—",
                title: `${item.otRoomNumber || "OT"} • ${doctorName || "Unassigned"}`,
                status: item.status || "scheduled",
                detail: patientName ? `Patient: ${patientName}` : "",
                startDate: start
              };
            })
            .sort((a, b) => {
              const aTime = a.startDate?.getTime?.() || 0;
              const bTime = b.startDate?.getTime?.() || 0;
              return aTime - bTime;
            })
            .slice(0, 5);
          setLiveTimeline(normalized);
          setBoardError("");
        } catch (fallbackErr) {
          console.error("Live board fallback fetch error", fallbackErr);
          setLiveTimeline(fallbackSeed());
          setBoardError("");
        } finally {
          setBoardLoading(false);
        }
      }
    );
    return () => {
      unsubscribe?.();
    };
  }, [doctorMap, patientMap, userMap]);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12 space-y-16">
    <section className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <span className="badge">Next-gen OT orchestration</span>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
          Orchestrate every theatre with confidence.
          <span className="block text-2xl text-text-secondary-light dark:text-text-secondary-dark mt-3">
            Real-time scheduling, zero overlaps, clear accountability.
          </span>
        </h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Purpose-built for surgical teams: book theatres faster, keep surgeons informed, and protect utilization.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/register"
            className="px-5 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Get started
          </Link>
          <Link
            to="/doctors"
            className="px-5 py-3 rounded-lg border border-border-light dark:border-border-dark font-semibold hover:border-primary/60"
          >
            View doctors
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {stats.map(stat => (
            <div key={stat.label} className="surface-panel rounded-2xl p-4">
              <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-panel rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Live OT board</p>
            <h3 className="text-xl font-semibold mt-1">Today&apos;s runs</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2">
            <FiActivity /> Healthy
          </span>
        </div>
        <div className="space-y-3">
          {boardLoading && <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading live schedules...</p>}
          {boardError && <p className="text-sm text-red-500">{boardError}</p>}
          {!boardLoading && !boardError && liveTimeline.length === 0 && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">No upcoming surgeries yet.</p>
          )}
          {liveTimeline.map(item => (
            <div
              key={item.id || item.title}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white to-primary/5 dark:from-surface-dark dark:to-primary/5 border border-border-light/60 dark:border-border-dark/60"
            >
              <div className="w-16 text-sm font-semibold text-primary flex items-center gap-2">
                <FiClock />
                {item.time}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {item.status}
                  {item.detail ? ` • ${item.detail}` : ""}
                </p>
              </div>
              <div className="w-3 h-3 rounded-full bg-accent shadow-sm" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-xl highlight">
            <p className="text-xs uppercase text-primary font-semibold">Sterile</p>
            <p className="font-bold text-text-primary-light dark:text-text-primary-dark">OT-1</p>
          </div>
          <div className="p-3 rounded-xl highlight">
            <p className="text-xs uppercase text-primary font-semibold">Prep</p>
            <p className="font-bold text-text-primary-light dark:text-text-primary-dark">OT-3</p>
          </div>
          <div className="p-3 rounded-xl highlight">
            <p className="text-xs uppercase text-primary font-semibold">Recovery</p>
            <p className="font-bold text-text-primary-light dark:text-text-primary-dark">Bay A</p>
          </div>
        </div>
      </motion.div>
    </section>

    <section className="grid lg:grid-cols-3 gap-6">
      {featureCards.map(card => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="surface-panel rounded-2xl p-5 space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
            {card.icon}
          </div>
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{card.copy}</p>
        </motion.div>
      ))}
    </section>

    <section className="surface-panel rounded-3xl p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="badge">Built for surgical ops</p>
          <h3 className="text-2xl font-semibold mt-2">A workflow your team can trust</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2 max-w-2xl">
            Every step is designed to keep surgeons, nurses, and coordinators aligned. Automate the routine, surface the critical, and keep your OT calendar clean.
          </p>
        </div>
        <Link
          to={user ? "/dashboard" : "/login"}
          className="px-4 py-3 rounded-lg bg-secondary text-white font-semibold shadow-lg hover:shadow-xl transition"
        >
          {user ? "Go to your dashboard" : "Sign in to view your board"}
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {workflow.map(step => (
          <div key={step.title} className="rounded-2xl bg-white/60 dark:bg-surface-dark/60 border border-border-light/60 dark:border-border-dark/60 p-4">
            <h4 className="font-semibold text-primary mb-2">{step.title}</h4>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{step.detail}</p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default Home;
