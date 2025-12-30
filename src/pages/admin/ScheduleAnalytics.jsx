import { useEffect, useState } from "react";
import { getOTUtilization } from "../../services/api/analytics.api";

const ScheduleAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getOTUtilization().then(setData);
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      {data ? (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/10">
            <p className="text-sm">Completion Rate</p>
            <p className="text-2xl font-bold">{data.completionRate}%</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/10">
            <p className="text-sm">Recent events</p>
            <p className="text-2xl font-bold">{data.recent.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10">
            <p className="text-sm">Data points</p>
            <p className="text-2xl font-bold">50</p>
          </div>
        </div>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
};

export default ScheduleAnalytics;
