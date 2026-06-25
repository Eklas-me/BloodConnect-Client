import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Home, User, Droplets, PlusCircle, Users, List, Droplet, LogOut,
} from "lucide-react";

const SidebarLink = ({ to, icon: Icon, label, end = false, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-primary"
      )
    }
  >
    <Icon className="h-4 w-4 shrink-0" />
    <span>{label}</span>
  </NavLink>
);

const SidebarContent = ({ onLinkClick }) => {
  const { user, logout, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const donorLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard Home", end: true },
    { to: "/dashboard/my-donation-requests", icon: List, label: "My Donation Requests" },
    { to: "/dashboard/create-donation-request", icon: PlusCircle, label: "Create Request" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  const adminLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard Home", end: true },
    { to: "/dashboard/all-users", icon: Users, label: "All Users" },
    { to: "/dashboard/all-blood-donation-request", icon: Droplets, label: "All Donation Requests" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  const volunteerLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard Home", end: true },
    { to: "/dashboard/all-blood-donation-request", icon: Droplets, label: "All Donation Requests" },
    { to: "/dashboard/create-donation-request", icon: PlusCircle, label: "Create Request" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  const links = isAdmin ? adminLinks : isVolunteer ? volunteerLinks : donorLinks;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-5 font-bold text-xl text-primary">
        <Droplet className="h-6 w-6 fill-primary" />
        <span>BloodConnect</span>
      </div>

      <Separator />

      {/* Navigation (takes remaining space) */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} onClick={onLinkClick} />
        ))}
      </nav>

      <Separator />

      {/* User profile info & Logout section at the bottom */}
      <div className="p-4 space-y-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{user?.name}</p>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider mt-0.5">
              {user?.role}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-xs border-red-200 text-red-650 hover:bg-red-50 hover:text-red-700 font-semibold gap-2 py-1.5 h-8"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-1 text-[10px] text-muted-foreground border-t border-slate-100">
        © {new Date().getFullYear()} BloodConnect
      </div>
    </div>
  );
};

export default SidebarContent;
