import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Filter,
} from "lucide-react";

const AllBloodDonationRequests = () => {
  const { isAdmin, isVolunteer } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5;

  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const res = await axiosSecure.get("/api/all-donation-requests", { params });
      setRequests(res.data.requests);
      setTotalItems(res.data.total);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blood donation requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [page, statusFilter, axiosSecure]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleStatusUpdate = async (reqId, newStatus) => {
    try {
      await axiosSecure.patch(`/api/donation-requests/${reqId}/status`, {
        status: newStatus,
      });
      toast.success(`Donation status updated to ${newStatus}`);
      fetchAllRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update donation status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axiosSecure.delete(`/api/donation-requests/${deleteId}`);
      toast.success("Request deleted successfully");
      setDeleteOpen(false);
      if (requests.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchAllRequests();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete donation request");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">All Blood Donation Requests</h1>
        <p className="text-sm text-slate-500">
          {isAdmin ? "Admin view: Full authorization to manage and delete requests." : "Volunteer view: Authorized to review and update request statuses."}
        </p>
      </div>

      {/* Filter toolbar */}
      <Card className="shadow-sm border border-slate-150 bg-white">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filter Status:</span>
            <Select value={statusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-slate-400">Total requests: {totalItems}</span>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="shadow-sm border border-slate-150 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-850">Global Requests List</CardTitle>
          <CardDescription>
            {isVolunteer && "Volunteers are restricted to updating the status and viewing details only."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No matching blood requests found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead>Recipient</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-center">Group</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Donor Information</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req._id}>
                        {/* Name */}
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

                        {/* Requester */}
                        <TableCell>
                          <div className="text-xs space-y-0.5 text-slate-500">
                            <p className="font-semibold text-slate-700">{req.requesterName}</p>
                            <p className="truncate max-w-[100px] text-slate-400">{req.requesterEmail}</p>
                          </div>
                        </TableCell>

                        {/* Donor Info */}
                        <TableCell>
                          {req.donorName ? (
                            <div className="text-xs space-y-0.5 text-slate-500">
                              <p className="font-bold text-slate-700">{req.donorName}</p>
                              <p className="truncate max-w-[100px] text-slate-400">{req.donorEmail}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-normal">—</span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* In-progress controls (both Admin and Volunteer are allowed to change status) */}
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

                            {/* View details (both allowed) */}
                            <Button asChild size="xs" variant="outline" className="border-slate-350 p-1.5 h-7 w-7 rounded-md flex items-center justify-center hover:bg-slate-50">
                              <Link to={`/donation-request/${req._id}`} title="View Details">
                                <Eye className="w-4 h-4 text-slate-500" />
                              </Link>
                            </Button>

                            {/* Edit request (ADMIN ONLY) */}
                            {isAdmin && (
                              <Button asChild size="xs" variant="outline" className="border-slate-350 p-1.5 h-7 w-7 rounded-md flex items-center justify-center hover:bg-slate-50">
                                <Link to={`/dashboard/edit-donation-request/${req._id}`} title="Edit Request">
                                  <Edit2 className="w-4 h-4 text-slate-500" />
                                </Link>
                              </Button>
                            )}

                            {/* Delete request (ADMIN ONLY) */}
                            {isAdmin && (
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
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="border-slate-300 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="border-slate-300 flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog Confirmation (Admin only) */}
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
            <Button onClick={handleDeleteConfirm} disabled={deleting} className="bg-red-650 hover:bg-red-755 text-white font-semibold flex items-center gap-1.5">
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
  );
};

export default AllBloodDonationRequests;
