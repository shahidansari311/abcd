import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, BookOpen, GraduationCap } from "lucide-react";
import { PageHeader, Card, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type StudentProfile = {
  firstName: string;
  lastName: string;
  degree: string;
  graduationYear: number;
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: "",
    lastName: "",
    degree: "",
    graduationYear: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.get("/student/profile");
        // data.student from backend response
        if (data && data.student) {
          setProfile({
            firstName: data.student.firstName || "",
            lastName: data.student.lastName || "",
            degree: data.student.degree || "",
            graduationYear: data.student.graduationYear || new Date().getFullYear(),
          });
        }
      } catch (err: any) {
        // If not found or error, just fail gracefully or show error
        console.error("Failed to load profile:", err);
        // Do not block UI if backend is offline, just let them edit locally
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await api.put("/student/profile", profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-line bg-surface p-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <div>
      <PageHeader title="Personal Profile" subtitle="Manage your account information and preferences." />

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-2xl mt-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-3 mb-2 border-b border-line pb-4">
            <User className="text-primary" size={24} />
            <h2 className="text-lg font-semibold text-ink">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">First Name</label>
              <input 
                name="firstName"
                value={profile.firstName} 
                onChange={handleChange}
                placeholder="Jane"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Last Name</label>
              <input 
                name="lastName"
                value={profile.lastName} 
                onChange={handleChange}
                placeholder="Doe"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                <BookOpen size={16} className="text-ink-soft"/> Degree / Major
              </label>
              <input 
                name="degree"
                value={profile.degree} 
                onChange={handleChange}
                placeholder="Computer Science"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                <GraduationCap size={16} className="text-ink-soft"/> Graduation Year
              </label>
              <input 
                name="graduationYear"
                type="number"
                value={profile.graduationYear} 
                onChange={handleChange}
                placeholder="2025"
                className={inputClass}
              />
            </div>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}
          {success && <p className="text-sm text-primary font-medium">Profile updated successfully!</p>}

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
