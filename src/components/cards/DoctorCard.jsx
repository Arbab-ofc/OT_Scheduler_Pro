import { FiMail, FiPhone, FiAward, FiActivity } from "react-icons/fi";
import { formatName } from "../../utils/helpers/formatters";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  inactive: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
};

const DoctorCard = ({ doctor }) => (
  <div className="surface-panel rounded-2xl p-5 space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-200">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
          <FiAward className="text-primary" /> {doctor.specialization}
        </p>
        <h3 className="text-xl font-semibold mt-1">{formatName(doctor.firstName, doctor.lastName)}</h3>
      </div>
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles[doctor.status] || statusStyles.active}`}>
        {doctor.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
      <div className="flex items-center gap-2">
        <FiMail className="text-primary" />
        <span className="truncate">{doctor.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <FiPhone className="text-primary" />
        <span className="truncate">{doctor.phoneNumber}</span>
      </div>
    </div>

    {doctor.currentAssignment && (
      <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 px-4 py-3 text-sm flex items-center gap-2">
        <FiActivity className="text-primary" />
        <div>
          <p className="font-semibold text-primary">Current case</p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">{doctor.currentAssignment}</p>
        </div>
      </div>
    )}
  </div>
);

export default DoctorCard;
