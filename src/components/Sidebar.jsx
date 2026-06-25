import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Home, User, Droplets, PlusCircle, Users, List, Droplet,
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
  const { user, isAdmin, isVolunteer } = useAuth();

  // Donor links
  const donorLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard Home", end: true },
    { to: "/dashboard/my-donation-requests", icon: List, label: "My Donation Requests" },
    { to: "/dashboard/create-donation-request", icon: PlusCircle, label: "Create Request" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  // Admin links
  const adminLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard Home", end: true },
    { to: "/dashboard/all-users", icon: Users, label: "All Users" },
    { to: "/dashboard/all-blood-donation-request", icon: Droplets, label: "All Donation Requests" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  // Volunteer links
  const volunteerLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard Home", end: true },
    { to: "/dashboard/all-blood-donation-request", icon: Droplets, label: "All Donation Requests" },
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

      {/* User info */}
      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
          Logged in as
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
          {user?.role}
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} onClick={onLinkClick} />
        ))}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="px-4 py-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} BloodConnect
      </div>
    </div>
  );
};

export default SidebarContent;
