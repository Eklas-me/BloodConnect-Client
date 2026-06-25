import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { districts, upazilas } from "@/data/bangladeshData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Edit3, Save, User, Mail, Droplet, MapPin, Upload, Loader2, X } from "lucide-react";
import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-sm text-slate-500">Manage your account information and location settings.</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-slate-350 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <Card className="shadow-sm border border-slate-150 bg-white md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-red-500/20 shadow-inner flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : formData.avatar ? (
                <img src={formData.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-300" />
              )}
            </div>

            {isEditing && (
              <div className="space-y-1">
                <Label htmlFor="profileAvatar" className="cursor-pointer text-xs font-semibold text-red-600 hover:underline flex items-center justify-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </Label>
                <input
                  type="file"
                  id="profileAvatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{user?.name}</h3>
              <p className="text-xs text-slate-400 capitalize mt-1">Role: <span className="font-semibold">{user?.role}</span></p>
            </div>

            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-600 font-extrabold flex flex-col items-center justify-center shadow-inner">
              <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Group</span>
              <span className="text-lg leading-tight">{user?.bloodGroup}</span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Profile Form */}
        <Card className="shadow-sm border border-slate-150 bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Account Details</CardTitle>
            <CardDescription>Personal registration values and geocode address records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email (Never editable) */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
              </Label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-slate-50 border-slate-200 cursor-not-allowed text-slate-500"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-slate-500 font-medium">
                <User className="w-4 h-4 text-slate-400" />
                Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50 border-slate-150 text-slate-700 cursor-not-allowed" : "bg-white"}
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Droplet className="w-4 h-4 text-slate-400" />
                Blood Group
              </Label>
              {!isEditing ? (
                <Input
                  type="text"
                  value={formData.bloodGroup}
                  disabled
                  className="bg-slate-50 border-slate-150 text-slate-700 cursor-not-allowed font-semibold"
                />
              ) : (
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) => handleSelectChange("bloodGroup", val)}
                >
                  <SelectTrigger className="bg-white">
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
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                District
              </Label>
              {!isEditing ? (
                <Input
                  type="text"
                  value={formData.district}
                  disabled
                  className="bg-slate-50 border-slate-150 text-slate-700 cursor-not-allowed"
                />
              ) : (
                <Select
                  value={formData.district}
                  onValueChange={(val) => handleSelectChange("district", val)}
                >
                  <SelectTrigger className="bg-white">
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
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                Upazila
              </Label>
              {!isEditing ? (
                <Input
                  type="text"
                  value={formData.upazila}
                  disabled
                  className="bg-slate-50 border-slate-150 text-slate-700 cursor-not-allowed"
                />
              ) : (
                <Select
                  value={formData.upazila}
                  onValueChange={(val) => handleSelectChange("upazila", val)}
                  disabled={!formData.district}
                >
                  <SelectTrigger className="bg-white">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
