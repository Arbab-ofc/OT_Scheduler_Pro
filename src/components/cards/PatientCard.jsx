import { format } from "date-fns";

const PatientCard = ({ patient }) => (
  <div className="p-4 rounded-xl shadow-md bg-white dark:bg-surface-dark hover:shadow-lg transition">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">
        {patient.firstName} {patient.lastName}
      </h3>
      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">{patient.status}</span>
    </div>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
      ID: {patient.patientId || patient.id}
    </p>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
      DOB: {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "PP") : "N/A"}
    </p>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Blood: {patient.bloodGroup}</p>
  </div>
);

export default PatientCard;
