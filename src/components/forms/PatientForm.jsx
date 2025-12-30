import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema } from "../../utils/validators/patientValidators";
import { BLOOD_GROUPS, GENDERS } from "../../utils/helpers/constants";

const PatientForm = ({ onSubmit, defaultValues = {}, loading, users = [] }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: GENDERS[0],
      bloodGroup: BLOOD_GROUPS[0],
      status: "scheduled",
      emergencyContact: { name: "", relationship: "", phoneNumber: "" },
      ...defaultValues
    }
  });

  const selectedUserId = watch("userId");

  const toDateSafe = value => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value?.toDate === "function") return value.toDate();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  useEffect(() => {
    if (!selectedUserId) return;
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;
    const [firstName = "", lastName = ""] = (user.displayName || "").split(" ");
    setValue("firstName", firstName);
    setValue("lastName", lastName);
    if (user.email) setValue("email", user.email);
    if (user.phoneNumber) setValue("phoneNumber", user.phoneNumber);
    if (user.gender) setValue("gender", user.gender);
    if (user.bloodGroup) setValue("bloodGroup", user.bloodGroup);
    const dob = toDateSafe(user.dateOfBirth);
    if (dob) setValue("dateOfBirth", dob);
  }, [selectedUserId, users, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Link User (optional)</label>
        <select className="input" {...register("userId")}>
          <option value="">Select user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.displayName || u.email || u.id}
            </option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input className="input" {...register("firstName")} />
          {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input className="input" {...register("lastName")} />
          {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input className="input" type="date" {...register("dateOfBirth", { valueAsDate: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select className="input" {...register("gender")}>
            {GENDERS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Blood Group</label>
          <select className="input" {...register("bloodGroup")}>
            {BLOOD_GROUPS.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input className="input" {...register("phoneNumber")} />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber.message}</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Emergency Contact Name</label>
          <input className="input" {...register("emergencyContact.name")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Relationship</label>
          <input className="input" {...register("emergencyContact.relationship")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Emergency Contact Phone</label>
          <input className="input" {...register("emergencyContact.phoneNumber")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select className="input" {...register("status")}>
          <option value="admitted">Admitted</option>
          <option value="discharged">Discharged</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save Patient"}
      </button>
    </form>
  );
};

export default PatientForm;
