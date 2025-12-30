import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { getDocument, updateDocument } from "../../services/firebase/firestore.service";
import { useAuth } from "../../hooks/useAuth";
import { sendResetPassword } from "../../services/firebase/auth.service";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name too short").max(50, "Name too long"),
  phoneNumber: z.string().regex(/^[0-9+]{10,15}$/, "Phone number invalid").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  dateOfBirth: z.union([z.date(), z.string()]).optional()
});

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      phoneNumber: "",
      gender: "male",
      bloodGroup: "A+",
      dateOfBirth: ""
    }
  });

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;
      try {
        const profile = await getDocument("users", user.uid);
        reset({
          displayName: profile?.displayName || user.displayName || "",
          phoneNumber: profile?.phoneNumber || "",
          gender: profile?.gender || "male",
          bloodGroup: profile?.bloodGroup || "A+",
          dateOfBirth: profile?.dateOfBirth
            ? new Date(profile.dateOfBirth.seconds ? profile.dateOfBirth.seconds * 1000 : profile.dateOfBirth)
                .toISOString()
                .slice(0, 10)
            : ""
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, reset]);

  const onSubmit = async values => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const payload = {
        displayName: values.displayName,
        phoneNumber: values.phoneNumber || null,
        gender: values.gender,
        bloodGroup: values.bloodGroup,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null
      };
      await updateDocument("users", user.uid, payload);
      await refreshUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
        <h1 className="text-2xl font-bold mb-1">Your profile</h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Update your personal details for scheduling and contact.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Display name</label>
            <input className="input" {...register("displayName")} />
            {errors.displayName && <p className="error">{errors.displayName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <input className="input" {...register("phoneNumber")} placeholder="e.g. +19995551212" />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of birth</label>
            <input className="input" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && <p className="error">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select className="input" {...register("gender")}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="error">{errors.gender.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Blood group</label>
            <select className="input" {...register("bloodGroup")}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="error">{errors.bloodGroup.message}</p>}
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-surface-dark shadow-md border border-border-light/60 dark:border-border-dark/60">
        <h2 className="text-xl font-semibold mb-2">Security</h2>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
          Send yourself a password reset link to change your password securely.
        </p>
        <button
          className="h-12 px-4 rounded-lg border border-border-light dark:border-border-dark font-semibold hover:border-primary/60"
          onClick={async () => {
            if (!user?.email) {
              toast.error("No email on account.");
              return;
            }
            try {
              await sendResetPassword(user.email);
              toast.success("Password reset email sent.");
            } catch (error) {
              toast.error(error.message || "Failed to send reset email");
            }
          }}
          disabled={saving}
        >
          Send password reset email
        </button>
      </div>
    </div>
  );
};

export default Profile;
