import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDocument, queryDocuments } from "../../services/firebase/firestore.service";
import ScheduleTable from "../../components/tables/ScheduleTable";
import ScheduleModal from "../../components/modals/ScheduleModal";
import { getAllSchedules, updateSchedule, updateScheduleStatus } from "../../services/api/schedule.api";
import { getOTUtilization } from "../../services/api/analytics.api";
import { getAllDoctors } from "../../services/api/doctor.api";
import { getAllPatients } from "../../services/api/patient.api";
import { uploadMultipleFiles } from "../../services/cloudinary/upload.service";
import { deleteDocument } from "../../services/firebase/firestore.service";

const KPI = ({ title, value, accent }) => (
  <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{title}</p>
    <p className={`text-2xl font-bold ${accent}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [utilization, setUtilization] = useState({ completionRate: 0, recent: [] });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [users, setUsers] = useState([]);
  const [postponeTarget, setPostponeTarget] = useState(null);
  const [postponeStart, setPostponeStart] = useState("");
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);

  const buildName = entity =>
    entity ? `${entity.firstName || ""} ${entity.lastName || ""}`.trim() || entity.displayName || "" : "";

  const computeCompletionRate = list => {
    const total = list.length || 1;
    const completed = list.filter(s => s.status === "completed").length;
    return Number(((completed / total) * 100).toFixed(1));
  };

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

  const ensureNames = async list => {
    return Promise.all(
      list.map(async s => {
        let patientName = s.patientName;
        let doctorName = s.doctorName;

        if (!cleanName(patientName) && s.patientId) {
          const patientDoc = await getDocument("patients", s.patientId).catch(() => null);
          if (patientDoc) {
            patientName = cleanName(buildName(patientDoc)) || patientDoc.patientId || s.patientId;
          }
        }

        if (!cleanName(doctorName) && s.doctorId) {
          const doctorDoc = await getDocument("doctors", s.doctorId).catch(() => null);
          if (doctorDoc) {
            doctorName = cleanName(buildName(doctorDoc)) || doctorDoc.doctorId || s.doctorId;
          }
        }

        return {
          ...s,
          patientName: cleanName(patientName) || s.patientId || "Unknown patient",
          doctorName: cleanName(doctorName) || s.doctorId || "Unknown doctor"
        };
      })
    );
  };

  useEffect(() => {
    const load = async () => {
      const [doctorList, patientList, userList, data, analyticsResult] = await Promise.all([
        getAllDoctors(),
        getAllPatients(),
        queryDocuments("users"),
        getAllSchedules([], [{ field: "surgeryDate", direction: "asc" }]),
        getOTUtilization()
      ]);
      setDoctors(doctorList);
      setPatients(patientList);
      setUsers(userList);

      const enriched = enrichSchedules(data, doctorList, patientList, userList);
      const withNames = await ensureNames(enriched);
      setSchedules(withNames);
      setUtilization({
        completionRate: computeCompletionRate(withNames),
        recent: analyticsResult.recent
      });
    };
    load();
  }, []);

  const handleStatusChange = async (schedule, newStatus) => {
    if (schedule.status === newStatus) return;
    if (newStatus === "postponed") {
      setPostponeTarget(schedule);
      setPostponeStart("");
      return;
    }
    setUpdatingStatus(true);
    try {
      await updateScheduleStatus(schedule.id || schedule.scheduleId, newStatus);
      const refreshed = await getAllSchedules([], [{ field: "surgeryDate", direction: "asc" }]);
      const enriched = enrichSchedules(refreshed, doctors, patients, users);
      const withNames = await ensureNames(enriched);
      setSchedules(withNames);
      setUtilization(prev => ({
        ...prev,
        completionRate: computeCompletionRate(withNames)
      }));
      toast.success("Status updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteSchedule = async schedule => {
    setDeleting(true);
    try {
      await deleteDocument("schedules", schedule.id || schedule.scheduleId);
      const refreshed = await getAllSchedules([], [{ field: "surgeryDate", direction: "asc" }]);
      const enriched = enrichSchedules(refreshed, doctors, patients, users);
      const withNames = await ensureNames(enriched);
      setSchedules(withNames);
      setSelected(null);
      toast.success("Schedule deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete schedule");
    } finally {
      setDeleting(false);
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
    setUpdatingStatus(true);
    try {
      await updateScheduleStatus(postponeTarget.id || postponeTarget.scheduleId, "postponed", {
        scheduledStartTime: parsed,
        scheduledEndTime: newEnd,
        surgeryDate: parsed
      });
      const refreshed = await getAllSchedules([], [{ field: "surgeryDate", direction: "asc" }]);
      const enriched = enrichSchedules(refreshed, doctors, patients, users);
      const withNames = await ensureNames(enriched);
      setSchedules(withNames);
      setUtilization(prev => ({
        ...prev,
        completionRate: computeCompletionRate(withNames)
      }));
      toast.success("Schedule postponed");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false);
      setPostponeTarget(null);
      setPostponeStart("");
    }
  };

  const handleUploadDocuments = async (schedule, files) => {
    if (!files?.length) return;
    setUploadingDocs(true);
    try {
      const uploads = await uploadMultipleFiles(Array.from(files), "schedules");
      const newDocs = uploads.map(file => ({
        documentName: file.original_filename,
        documentURL: file.secure_url,
        publicId: file.public_id,
        resourceType: file.resource_type,
        format: file.format,
        uploadedAt: new Date()
      }));
      const merged = [...(schedule.documents || []), ...newDocs];
      await updateSchedule(schedule.id || schedule.scheduleId, { documents: merged });
      const refreshed = await getAllSchedules([], [{ field: "surgeryDate", direction: "asc" }]);
      const enriched = enrichSchedules(refreshed, doctors, patients, users);
      const withNames = await ensureNames(enriched);
      setSchedules(withNames);
      if (selected) {
        const updatedSelected = withNames.find(s => (s.id || s.scheduleId) === (selected.id || selected.scheduleId));
        if (updatedSelected) setSelected(updatedSelected);
      }
      toast.success("Documents uploaded");
    } catch (error) {
      toast.error(error.message || "Failed to upload documents");
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleDeleteDocument = async (schedule, docUrl) => {
    if (!docUrl) return;
    setDeletingDocId(docUrl);
    try {
      const remaining = (schedule.documents || []).filter(doc => doc.documentURL !== docUrl);
      await updateSchedule(schedule.id || schedule.scheduleId, { documents: remaining });
      const refreshed = await getAllSchedules([], [{ field: "surgeryDate", direction: "asc" }]);
      const enriched = enrichSchedules(refreshed, doctors, patients, users);
      const withNames = await ensureNames(enriched);
      setSchedules(withNames);
      if (selected) {
        const updatedSelected = withNames.find(s => (s.id || s.scheduleId) === (selected.id || selected.scheduleId));
        if (updatedSelected) setSelected(updatedSelected);
      }
      toast.success("Document removed");
    } catch (error) {
      toast.error(error.message || "Failed to delete document");
    } finally {
      setDeletingDocId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPI title="Total Surgeries" value={schedules.length} accent="text-primary" />
        <KPI title="Completion Rate" value={`${utilization.completionRate}%`} accent="text-secondary" />
        <KPI title="Emergency Cases" value={schedules.filter(s => s.priority === "emergency").length} accent="text-red-500" />
        <KPI title="Pending" value={schedules.filter(s => s.status === "scheduled").length} accent="text-amber-500" />
      </div>
      <div className="grid grid-cols-1 gap-6 items-start">
        <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Upcoming Surgeries</h3>
          <ScheduleTable rows={schedules.slice(0, 8)} onRowClick={setSelected} onStatusChange={handleStatusChange} />
          {updatingStatus && <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">Updating status...</p>}
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {utilization.recent.map(item => (
              <div key={item.id} className="p-3 rounded-lg bg-primary/5">
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">{item.otRoomNumber}</p>
                <p className="text-xs uppercase">{item.status}</p>
                <p className="text-xs">{item.start}</p>
              </div>
            ))}
            {!utilization.recent.length && <p>No recent activity.</p>}
          </div>
        </div>
      </div>
      <ScheduleModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        schedule={selected}
        onUploadDocuments={files => selected && handleUploadDocuments(selected, files)}
        uploadingDocuments={uploadingDocs}
        onDelete={selected ? () => handleDeleteSchedule(selected) : undefined}
        deleting={deleting}
        onDeleteDocument={selected ? docUrl => handleDeleteDocument(selected, docUrl) : undefined}
        deletingDocumentId={deletingDocId}
      />
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
              <button className="px-4 py-2 rounded-lg bg-primary text-white" onClick={submitPostpone} disabled={updatingStatus}>
                {updatingStatus ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
