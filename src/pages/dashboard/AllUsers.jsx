import { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  User,
  Filter,
  Loader2,
  Mail,
} from "lucide-react";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const res = await axiosSecure.get("/api/users", { params });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, axiosSecure]);

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await axiosSecure.patch(`/api/users/${userId}/status`, { status: newStatus });
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update user status");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosSecure.patch(`/api/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change user role");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <p className="text-sm text-slate-500">Manage all registered users, roles, and authorization states.</p>
      </div>

      {/* Filter bar */}
      <Card className="shadow-sm border border-slate-150 bg-white">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filter Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="blocked">Blocked Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-slate-400">Total: {users.length} users</span>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card className="shadow-sm border border-slate-150 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-850">Registered Users List</CardTitle>
          <CardDescription>Click the actions menu on each user row to modify status and roles.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No registered users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[80px]">Avatar</TableHead>
                    <TableHead>User Details</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const isSelf = u.email === currentUser.email;

                    return (
                      <TableRow key={u._id}>
                        {/* Avatar */}
                        <TableCell>
                          <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                            <AvatarImage src={u.avatar} alt={u.name} />
                            <AvatarFallback><User className="w-4 h-4 text-slate-400" /></AvatarFallback>
                          </Avatar>
                        </TableCell>

                        {/* Name */}
                        <TableCell className="font-bold text-slate-800">
                          <div className="flex flex-col">
                            <span>{u.name}</span>
                            <span className="text-[10px] text-red-500 font-bold tracking-wider">{u.bloodGroup}</span>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <span className="flex items-center gap-1 text-slate-500 text-sm">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {u.email}
                          </span>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <Badge variant="outline" className={`capitalize font-bold text-[10px] py-0.5 px-2 ${
                            u.role === "admin"
                              ? "border-red-200 text-red-700 bg-red-50"
                              : u.role === "volunteer"
                              ? "border-blue-200 text-blue-700 bg-blue-50"
                              : "border-slate-200 text-slate-700 bg-slate-50"
                          }`}>
                            {u.role}
                          </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge className={`capitalize text-[10px] font-bold py-0.5 px-2 ${
                            u.status === "active"
                              ? "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200"
                              : "bg-red-50 text-red-700 hover:bg-red-50 border border-red-200"
                          }`}>
                            {u.status}
                          </Badge>
                        </TableCell>

                        {/* Action Dropdown Menu */}
                        <TableCell className="text-right">
                          {isSelf ? (
                            <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">Self</span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4.5 w-4.5 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg w-[160px]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Toggle block/unblock */}
                                <DropdownMenuItem onClick={() => handleStatusChange(u._id, u.status)} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:bg-slate-50">
                                  {u.status === "active" ? (
                                    <>
                                      <UserX className="w-4 h-4 text-red-500" />
                                      <span>Block User</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-4 h-4 text-green-600" />
                                      <span>Unblock User</span>
                                    </>
                                  )}
                                </DropdownMenuItem>

                                {/* Elevate to Volunteer */}
                                {u.role !== "volunteer" && (
                                  <DropdownMenuItem onClick={() => handleRoleChange(u._id, "volunteer")} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:bg-slate-50">
                                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                                    <span>Make Volunteer</span>
                                  </DropdownMenuItem>
                                )}

                                {/* Elevate to Admin */}
                                {u.role !== "admin" && (
                                  <DropdownMenuItem onClick={() => handleRoleChange(u._id, "admin")} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:bg-slate-50">
                                    <ShieldAlert className="w-4 h-4 text-red-650" />
                                    <span>Make Admin</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUsers;
