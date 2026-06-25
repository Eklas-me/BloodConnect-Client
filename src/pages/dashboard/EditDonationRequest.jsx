import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { districts, upazilas } from "@/data/bangladeshData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft, User, Mail, MapPin, Hospital, Clock, Calendar, MessageSquare } from "lucide-react";

const EditDonationRequest = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch current request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const res = await axiosSecure.get(`/api/donation-requests/${id}`);
        const requestData = res.data;

        // Populate form data
        setFormData({
          recipientName: requestData.recipientName || "",
          recipientDistrict: requestData.recipientDistrict || "",
          recipientUpazila: requestData.recipientUpazila || "",
          hospitalName: requestData.hospitalName || "",
          fullAddress: requestData.fullAddress || "",
          bloodGroup: requestData.bloodGroup || "",
          donationDate: requestData.donationDate || "",
          donationTime: requestData.donationTime || "",
          requestMessage: requestData.requestMessage || "",
        });

        // Filter upazilas based on fetched district
        if (requestData.recipientDistrict) {
          const selectedDistrict = districts.find((d) => d.name === requestData.recipientDistrict);
          if (selectedDistrict) {
            setFilteredUpazilas(upazilas.filter((u) => u.district_id === selectedDistrict.id));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load donation request data");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDetails();
  }, [id, axiosSecure, navigate]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "recipientDistrict") {
      const selectedDistrict = districts.find((d) => d.name === value);
      if (selectedDistrict) {
        const matchingUpazilas = upazilas.filter((u) => u.district_id === selectedDistrict.id);
        setFilteredUpazilas(matchingUpazilas);
      } else {
        setFilteredUpazilas([]);
      }
      setFormData((prev) => ({ ...prev, recipientUpazila: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      recipientName, recipientDistrict, recipientUpazila,
      hospitalName, fullAddress, bloodGroup, donationDate,
      donationTime, requestMessage
    } = formData;

    if (
      !recipientName || !recipientDistrict || !recipientUpazila ||
      !hospitalName || !fullAddress || !bloodGroup || !donationDate ||
      !donationTime || !requestMessage
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.patch(`/api/donation-requests/${id}`, {
        recipientName,
        recipientDistrict,
        recipientUpazila,
        hospitalName,
        fullAddress,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
      });

      toast.success("Donation request updated successfully!");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update donation request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin text-red-600" />
          <p className="text-slate-400 text-sm">Loading request data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Donation Request</h1>
        <p className="text-sm text-slate-500">Modify details of this blood donation request.</p>
      </div>

      <Card className="shadow-sm border border-slate-150 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Request Form</CardTitle>
          <CardDescription>All fields are required unless marked optional.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Requester Fields (Read only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <User className="w-3.5 h-3.5" />
                  Requester Name
                </Label>
                <Input value={user?.name || ""} disabled className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  Requester Email
                </Label>
                <Input value={user?.email || ""} disabled className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed text-xs" />
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recipient Name */}
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  placeholder="Patient Name"
                  value={formData.recipientName}
                  onChange={handleTextChange}
                  required
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-1.5">
                <Label htmlFor="bloodGroup">Blood Group Required</Label>
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

              {/* Hospital Name */}
              <div className="space-y-1.5">
                <Label htmlFor="hospitalName" className="flex items-center gap-1.5">
                  <Hospital className="w-4 h-4 text-slate-400" />
                  Hospital Name
                </Label>
                <Input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={formData.hospitalName}
                  onChange={handleTextChange}
                  required
                />
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <Label htmlFor="recipientDistrict" className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Recipient District
                </Label>
                <Select
                  value={formData.recipientDistrict}
                  onValueChange={(val) => handleSelectChange("recipientDistrict", val)}
                  required
                >
                  <SelectTrigger id="recipientDistrict">
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
              <div className="space-y-1.5">
                <Label htmlFor="recipientUpazila" className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Recipient Upazila
                </Label>
                <Select
                  value={formData.recipientUpazila}
                  onValueChange={(val) => handleSelectChange("recipientUpazila", val)}
                  disabled={!formData.recipientDistrict}
                  required
                >
                  <SelectTrigger id="recipientUpazila">
                    <SelectValue placeholder={formData.recipientDistrict ? "Select Upazila" : "Select District First"} />
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

              {/* Full Address */}
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="fullAddress">Full Address Line</Label>
                <Input
                  type="text"
                  id="fullAddress"
                  name="fullAddress"
                  placeholder="e.g. Zahir Raihan Rd, Dhaka"
                  value={formData.fullAddress}
                  onChange={handleTextChange}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <Label htmlFor="donationDate" className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Donation Date
                </Label>
                <Input
                  type="date"
                  id="donationDate"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleTextChange}
                  required
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <Label htmlFor="donationTime" className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Donation Time
                </Label>
                <Input
                  type="time"
                  id="donationTime"
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleTextChange}
                  required
                />
              </div>
            </div>

            {/* Request Message */}
            <div className="space-y-1.5">
              <Label htmlFor="requestMessage" className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Request Message (Why is blood needed?)
              </Label>
              <Textarea
                id="requestMessage"
                name="requestMessage"
                rows={4}
                placeholder="Describe details about the emergency, patient status, etc."
                value={formData.requestMessage}
                onChange={handleTextChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-slate-100/50 pt-4 mt-4 py-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Request
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditDonationRequest;
