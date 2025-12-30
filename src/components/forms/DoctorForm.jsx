import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema } from "../../utils/validators/doctorValidators";
import { WEEK_DAYS } from "../../utils/helpers/constants";

const DoctorForm = ({ onSubmit, defaultValues = {}, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      status: "active",
      availableDays: [],
      weeklyHoursLimit: 40,
      workingHours: { start: "", end: "" },
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="input" type="email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input className="input" {...register("phoneNumber")} />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Specialization</label>
          <input className="input" {...register("specialization")} />
          {errors.specialization && <p className="error">{errors.specialization.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">License Number</label>
          <input className="input" {...register("licenseNumber")} />
          {errors.licenseNumber && <p className="error">{errors.licenseNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <input className="input" {...register("department")} />
          {errors.department && <p className="error">{errors.department.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="input" {...register("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Available Days</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WEEK_DAYS.map(day => (
            <label key={day} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={day} {...register("availableDays")} />
              {day}
            </label>
          ))}
        </div>
        {errors.availableDays && <p className="error">{errors.availableDays.message}</p>}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Shift Start</label>
          <input className="input" type="time" {...register("workingHours.start")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shift End</label>
          <input className="input" type="time" {...register("workingHours.end")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weekly Hours Limit</label>
          <input className="input" type="number" {...register("weeklyHoursLimit", { valueAsNumber: true })} />
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save Doctor"}
      </button>
    </form>
  );
};

export default DoctorForm;
