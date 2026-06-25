import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Droplets, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const navLinks = [
  { to: "/donation-requests", label: "Donation Requests" },
];

const Navbar = () => {
  const { user, logout, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Set initial state in case page is loaded mid-scroll
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Determine visual mode:
  // transparent = home page AND not yet scrolled
  const isTransparent = isHome && !scrolled;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500"
      style={{
        background: isTransparent
          ? "transparent"
          : "rgba(9, 9, 18, 0.85)",
        backdropFilter: isTransparent ? "none" : "blur(20px)",
        borderBottom: isTransparent
          ? "1px solid transparent"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isTransparent
          ? "none"
          : "0 4px 30px rgba(0,0,0,0.4)",
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
          >
            <Droplets className="h-5 w-5 text-white fill-white" />
          </div>
          <span
            className="hidden sm:block"
            style={{
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Blood<span style={{ color: "#f87171" }}>Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-red-400"
                    : isTransparent
                    ? "text-slate-200 hover:text-white"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/funding"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-red-400"
                    : isTransparent
                    ? "text-slate-200 hover:text-white"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              Funding
            </NavLink>
          )}
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-red-400"
                  : isTransparent
                  ? "text-slate-200 hover:text-white"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            Find Donors
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden md:inline-flex text-slate-200 hover:text-white hover:bg-white/10"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="hidden md:inline-flex font-semibold"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "white",
                  boxShadow: "0 0 20px rgba(220,38,38,0.3)",
                }}
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-red-500/30 hover:ring-red-500/70 transition-all">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-red-600/20 text-red-300 font-semibold text-sm border border-red-500/30">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
                style={{
                  background: "rgba(15,15,30,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer text-slate-200 focus:text-white focus:bg-white/10">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64"
              style={{
                background: "rgba(10,10,20,0.97)",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-slate-200 hover:text-white transition-colors py-2"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  to="/search"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-slate-200 hover:text-white transition-colors py-2"
                >
                  Find Donors
                </Link>
                {user && (
                  <Link
                    to="/funding"
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-slate-200 hover:text-white transition-colors py-2"
                  >
                    Funding
                  </Link>
                )}
                {!user ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                    >
                      <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button
                      asChild
                      style={{
                        background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                        color: "white",
                      }}
                    >
                      <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                    >
                      <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button
                      className="bg-red-600/80 hover:bg-red-600 text-white"
                      onClick={() => { handleLogout(); setOpen(false); }}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
