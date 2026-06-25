import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { PlusCircle, Loader2, User, Mail, MapPin, Hospital, Clock, Calendar, MessageSquare, AlertTriangle } from "lucide-react";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const isBlocked = user?.status === "blocked";

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
  const [submitting, setSubmitting] = useState(false);

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

    if (isBlocked) {
      toast.error("Blocked users are restricted from creating blood donation requests.");
      return;
    }

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
      toast.error("Please fill in all the fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.post("/api/donation-requests", {
        requesterName: user.name,
        requesterEmail: user.email,
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

      toast.success("Blood donation request created successfully!");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create donation request");
    } finally {
      setSubmitting(false);
    }
  };

  if (isBlocked) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Card className="border border-red-200 shadow-md bg-red-50/20 text-center">
          <CardHeader className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-650 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-bold text-red-800">Account Restricted</CardTitle>
            <CardDescription className="text-slate-500 max-w-sm">
              Your account status is currently set to <strong>blocked</strong>. Blocked users cannot create any blood donation requests.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center border-t border-red-100/50 pt-6">
            <p className="text-xs text-slate-400">Please contact administrative support to appeal your restriction.</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create Donation Request</h1>
        <p className="text-sm text-slate-500">Provide hospital details and patient location to request blood.</p>
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
                  Creating Request...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateDonationRequest;
