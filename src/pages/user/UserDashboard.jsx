import { useEffect, useState } from "react";
import ScheduleCard from "../../components/cards/ScheduleCard";
import { getAllSchedules } from "../../services/api/schedule.api";
import { getAllDoctors } from "../../services/api/doctor.api";
import { getAllPatients } from "../../services/api/patient.api";
import { queryDocuments } from "../../services/firebase/firestore.service";
import { useAuth } from "../../hooks/useAuth";

const UserDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const [data, doctors, patients, users] = await Promise.all([
        getAllSchedules(),
        getAllDoctors(),
        getAllPatients(),
        queryDocuments("users")
      ]);

      const buildName = entity =>
        entity ? `${entity.firstName || ""} ${entity.lastName || ""}`.trim() || entity.displayName || entity.email || "" : "";

      const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));
      const patientMap = Object.fromEntries(patients.map(p => [p.id, p]));
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));
      const userPatientIds = patients.filter(p => p.userId === user?.uid).map(p => p.id);

      const filtered = data.filter(
        s =>
          s.doctorId === user?.uid ||
          userPatientIds.includes(s.patientId) ||
          s.nurses?.some(n => n.nurseId === user?.uid)
      );

      const enriched = filtered.map(s => {
        const patient = patientMap[s.patientId] || userMap[s.patientId];
        const doctor = doctorMap[s.doctorId] || userMap[s.doctorId];
        return {
          ...s,
          patientName: s.patientName || buildName(patient) || s.patientId,
          doctorName: s.doctorName || buildName(doctor) || s.doctorId
        };
      });

      setSchedules(enriched);
    };
    load();
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your upcoming cases</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {schedules.map(schedule => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
        {!schedules.length && <p className="text-text-secondary-light dark:text-text-secondary-dark">No assigned surgeries.</p>}
      </div>
    </div>
  );
};

export default UserDashboard;
