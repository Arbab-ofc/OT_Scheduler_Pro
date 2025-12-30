import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendResetPassword } from "../../services/firebase/auth.service";
import { useAuth } from "../../hooks/useAuth";

const ResetPassword = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async e => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter your email");
      return;
    }
    setLoading(true);
    try {
      await sendResetPassword(email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Reset password</h1>
      <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 focus:ring-2 focus:ring-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full h-12 rounded-lg bg-primary text-white font-semibold hover:shadow-md disabled:opacity-60" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
