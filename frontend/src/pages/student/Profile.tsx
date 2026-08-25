import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, BookOpen, GraduationCap, Briefcase, Link as LinkIcon, FileText, Plus, Trash2, Folder, Award } from "lucide-react";
import { PageHeader, Card, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type Experience = { _id?: string; role: string; company: string; duration: string; description: string };
type Education = { _id?: string; institution: string; degree: string; year: string; score: string };
type Project = { _id?: string; title: string; description: string; link: string };
type Certification = { _id?: string; name: string; issuer: string; year: string; link: string };

type StudentProfile = {
  firstName: string;
  lastName: string;
  degree: string;
  graduationYear: number;
  headline: string;
  github: string;
  linkedin: string;
  portfolio: string;
  resumeUrl: string;
  preferredRoles: string;
  targetRole: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: "",
    lastName: "",
    degree: "",
    graduationYear: new Date().getFullYear(),
    headline: "",
    github: "",
    linkedin: "",
    portfolio: "",
    resumeUrl: "",
    preferredRoles: "",
    targetRole: "",
    experience: [],
    education: [],
    projects: [],
    certifications: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.get("/student/profile");
        if (data && data.student) {
          setProfile({
            firstName: data.student.firstName || "",
            lastName: data.student.lastName || "",
            degree: data.student.degree || "",
            graduationYear: data.student.graduationYear || new Date().getFullYear(),
            headline: data.student.headline || "",
            github: data.student.github || "",
            linkedin: data.student.linkedin || "",
            portfolio: data.student.portfolio || "",
            resumeUrl: data.student.resumeUrl || "",
            preferredRoles: data.student.preferredRoles ? data.student.preferredRoles.join(", ") : "",
            targetRole: data.student.targetRole || "",
            experience: data.student.experience || [],
            education: data.student.education || [],
            projects: data.student.projects || [],
            certifications: data.student.certifications || [],
          });
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (category: keyof StudentProfile, index: number, field: string, value: string) => {
    setProfile(prev => {
      const newArray = [...(prev[category] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [category]: newArray };
    });
  };

  const addArrayItem = (category: keyof StudentProfile, emptyItem: any) => {
    setProfile(prev => ({ ...prev, [category]: [...(prev[category] as any[]), emptyItem] }));
  };

  const removeArrayItem = (category: keyof StudentProfile, index: number) => {
    setProfile(prev => {
      const newArray = [...(prev[category] as any[])];
      newArray.splice(index, 1);
      return { ...prev, [category]: newArray };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.degree.trim()) {
      setError("First Name, Last Name, and Degree are required.");
      setSaving(false);
      return;
    }

    const payload = {
      ...profile,
      preferredRoles: profile.preferredRoles ? profile.preferredRoles.split(",").map(s => s.trim()).filter(Boolean) : [],
      // Clean up empty entries before sending
      experience: profile.experience.filter(e => e.role.trim() || e.company.trim()),
      education: profile.education.filter(e => e.institution.trim() || e.degree.trim()),
      projects: profile.projects.filter(p => p.title.trim()),
      certifications: profile.certifications.filter(c => c.name.trim()),
    };

    try {
      await api.put("/student/profile", payload);
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
      <PageHeader title="Personal Profile" subtitle="Manage your account information, experience, and projects to build your resume." />

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-4xl mt-6">
        <Card className="space-y-8">
          
          {/* Basic Information */}
          <section>
            <div className="flex items-center gap-3 mb-4 border-b border-line pb-4">
              <User className="text-primary" size={24} />
              <h2 className="text-lg font-semibold text-ink">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">First Name *</label>
                <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Jane" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Last Name *</label>
                <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                  <BookOpen size={16} className="text-ink-soft"/> Degree / Major *
                </label>
                <input name="degree" value={profile.degree} onChange={handleChange} placeholder="Computer Science" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                  <GraduationCap size={16} className="text-ink-soft"/> Graduation Year
                </label>
                <input name="graduationYear" type="number" value={profile.graduationYear} onChange={handleChange} placeholder="2025" className={inputClass} />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-ink mb-1">Professional Headline</label>
              <input name="headline" value={profile.headline} onChange={handleChange} placeholder="Aspiring Data Scientist | Python Enthusiast" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Target Role</label>
                <input name="targetRole" value={profile.targetRole} onChange={handleChange} placeholder="e.g. Data Scientist" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Preferred Roles (comma separated)</label>
                <input name="preferredRoles" value={profile.preferredRoles} onChange={handleChange} placeholder="Data Scientist, Data Analyst" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Experience */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-ink">Experience</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => addArrayItem("experience", { role: "", company: "", duration: "", description: "" })}>
                <Plus size={16} className="mr-1" /> Add Experience
              </Button>
            </div>
            
            {profile.experience.map((exp, index) => (
              <div key={index} className="mb-6 rounded-xl border border-line bg-surface p-4 relative group">
                <button 
                  onClick={() => removeArrayItem("experience", index)}
                  className="absolute right-4 top-4 text-ink-soft hover:text-error transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Role Title</label>
                    <input value={exp.role} onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)} placeholder="Software Engineer Intern" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Company</label>
                    <input value={exp.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} placeholder="Tech Corp" className={inputClass} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-ink-soft mb-1">Duration</label>
                  <input value={exp.duration} onChange={(e) => handleArrayChange("experience", index, "duration", e.target.value)} placeholder="June 2023 - Aug 2023" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1">Description</label>
                  <textarea value={exp.description} onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)} rows={3} placeholder="Developed a REST API..." className={inputClass} />
                </div>
              </div>
            ))}
            {profile.experience.length === 0 && <p className="text-sm text-ink-soft text-center py-4 italic">No experience added yet.</p>}
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <Folder className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-ink">Projects</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => addArrayItem("projects", { title: "", description: "", link: "" })}>
                <Plus size={16} className="mr-1" /> Add Project
              </Button>
            </div>
            
            {profile.projects.map((proj, index) => (
              <div key={index} className="mb-6 rounded-xl border border-line bg-surface p-4 relative group">
                <button 
                  onClick={() => removeArrayItem("projects", index)}
                  className="absolute right-4 top-4 text-ink-soft hover:text-error transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Project Title</label>
                    <input value={proj.title} onChange={(e) => handleArrayChange("projects", index, "title", e.target.value)} placeholder="AI Chatbot" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Project Link (URL)</label>
                    <input value={proj.link} onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)} placeholder="https://github.com/..." className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1">Description</label>
                  <textarea value={proj.description} onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)} rows={2} placeholder="Built using React and Node.js..." className={inputClass} />
                </div>
              </div>
            ))}
            {profile.projects.length === 0 && <p className="text-sm text-ink-soft text-center py-4 italic">No projects added yet.</p>}
          </section>

          {/* Education */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-ink">Education History</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => addArrayItem("education", { institution: "", degree: "", year: "", score: "" })}>
                <Plus size={16} className="mr-1" /> Add Education
              </Button>
            </div>
            
            {profile.education.map((edu, index) => (
              <div key={index} className="mb-6 rounded-xl border border-line bg-surface p-4 relative group">
                <button 
                  onClick={() => removeArrayItem("education", index)}
                  className="absolute right-4 top-4 text-ink-soft hover:text-error transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Institution</label>
                    <input value={edu.institution} onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)} placeholder="State University" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Degree / Certification</label>
                    <input value={edu.degree} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} placeholder="B.S. Computer Science" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Year</label>
                    <input value={edu.year} onChange={(e) => handleArrayChange("education", index, "year", e.target.value)} placeholder="2020 - 2024" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Score / GPA</label>
                    <input value={edu.score} onChange={(e) => handleArrayChange("education", index, "score", e.target.value)} placeholder="3.8/4.0" className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
            {profile.education.length === 0 && <p className="text-sm text-ink-soft text-center py-4 italic">No education history added.</p>}
          </section>

          {/* Certifications */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <Award className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-ink">Certifications</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => addArrayItem("certifications", { name: "", issuer: "", year: "", link: "" })}>
                <Plus size={16} className="mr-1" /> Add Certification
              </Button>
            </div>
            
            {profile.certifications.map((cert, index) => (
              <div key={index} className="mb-6 rounded-xl border border-line bg-surface p-4 relative group">
                <button 
                  onClick={() => removeArrayItem("certifications", index)}
                  className="absolute right-4 top-4 text-ink-soft hover:text-error transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Certification Name</label>
                    <input value={cert.name} onChange={(e) => handleArrayChange("certifications", index, "name", e.target.value)} placeholder="AWS Solutions Architect" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Issuer</label>
                    <input value={cert.issuer} onChange={(e) => handleArrayChange("certifications", index, "issuer", e.target.value)} placeholder="Amazon Web Services" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Year</label>
                    <input value={cert.year} onChange={(e) => handleArrayChange("certifications", index, "year", e.target.value)} placeholder="2023" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Credential URL</label>
                    <input value={cert.link} onChange={(e) => handleArrayChange("certifications", index, "link", e.target.value)} placeholder="https://..." className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
            {profile.certifications.length === 0 && <p className="text-sm text-ink-soft text-center py-4 italic">No certifications added yet.</p>}
          </section>

          {/* Links & Resume */}
          <section>
            <div className="flex items-center gap-3 mb-4 border-b border-line pb-4">
              <LinkIcon className="text-primary" size={24} />
              <h2 className="text-lg font-semibold text-ink">Links & Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">LinkedIn URL</label>
                <input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">GitHub URL</label>
                <input name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/username" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Portfolio URL</label>
                <input name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://myportfolio.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                  <FileText size={16} className="text-ink-soft"/> External Resume URL
                </label>
                <input name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/..." className={inputClass} />
              </div>
            </div>
          </section>

          {error && <p className="text-sm text-error font-medium bg-error/10 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-primary font-medium bg-primary/10 p-3 rounded-lg">Profile updated successfully!</p>}

          <div className="pt-4 border-t border-line flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6">
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
