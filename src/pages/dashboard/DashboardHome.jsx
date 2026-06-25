import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  FileText,
  Activity,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Heart,
  Calendar,
  Clock,
  MapPin,
  ListCollapse,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from "recharts";

const DashboardHome = () => {
  const { user, isAdmin, isVolunteer } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Donor states
  const [recentRequests, setRecentRequests] = useState([]);
  const [donorLoading, setDonorLoading] = useState(!isAdmin && !isVolunteer);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Admin/Volunteer states
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(isAdmin || isVolunteer);
  const [chartData, setChartData] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    if (isAdmin || isVolunteer) {
      const fetchAdminStats = async () => {
        try {
          const res = await axiosSecure.get("/api/stats");
          setStats(res.data);

          // Get chart data by grouping requests status (simulated grouping based on overall numbers or simple query)
          // Since the stats API gives total numbers, let's fetch requests to construct an exact chart,
          // or construct a neat status chart. Let's make an API call to get status details.
          const reqRes = await axiosSecure.get("/api/all-donation-requests", {
            params: { limit: 100 },
          });
          const allReqs = reqRes.data.requests || [];
          const statusCounts = allReqs.reduce(
            (acc, curr) => {
              acc[curr.status] = (acc[curr.status] || 0) + 1;
              return acc;
            },
            { pending: 0, inprogress: 0, done: 0, canceled: 0 }
          );

          setChartData([
            { name: "Pending", count: statusCounts.pending, color: "#f59e0b" },
            { name: "In Progress", count: statusCounts.inprogress, color: "#3b82f6" },
            { name: "Done", count: statusCounts.done, color: "#22c55e" },
            { name: "Canceled", count: statusCounts.canceled, color: "#64748b" },
          ]);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load dashboard statistics");
        } finally {
          setStatsLoading(false);
        }
      };
      fetchAdminStats();
    } else {
      const fetchRecentRequests = async () => {
        try {
          const res = await axiosSecure.get("/api/my-donation-requests/recent");
          setRecentRequests(res.data);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load recent requests");
        } finally {
          setDonorLoading(false);
        }
      };
      fetchRecentRequests();
    }
  }, [isAdmin, isVolunteer, axiosSecure]);

  // Handle status update (done / canceled)
  const handleStatusUpdate = async (reqId, newStatus) => {
    try {
      await axiosSecure.patch(`/api/donation-requests/${reqId}/status`, {
        status: newStatus,
      });
      toast.success(`Donation marked as ${newStatus}`);
      // Refresh local requests
      const res = await axiosSecure.get("/api/my-donation-requests/recent");
      setRecentRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Handle donation request delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axiosSecure.delete(`/api/donation-requests/${deleteId}`);
      toast.success("Request deleted successfully");
      setDeleteOpen(false);
      // Refresh
      const res = await axiosSecure.get("/api/my-donation-requests/recent");
      setRecentRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Render Admin / Volunteer View
  if (isAdmin || isVolunteer) {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome Back, {user?.name}!
          </h1>
          <p className="text-slate-500 mt-1">
            You are logged in as an <span className="font-bold text-red-600 uppercase text-xs bg-red-50 px-2 py-0.5 rounded-full border border-red-100">{user?.role}</span>.
          </p>
        </div>

        {statsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin text-red-600" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat 1: Users */}
              <Card className="shadow-sm border border-slate-150 bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Donors</span>
                    <h3 className="text-3xl font-black text-slate-800">{stats?.totalDonors || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Stat 2: Funding */}
              <Card className="shadow-sm border border-slate-150 bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Funds</span>
                    <h3 className="text-3xl font-black text-slate-800">
                      ${stats?.totalFunding ? stats.totalFunding.toLocaleString() : "0"}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Stat 3: Requests */}
              <Card className="shadow-sm border border-slate-150 bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Donation Requests</span>
                    <h3 className="text-3xl font-black text-slate-800">{stats?.totalRequests || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts section (Optional Task Completed!) */}
            <Card className="shadow-sm border border-slate-150 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-850">Donation Requests Statistics</CardTitle>
                <CardDescription>Visual distribution of blood requests by current statuses.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {chartData.length === 0 || chartData.every(c => c.count === 0) ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    No request data to render chart representation.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: "#f8fafc" }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // Render Donor View
  return (
    <div className="space-y-8">
      {/* Welcome & Create Button Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome, {user?.name}!
          </h1>
          <p className="text-slate-500 mt-1">Review your recent requests and manage your blood donation workflow.</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 shadow-sm">
          <Link to="/dashboard/create-donation-request">
            <PlusCircle className="w-4 h-4" />
            Create Request
          </Link>
        </Button>
      </div>

      {donorLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin text-red-600" />
        </div>
      ) : recentRequests.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-xl border border-slate-150 shadow-sm flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-lg">No Blood Donation Requests Created Yet</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              If you or anyone you know requires blood urgently, create a public donation request now.
            </p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold">
            <Link to="/dashboard/create-donation-request">Create Donation Request</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Table Card */}
          <Card className="shadow-sm border border-slate-150 bg-white">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold text-slate-850">Recent Donation Requests</CardTitle>
                <CardDescription>Your 3 most recent requests made on this account.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="border-slate-350 hover:bg-slate-50 flex items-center gap-1">
                <Link to="/dashboard/my-donation-requests">
                  <ListCollapse className="w-3.5 h-3.5" />
                  View All Requests
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead>Recipient</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-center">Group</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Donor Info</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((req) => (
                      <TableRow key={req._id}>
                        {/* Recipient */}
                        <TableCell className="font-bold text-slate-800">{req.recipientName}</TableCell>

                        {/* Location */}
                        <TableCell>
                          <span className="flex items-center gap-1 text-slate-500 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {req.recipientUpazila}, {req.recipientDistrict}
                          </span>
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span>{req.donationDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span>{req.donationTime}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Group */}
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-red-200 text-red-650 bg-red-50/20 font-bold">
                            {req.bloodGroup}
                          </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {req.status === "pending" && <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 uppercase text-[10px] font-bold">Pending</Badge>}
                          {req.status === "inprogress" && <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 uppercase text-[10px] font-bold">In Progress</Badge>}
                          {req.status === "done" && <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 uppercase text-[10px] font-bold">Done</Badge>}
                          {req.status === "canceled" && <Badge className="bg-slate-50 text-slate-700 hover:bg-slate-50 border border-slate-200 uppercase text-[10px] font-bold">Canceled</Badge>}
                        </TableCell>

                        {/* Donor info */}
                        <TableCell>
                          {req.status === "inprogress" && req.donorName ? (
                            <div className="text-xs space-y-0.5 text-slate-500">
                              <p className="font-bold text-slate-700">{req.donorName}</p>
                              <p className="truncate max-w-[120px] text-slate-400">{req.donorEmail}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-normal">—</span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* In-progress donor completion control buttons */}
                            {req.status === "inprogress" && (
                              <>
                                <Button
                                  size="xs"
                                  onClick={() => handleStatusUpdate(req._id, "done")}
                                  className="bg-green-600 hover:bg-green-700 text-white font-medium p-1.5 h-7 w-7 rounded-md flex items-center justify-center shadow-sm"
                                  title="Mark as Done"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="xs"
                                  onClick={() => handleStatusUpdate(req._id, "canceled")}
                                  className="bg-red-650 hover:bg-red-705 text-white font-medium p-1.5 h-7 w-7 rounded-md flex items-center justify-center shadow-sm"
                                  title="Cancel Donation"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}

                            {/* View details */}
                            <Button asChild size="xs" variant="outline" className="border-slate-350 p-1.5 h-7 w-7 rounded-md flex items-center justify-center hover:bg-slate-50">
                              <Link to={`/donation-request/${req._id}`} title="View Details">
                                <Eye className="w-4 h-4 text-slate-500" />
                              </Link>
                            </Button>

                            {/* Edit request */}
                            <Button asChild size="xs" variant="outline" className="border-slate-350 p-1.5 h-7 w-7 rounded-md flex items-center justify-center hover:bg-slate-50">
                              <Link to={`/dashboard/edit-donation-request/${req._id}`} title="Edit Request">
                                <Edit2 className="w-4 h-4 text-slate-500" />
                              </Link>
                            </Button>

                            {/* Delete request */}
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => {
                                setDeleteId(req._id);
                                setDeleteOpen(true);
                              }}
                              className="border-slate-350 hover:bg-slate-50 p-1.5 h-7 w-7 rounded-md flex items-center justify-center"
                              title="Delete Request"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Delete Dialog Confirmation */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="max-w-md bg-white border border-slate-200 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800">Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you absolutely sure you want to delete this donation request? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0 mt-4">
                <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                  Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} disabled={deleting} className="bg-red-650 hover:bg-red-705 text-white font-semibold flex items-center gap-1.5">
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Confirm Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
