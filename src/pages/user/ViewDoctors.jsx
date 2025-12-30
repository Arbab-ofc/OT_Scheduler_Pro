import { useEffect, useMemo, useState } from "react";
import DoctorCard from "../../components/cards/DoctorCard";
import { getAllDoctors } from "../../services/api/doctor.api";
import { FiSearch } from "react-icons/fi";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");

  useEffect(() => {
    getAllDoctors().then(setDoctors);
  }, []);

  const specialties = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)));
    return ["all", ...list];
  }, [doctors]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return doctors.filter(doc => {
      const matchesText =
        doc.firstName?.toLowerCase().includes(q) ||
        doc.lastName?.toLowerCase().includes(q) ||
        doc.specialization?.toLowerCase().includes(q);
      const matchesSpecialty = specialty === "all" || doc.specialization === specialty;
      return matchesText && matchesSpecialty;
    });
  }, [doctors, query, specialty]);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="badge">Clinical network</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Find a doctor</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
            Browse active consultants and filter by specialty to coordinate OT availability quickly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-surface-dark border border-border-light/60 dark:border-border-dark/60 shadow-sm w-full sm:w-80">
            <FiSearch className="text-primary" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search doctors or specialties"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <select
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            className="rounded-xl border border-border-light/60 dark:border-border-dark/60 bg-white dark:bg-surface-dark px-3 py-2 text-sm shadow-sm"
          >
            {specialties.map(s => (
              <option key={s} value={s}>
                {s === "all" ? "All specialties" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(doc => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-text-secondary-light dark:text-text-secondary-dark py-12">
            No doctors found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDoctors;
