import { useEffect, useState } from "react";
import ScheduleCard from "../../components/cards/ScheduleCard";
import { getAllSchedules } from "../../services/api/schedule.api";

const SurgicalInformation = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    getAllSchedules().then(setSchedules);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Surgical Information</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {schedules.map(s => (
          <ScheduleCard key={s.id} schedule={s} />
        ))}
      </div>
    </div>
  );
};

export default SurgicalInformation;
