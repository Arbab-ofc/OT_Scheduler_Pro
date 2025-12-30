import { formatDateTime } from "../../utils/helpers/dateHelpers";

const statusColor = status => {
  const map = {
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    emergency: "bg-red-100 text-red-700",
    cancelled: "bg-gray-200 text-gray-700",
    scheduled: "bg-amber-100 text-amber-700"
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

const ScheduleCard = ({ schedule }) => (
  <div className="p-4 rounded-xl shadow-md bg-white dark:bg-surface-dark border border-border-light/60 dark:border-border-dark/60">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold">{schedule.surgeryType}</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(schedule.status)}`}>{schedule.status}</span>
    </div>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
      Patient: {schedule.patientName || schedule.patientId} — Doctor: {schedule.doctorName || schedule.doctorId}
    </p>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
      {formatDateTime(schedule.scheduledStartTime, "PPp")} - {formatDateTime(schedule.scheduledEndTime, "p")}
    </p>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">OT Room: {schedule.otRoomNumber}</p>
  </div>
);

export default ScheduleCard;
