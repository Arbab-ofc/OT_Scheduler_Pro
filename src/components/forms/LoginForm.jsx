import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginSchema } from "../../utils/validators/authValidators";

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
