import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "../../utils/validators/scheduleValidators";
import { PRIORITIES } from "../../utils/helpers/constants";
import { formatDateTime, toDateSafe } from "../../utils/helpers/dateHelpers";

const ScheduleForm = ({ onSubmit, defaultValues = {}, loading, doctors = [], patients = [], rooms = [] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Patient</label>
          <select className="input" {...register("patientId")}>
            <option value="">Select patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.patientId || p.id} - {p.firstName} {p.lastName}</option>
            ))}
          </select>
          {errors.patientId && <p className="error">{errors.patientId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Primary Surgeon</label>
          <select className="input" {...register("doctorId")}>
            <option value="">Select doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName} - {d.specialization}</option>
            ))}
          </select>
          {errors.doctorId && <p className="error">{errors.doctorId.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Anesthesiologist</label>
          <select className="input" {...register("anesthesiologistId")}>
            <option value="">Select</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">OT Room</label>
          <select className="input" {...register("otRoomNumber")}>
            <option value="">Select room</option>
            {rooms.map(room => (
              <option key={room.roomNumber || room.id} value={room.roomNumber || room.id}>{room.roomNumber || room.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select className="input" {...register("priority")}>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Surgery Type</label>
          <input className="input" {...register("surgeryType")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Surgery Date</label>
          <input className="input" type="date" {...register("surgeryDate", { valueAsDate: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input className="input" type="datetime-local" {...register("scheduledStartTime", { valueAsDate: true })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea className="input h-24" {...register("preOperativeNotes")} placeholder="Special requirements, warnings" />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save Schedule"}
      </button>
    </form>
  );
};

export default ScheduleForm;
