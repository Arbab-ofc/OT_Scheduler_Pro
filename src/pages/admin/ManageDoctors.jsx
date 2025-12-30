import { useEffect, useState } from "react";
import DoctorForm from "../../components/forms/DoctorForm";
import DoctorTable from "../../components/tables/DoctorTable";
import { createDoctor, getAllDoctors } from "../../services/api/doctor.api";
import { toast } from "react-toastify";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getAllDoctors();
      setDoctors(data);
    };
    load();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await createDoctor(values);
      toast.success("Doctor saved");
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
        <DoctorForm onSubmit={handleSubmit} loading={loading} />
      </div>
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md">
        <h2 className="text-xl font-semibold mb-4">Doctor Directory</h2>
        <DoctorTable rows={doctors} />
      </div>
    </div>
  );
};

export default ManageDoctors;
