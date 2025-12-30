import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ScheduleForm from "../../components/forms/ScheduleForm";
import ScheduleTable from "../../components/tables/ScheduleTable";
import { createSchedule, getAllSchedules, updateScheduleStatus } from "../../services/api/schedule.api";
import { getAllDoctors } from "../../services/api/doctor.api";
import { getAllPatients } from "../../services/api/patient.api";
import { getDocument, queryDocuments } from "../../services/firebase/firestore.service";

const PostSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [users, setUsers] = useState([]);
  const [postponeTarget, setPostponeTarget] = useState(null);
  const [postponeStart, setPostponeStart] = useState("");

  const buildName = entity =>
    entity ? `${entity.firstName || ""} ${entity.lastName || ""}`.trim() || entity.displayName || entity.email || "" : "";

  const cleanName = value => {
    if (!value) return "";
    const v = String(value).trim();
    return v.toLowerCase().includes("unknown") ? "" : v;
  };

  const enrichSchedules = (list, doctorList, patientList, userList) => {
    const patientMap = {};
    patientList.forEach(p => {
      if (p.id) patientMap[p.id] = p;
      if (p.patientId) patientMap[p.patientId] = p;
    });

    const doctorMap = {};
    doctorList.forEach(d => {
      if (d.id) doctorMap[d.id] = d;
      if (d.doctorId) doctorMap[d.doctorId] = d;
    });

    const userMap = Object.fromEntries(userList.map(u => [u.id, u]));
    return list.map(s => {
      const patient = patientMap[s.patientId] || userMap[s.patientId];
      const doctor = doctorMap[s.doctorId] || userMap[s.doctorId];
      const patientName =
        cleanName(s.patientName) ||
        buildName(patient) ||
        s.patient?.name ||
        s.patientId ||
        s.patient?.patientId;
      const doctorName =
        cleanName(s.doctorName) ||
        buildName(doctor) ||
        s.doctor?.name ||
        s.doctorId ||
        s.doctor?.doctorId;
      return {
        ...s,
        patientName: patientName || "Unknown patient",
        doctorName: doctorName || "Unknown doctor"
      };
    });
  };

  const ensureNames = async list =>
    Promise.all(
      list.map(async s => {
        let patientName = s.patientName;
        let doctorName = s.doctorName;

        if (!cleanName(patientName) && s.patientId) {
          const patientDoc = await getDocument("patients", s.patientId).catch(() => null);
          if (patientDoc) patientName = cleanName(buildName(patientDoc)) || patientDoc.patientId || s.patientId;
        }

        if (!cleanName(doctorName) && s.doctorId) {
          const doctorDoc = await getDocument("doctors", s.doctorId).catch(() => null);
          if (doctorDoc) doctorName = cleanName(buildName(doctorDoc)) || doctorDoc.doctorId || s.doctorId;
        }

        return {
          ...s,
          patientName: cleanName(patientName) || s.patientId || "Unknown patient",
          doctorName: cleanName(doctorName) || s.doctorId || "Unknown doctor"
        };
      })
    );

  useEffect(() => {
    const load = async () => {
      const [doctorList, patientList, userList, scheduleList] = await Promise.all([
        getAllDoctors(),
        getAllPatients(),
        queryDocuments("users"),
        getAllSchedules()
      ]);
      setDoctors(doctorList);
      setPatients(patientList);
      setUsers(userList);
      const enriched = enrichSchedules(scheduleList, doctorList, patientList, userList);
      setSchedules(await ensureNames(enriched));
    };
    load();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const patient = patients.find(p => p.id === values.patientId || p.patientId === values.patientId);
      const doctor = doctors.find(d => d.id === values.doctorId || d.doctorId === values.doctorId);
      const payload = {
        ...values,
        patientName: cleanName(buildName(patient)) || values.patientId,
        doctorName: cleanName(buildName(doctor)) || values.doctorId
      };
      await createSchedule(payload);
      toast.success("Schedule created");
      const latest = await getAllSchedules();
      setSchedules(await ensureNames(enrichSchedules(latest, doctors, patients, users)));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (schedule, newStatus) => {
    if (schedule.status === newStatus) return;
    if (newStatus === "postponed") {
      setPostponeTarget(schedule);
      setPostponeStart("");
      return;
    }
    setUpdating(true);
    try {
      await updateScheduleStatus(schedule.id || schedule.scheduleId, newStatus);
      toast.success("Status updated");
      const latest = await getAllSchedules();
      setSchedules(await ensureNames(enrichSchedules(latest, doctors, patients, users)));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const submitPostpone = async () => {
    if (!postponeStart) {
      toast.error("Please select a new start date/time.");
      return;
    }
    const parsed = new Date(postponeStart);
    if (Number.isNaN(parsed.getTime())) {
      toast.error("Invalid date/time.");
      return;
    }
    const newEnd = new Date(parsed.getTime() + 60 * 60 * 1000);
    setUpdating(true);
    try {
      await updateScheduleStatus(postponeTarget.id || postponeTarget.scheduleId, "postponed", {
        scheduledStartTime: parsed,
        scheduledEndTime: newEnd,
        surgeryDate: parsed
      });
      toast.success("Status updated");
      const latest = await getAllSchedules();
      setSchedules(await ensureNames(enrichSchedules(latest, doctors, patients, users)));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
      setPostponeTarget(null);
      setPostponeStart("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Schedule</h2>
        <ScheduleForm doctors={doctors} patients={patients} rooms={[{ roomNumber: "OT-1" }, { roomNumber: "OT-2" }]} loading={loading} onSubmit={handleSubmit} />
      </div>
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upcoming Schedules</h2>
        <ScheduleTable rows={schedules} onStatusChange={handleStatusChange} />
        {updating && <p className="text-sm text-text-secondary-light mt-2">Applying status change...</p>}
      </div>
      {postponeTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Postpone schedule</h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
              Select a new start date/time for this surgery. End time will auto-set to 1 hour after start.
            </p>
            <input
              type="datetime-local"
              className="w-full input"
              value={postponeStart}
              onChange={e => setPostponeStart(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark"
                onClick={() => {
                  setPostponeTarget(null);
                  setPostponeStart("");
                }}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white" onClick={submitPostpone} disabled={updating}>
                {updating ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostSchedule;
