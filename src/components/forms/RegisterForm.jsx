import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerSchema } from "../../utils/validators/authValidators";
import { BLOOD_GROUPS, GENDERS } from "../../utils/helpers/constants";

const RegisterForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
      gender: GENDERS[0],
      bloodGroup: BLOOD_GROUPS[0]
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
            {...register("displayName")}
          />
          {errors.displayName && <p className="text-sm text-red-500 mt-1">{errors.displayName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
            {...register("role")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
            {...register("dateOfBirth", { valueAsDate: true })}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
            {...register("gender")}
          >
            {GENDERS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Blood Group</label>
          <select
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
            {...register("bloodGroup")}
          >
            {BLOOD_GROUPS.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          {errors.bloodGroup && <p className="text-sm text-red-500 mt-1">{errors.bloodGroup.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 pr-11 focus:ring-2 focus:ring-primary"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute inset-y-0 right-3 flex items-center text-text-secondary-light dark:text-text-secondary-dark"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>
      <button type="submit" className="w-full h-12 rounded-lg bg-primary text-white font-semibold hover:shadow-md disabled:opacity-60" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;
