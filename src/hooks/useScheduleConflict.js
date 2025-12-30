import { isWithinInterval } from "date-fns";

const overlaps = (startA, endA, startB, endB) =>
  isWithinInterval(startA, { start: startB, end: endB }) ||
  isWithinInterval(endA, { start: startB, end: endB }) ||
  (startA <= startB && endA >= endB);

export const detectScheduleConflicts = ({ schedules = [], doctorId, otRoomNumber, anesthesiologistId, start, end }) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const conflicts = [];

  schedules.forEach(s => {
    const sStart = s.scheduledStartTime?.toDate ? s.scheduledStartTime.toDate() : new Date(s.scheduledStartTime);
    const sEnd = s.scheduledEndTime?.toDate ? s.scheduledEndTime.toDate() : new Date(s.scheduledEndTime);

    if (overlaps(startTime, endTime, sStart, sEnd)) {
      if (doctorId && s.doctorId === doctorId) conflicts.push({ type: "doctor", schedule: s });
      if (otRoomNumber && s.otRoomNumber === otRoomNumber) conflicts.push({ type: "room", schedule: s });
      if (anesthesiologistId && s.anesthesiologistId === anesthesiologistId) conflicts.push({ type: "anesthesiologist", schedule: s });
    }
  });

  return conflicts;
};

export const useScheduleConflict = () => ({ detectConflicts: detectScheduleConflicts });

export default useScheduleConflict;
