import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Droplet, MapPin, Calendar, Clock, Loader2, Hospital, User, Mail, MessageSquare, ArrowLeft, Heart, CheckCircle2, AlertTriangle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosSecure.get(`/api/donation-requests/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load donation request details");
        navigate("/donation-requests");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, axiosSecure, navigate]);

  const handleConfirmDonation = async () => {
    setDonating(true);
    try {
      await axiosSecure.patch(`/api/donation-requests/${id}/donate`, {
        donorName: user.name,
        donorEmail: user.email,
      });

      toast.success("Thank you! Donation accepted successfully.");
      setConfirmOpen(false);
      const res = await axiosSecure.get(`/api/donation-requests/${id}`);
      setRequest(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to confirm donation");
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin text-red-600" />
          <p className="text-slate-400 text-sm">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) return null;

  const isPending = request.status === "pending";
  const isInProgress = request.status === "inprogress";
  const isDone = request.status === "done";
  const isCanceled = request.status === "canceled";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link to="/donation-requests" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Donation Requests
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Columns */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md border border-slate-100 bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">Blood Donation Request</span>
                  <CardTitle className="text-2xl font-bold text-slate-800 mt-1">{request.recipientName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <Hospital className="w-3.5 h-3.5" />
                    {request.hospitalName}
                  </CardDescription>
                </div>
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-100 font-extrabold flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Group</span>
                  <span className="text-lg leading-tight">{request.bloodGroup}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Details list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-400 font-normal">Location (District & Upazila)</Label>
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {request.recipientUpazila}, {request.recipientDistrict}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-400 font-normal">Full Address</Label>
                    <p className="text-slate-700 font-medium">{request.fullAddress}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-400 font-normal">Date Needed</Label>
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-red-500" />
                      {request.donationDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-400 font-normal">Time Needed</Label>
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-red-500" />
                      {request.donationTime}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <Label className="text-slate-400 font-normal">Request Message (Details)</Label>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm leading-relaxed whitespace-pre-line">
                    {request.requestMessage || "No message provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Donor Info (If Status is In Progress or Done) */}
            {(isInProgress || isDone) && (
              <Card className="border border-green-100 bg-green-50/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600 fill-current" />
                    Donor Assigned Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-slate-400">Name</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      {request.donorName || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Email</span>
                    <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {request.donorEmail || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Status & Action */}
          <div className="space-y-6">
            <Card className="shadow-md border border-slate-100 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">Status & Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status indicator */}
                <div className="space-y-2">
                  <Label className="text-slate-400 font-normal">Current Status</Label>
                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        In Progress
                      </span>
                    )}
                    {isDone && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                    {isCanceled && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                        Canceled
                      </span>
                    )}
                  </div>
                </div>

                {/* Requester Info */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <Label className="text-slate-400 font-normal">Requested By</Label>
                  <div className="space-y-1.5 text-sm">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      {request.requesterName}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {request.requesterEmail}
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* Action Button */}
              {isPending && (
                <CardFooter className="border-t border-slate-100 pt-4 bg-slate-50/50 py-4 flex justify-center">
                  <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2">
                        Donate Blood
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white border border-slate-200 shadow-xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-800">Confirm Donation</DialogTitle>
                        <DialogDescription>
                          By clicking confirm, you agree to donate blood at the specified time and location.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4 border-t border-b border-slate-100">
                        <div className="space-y-1.5">
                          <Label htmlFor="donorName">Donor Name</Label>
                          <Input id="donorName" value={user.name} readOnly className="bg-slate-50 cursor-not-allowed" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="donorEmail">Donor Email</Label>
                          <Input id="donorEmail" value={user.email} readOnly className="bg-slate-50 cursor-not-allowed" />
                        </div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={donating}>
                          Cancel
                        </Button>
                        <Button onClick={handleConfirmDonation} disabled={donating} className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2">
                          {donating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Confirm Donation"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;
