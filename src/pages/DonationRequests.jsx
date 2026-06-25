import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Droplet, MapPin, Calendar, Clock, Loader2, Hospital, ArrowRight, Activity } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/donation-requests`);
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blood donation requests");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Pending Blood Donation Requests
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Urgent requests from people in need of blood. Review details and consider donating if you are a match.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin text-red-600" />
              <p className="text-slate-400 text-sm">Loading requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-700 text-xl">No Pending Requests</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              All blood donation requests have been fulfilled! Check back later or create a request if you need one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <Card
                key={req._id}
                className="border border-slate-150 shadow-sm hover:shadow-lg hover:border-red-200 transition-all flex flex-col justify-between overflow-hidden bg-white group"
              >
                <div className="relative">
                  {/* Blood Group Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 font-extrabold flex flex-col items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Need</span>
                    <span className="leading-tight">{req.bloodGroup}</span>
                  </div>

                  <CardHeader className="pb-3 pr-20">
                    <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1">
                      {req.recipientName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Hospital className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{req.hospitalName}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-6 text-sm text-slate-500">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Recipient Location</p>
                        <p className="text-xs text-slate-400">{req.recipientUpazila}, {req.recipientDistrict}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-600">{req.donationDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-600">{req.donationTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-3 flex justify-end">
                  <Button
                    asChild
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 text-xs"
                  >
                    <Link to={`/donation-request/${req._id}`}>
                      View Details
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;
