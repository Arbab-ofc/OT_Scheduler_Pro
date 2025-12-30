import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const EmailVerification = () => {
  const { sendVerification, refreshUser, user } = useAuth();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  const resend = async () => {
    try {
      await sendVerification();
      toast.info("Verification email sent.");
      setSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkStatus = async () => {
    setChecking(true);
    try {
      const updated = await refreshUser();
      if (updated?.emailVerified || updated?.isEmailVerified) {
        toast.success("Email verified!");
        navigate("/dashboard");
      } else {
        toast.info("Not verified yet. Please click the link in your email, then tap Check again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 lg:px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-3">Verify your email</h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
        Check your inbox for a verification link. You need a verified email before accessing the scheduler.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button onClick={resend} className="px-5 py-3 rounded-lg bg-primary text-white font-semibold">
          {sent ? "Resend again" : "Resend verification email"}
        </button>
        <button
          onClick={checkStatus}
          className="px-5 py-3 rounded-lg border border-border-light dark:border-border-dark font-semibold"
          disabled={checking}
        >
          {checking ? "Checking..." : "Check verification"}
        </button>
      </div>
      {user?.email && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-3">Signed in as {user.email}</p>}
    </div>
  );
};

export default EmailVerification;
