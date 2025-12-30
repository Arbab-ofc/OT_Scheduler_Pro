import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import RegisterForm from "../../components/forms/RegisterForm";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { user, register: registerUser, loginGoogle } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await registerUser(values);
      toast.success("Registration successful! Please verify your email.");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginGoogle();
      toast.success("Signed in with Google");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Create account</h1>
      <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
        <RegisterForm onSubmit={handleSubmit} loading={loading} />
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark font-semibold flex items-center justify-center gap-3 hover:shadow-md transition"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>
        </div>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
          Already registered? <Link to="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
