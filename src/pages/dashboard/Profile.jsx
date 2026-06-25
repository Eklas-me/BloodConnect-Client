import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { districts, upazilas } from "@/data/bangladeshData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Edit3, 
  Save, 
  User, 
  Mail, 
  Droplet, 
  MapPin, 
  Upload, 
  Loader2, 
  X, 
  Shield, 
  Award, 
  Heart, 
  Camera,
  CheckCircle,
  Activity
} from "lucide-react";
import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const BANNER_PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() * 8 + 5, // 5px to 13px
  duration: Math.random() * 8 + 6, // 6s to 14s
  delay: Math.random() * 4,
}));

const Profile = () => {
  const { user, updateUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states initialized with current user details
  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    bloodGroup: user?.bloodGroup || "",
    district: user?.district || "",
    upazila: user?.upazila || "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState(() => {
    if (user?.district) {
      const selectedDistrict = districts.find((d) => d.name === user.district);
      if (selectedDistrict) {
        return upazilas.filter((u) => u.district_id === selectedDistrict.id);
      }
    }
    return [];
  });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      if (selectedDistrict) {
        const matchingUpazilas = upazilas.filter((u) => u.district_id === selectedDistrict.id);
        setFilteredUpazilas(matchingUpazilas);
      } else {
        setFilteredUpazilas([]);
      }
      setFormData((prev) => ({ ...prev, upazila: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview("");
    setFormData({
      name: user?.name || "",
      avatar: user?.avatar || "",
      bloodGroup: user?.bloodGroup || "",
      district: user?.district || "",
      upazila: user?.upazila || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalAvatarUrl = formData.avatar;

      // 1. If user chose a new profile image, upload to ImageBB
      if (avatarFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", avatarFile);

        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          imgFormData
        );
        finalAvatarUrl = imgbbRes.data.data.url;
      }

      // 2. Submit patch profile request
      const updatedProfile = {
        ...formData,
        avatar: finalAvatarUrl,
      };

      await axiosSecure.patch("/api/profile", updatedProfile);

      // 3. Update application context state
      updateUser(updatedProfile);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // Role style selection
  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-red-500",
          icon: <Shield className="w-3.5 h-3.5" />,
          label: "Administrator",
        };
      case "donor":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
          icon: <Heart className="w-3.5 h-3.5 fill-current" />,
          label: "Donor Helper",
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-500",
          icon: <Award className="w-3.5 h-3.5" />,
          label: "Volunteer Coordinator",
        };
    }
  };

  const badge = getRoleBadge(user?.role);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* ─── Profile Header Banner ────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 h-44 shadow-lg border border-slate-800">
        
        {/* Glow orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(239,68,68,0.15),transparent_60%)] pointer-events-none" />
        
        <motion.div
          className="absolute rounded-full bg-red-600/10 filter blur-[40px] pointer-events-none"
          style={{ width: 200, height: 200, top: "20%", left: "50%", transform: "translate(-50%, -50%)" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Heartbeat ECG Line Animation */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 200" preserveAspectRatio="none">
          <motion.path
            d="M 0 100 L 250 100 L 270 60 L 290 140 L 310 100 L 450 100 L 470 40 L 490 160 L 510 100 L 650 100 L 670 60 L 690 140 L 710 100 L 800 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.15 }}
            animate={{ 
              pathLength: [0, 1],
              opacity: [0.15, 0.4, 0.15]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Floating blood drops */}
        {BANNER_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-red-500 to-rose-600"
            style={{
              left: `${p.x}%`,
              top: "100%", // Start at the bottom border of the banner
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px rgba(239,68,68,0.4)",
            }}
            animate={{
              y: [0, -200], // Float up by 200px (higher than banner's 176px height)
              opacity: [0, 0.8, 0.8, 0], // Fade in, remain visible, fade out at top
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
          <div className="text-white space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-600/30 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/20">
              Community Lifesaver
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-1">{user?.name}</h1>
          </div>
          
          {/* Action buttons */}
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 flex items-center gap-2 border border-white/20 hover:scale-102 active:scale-98 transition-all duration-300"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-red-650 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-red-900/40"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Details
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ─── Left Column: Avatar & Summary ────────────────────────────────── */}
        <div className="space-y-6 md:col-span-1">
          <Card className="shadow-md border border-slate-100 bg-white overflow-hidden">
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-5">
              
              {/* Profile Avatar Overlay */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-50 border-4 border-slate-100 ring-4 ring-red-500/20 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:ring-red-500/40">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : formData.avatar ? (
                    <img src={formData.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <Avatar className="w-full h-full">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-red-600 to-rose-700 text-white text-3xl font-bold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {isEditing && (
                  <>
                    <Label
                      htmlFor="profileAvatar"
                      className="absolute inset-0 w-32 h-32 rounded-full bg-black/60 flex flex-col items-center justify-center gap-1 text-white text-xs font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Camera className="w-5 h-5" />
                      Change Photo
                    </Label>
                    <input
                      type="file"
                      id="profileAvatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* User Bio Details */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{user?.name}</h3>
                
                {/* Dynamically styled badge for roles */}
                <div className={`mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                  {badge.icon}
                  {badge.label}
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="w-full border-t border-slate-100" />

              {/* Blood Group Display with Glow */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Registered Blood Group</span>
                <div className="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-rose-50 to-red-50/30 border border-red-100/70 flex flex-col items-center justify-center shadow-sm overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.08),transparent_50%)]" />
                  <Droplet className="w-7 h-7 text-red-500 fill-red-500/10 animate-pulse mb-1 z-10" />
                  <span className="text-xl font-bold text-red-600 z-10 leading-none">{user?.bloodGroup}</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Motivational Mini Card */}
          <Card className="shadow-md border border-slate-100 bg-gradient-to-br from-red-600 to-rose-700 text-white overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-15 transform translate-y-4 translate-x-4 pointer-events-none">
              <Activity className="w-24 h-24 stroke-[1.5px]" />
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <h4 className="font-bold text-sm">Lifesaver Status Active</h4>
              </div>
              <p className="text-xs text-red-50 leading-relaxed font-medium">
                Thank you for being part of our network. Your willingness to donate blood can save lives in critical emergencies. Keep your profile updated so requestors can reach you.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right Column: Profile Fields Form ────────────────────────────── */}
        <Card className="shadow-md border border-slate-100 bg-white md:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">Account Details</CardTitle>
              <CardDescription>Verify your identity and set your primary donation locations.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Email (Never editable) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-slate-50 border-slate-200 text-slate-500 font-medium cursor-not-allowed h-11"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleTextChange}
                    disabled={!isEditing}
                    className={`h-11 font-medium transition-all ${
                      !isEditing 
                        ? "bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed" 
                        : "bg-white border-slate-300 focus:border-red-500 focus:ring-red-500/20"
                    }`}
                  />
                </div>

                {/* Blood Group Selector */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <Droplet className="w-3.5 h-3.5 text-slate-400" />
                    Blood Group
                  </Label>
                  {!isEditing ? (
                    <Input
                      type="text"
                      value={formData.bloodGroup}
                      disabled
                      className="bg-slate-50 border-slate-200 text-slate-650 font-bold cursor-not-allowed h-11"
                    />
                  ) : (
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(val) => handleSelectChange("bloodGroup", val)}
                    >
                      <SelectTrigger className="bg-white border-slate-300 h-11">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    District
                  </Label>
                  {!isEditing ? (
                    <Input
                      type="text"
                      value={formData.district}
                      disabled
                      className="bg-slate-50 border-slate-200 text-slate-600 font-medium cursor-not-allowed h-11"
                    />
                  ) : (
                    <Select
                      value={formData.district}
                      onValueChange={(val) => handleSelectChange("district", val)}
                    >
                      <SelectTrigger className="bg-white border-slate-300 h-11">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d.id} value={d.name}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Upazila */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Upazila
                  </Label>
                  {!isEditing ? (
                    <Input
                      type="text"
                      value={formData.upazila}
                      disabled
                      className="bg-slate-50 border-slate-200 text-slate-600 font-medium cursor-not-allowed h-11"
                    />
                  ) : (
                    <Select
                      value={formData.upazila}
                      onValueChange={(val) => handleSelectChange("upazila", val)}
                      disabled={!formData.district}
                    >
                      <SelectTrigger className="bg-white border-slate-300 h-11">
                        <SelectValue placeholder={formData.district ? "Select Upazila" : "Select District First"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUpazilas.map((u) => (
                          <SelectItem key={u.id} value={u.name}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </div>

          <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
            Account created in cooperation with Bangladesh Red Crescent Society.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
