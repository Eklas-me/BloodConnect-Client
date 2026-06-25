import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { districts, upazilas } from "@/data/bangladeshData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Droplet, Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const Register = () => {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic upazila list based on selected district
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select values
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "district") {
      // Find district ID from the name
      const selectedDistrict = districts.find((d) => d.name === value);
      if (selectedDistrict) {
        const matchingUpazilas = upazilas.filter((u) => u.district_id === selectedDistrict.id);
        setFilteredUpazilas(matchingUpazilas);
      } else {
        setFilteredUpazilas([]);
      }
      // Reset upazila select
      setFormData((prev) => ({ ...prev, upazila: "" }));
    }
  };

  // Handle avatar file selection
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

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, bloodGroup, district, upazila, password, confirmPassword } = formData;

    // Client-side validations
    if (!name || !email || !bloodGroup || !district || !upazila || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!avatarFile) {
      toast.error("Please upload an avatar image");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to ImageBB
      const imgFormData = new FormData();
      imgFormData.append("image", avatarFile);

      let avatarUrl = "";
      try {
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          imgFormData
        );
        avatarUrl = imgbbRes.data.data.url;
      } catch (err) {
        console.error("ImageBB upload failed:", err);
        throw new Error("Failed to upload avatar image. Please check API key.");
      }

      // 2. Call register API from AuthContext
      await register({
        name,
        email,
        bloodGroup,
        district,
        upazila,
        password,
        avatar: avatarUrl,
      });

      toast.success("Account created successfully! Welcome.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-t-4 border-red-600 bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center text-red-600 animate-pulse">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">Join as a Donor</CardTitle>
          <CardDescription className="text-slate-500">
            Create an account to request blood, find matches, and donate.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <Droplet className="w-8 h-8 text-slate-400 fill-current" />
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <Label htmlFor="avatar" className="cursor-pointer bg-white px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-500" />
                  Upload Profile Pic
                </Label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-xs text-slate-400">Max size 2MB. JPG, PNG</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) => handleSelectChange("bloodGroup", val)}
                  required
                >
                  <SelectTrigger id="bloodGroup">
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
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(val) => handleSelectChange("district", val)}
                  required
                >
                  <SelectTrigger id="district">
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
              </div>

              {/* Upazila */}
              <div className="space-y-2">
                <Label htmlFor="upazila">Upazila</Label>
                <Select
                  value={formData.upazila}
                  onValueChange={(val) => handleSelectChange("upazila", val)}
                  disabled={!formData.district}
                  required
                >
                  <SelectTrigger id="upazila">
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
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register Now"
              )}
            </Button>
            <p className="text-sm text-slate-500 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 hover:underline font-semibold">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
