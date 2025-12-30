import { queryDocuments } from "../firebase/firestore.service";
import { formatDateTime } from "../../utils/helpers/dateHelpers";

export const getOTUtilization = async () => {
  const schedules = await queryDocuments("schedules", [], [{ field: "surgeryDate", direction: "desc" }], 50);
  const total = schedules.length || 1;
  const completed = schedules.filter(s => s.status === "completed").length;
  return {
    completionRate: Number(((completed / total) * 100).toFixed(1)),
    recent: schedules.slice(0, 10).map(s => ({
      id: s.id,
      otRoomNumber: s.otRoomNumber,
      status: s.status,
      start: formatDateTime(s.scheduledStartTime, "PP p")
    }))
  };
};

export default { getOTUtilization };
