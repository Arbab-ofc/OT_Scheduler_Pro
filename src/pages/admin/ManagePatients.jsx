import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PatientForm from "../../components/forms/PatientForm";
import PatientTable from "../../components/tables/PatientTable";
import { createPatient, getAllPatients } from "../../services/api/patient.api";
import { queryDocuments } from "../../services/firebase/firestore.service";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [patientData, userData] = await Promise.all([
        getAllPatients(),
        queryDocuments("users")
      ]);
      setPatients(patientData);
      setUsers(userData);
    };
    load();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      let payload = { ...values };
      if (values.userId) {
        const user = users.find(u => u.id === values.userId);
        if (user) {
          const [firstName = "", lastName = ""] = (user.displayName || "").split(" ");
          payload = {
            ...payload,
            firstName: payload.firstName || firstName,
            lastName: payload.lastName || lastName,
            email: payload.email || user.email || undefined,
            phoneNumber: payload.phoneNumber || user.phoneNumber || payload.phoneNumber
          };
        }
      }

      await createPatient(payload);
      toast.success("Patient saved");
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Patient</h2>
        <PatientForm onSubmit={handleSubmit} loading={loading} users={users} />
      </div>
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patients</h2>
        <PatientTable rows={patients} />
      </div>
    </div>
  );
};

export default ManagePatients;
