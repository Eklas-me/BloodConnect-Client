import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  UserPlus,
  Droplets,
  Shield,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 3,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

const fmtNum = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k+`;
  return `${n}+`;
};

const fmtFunding = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k+`;
  return `$${n}`;
};

const Home = () => {
  const { user } = useAuth();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/public-stats`)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Thank you for contacting us! We will get back to you shortly.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex-grow">
      {/* ─── Hero / Banner Section ────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: "linear-gradient(135deg, #0a0a14 0%, #10040a 40%, #1a0510 70%, #0f0a1a 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Animated floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-red-500/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Big glow orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "10%", left: "-10%",
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: "-5%", right: "-5%",
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(153,27,27,0.22) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 900, height: 900,
            background: "radial-gradient(circle, rgba(120,10,30,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Grid overlay for depth */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="space-y-8 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: "rgba(220,38,38,0.12)",
                    border: "1px solid rgba(220,38,38,0.35)",
                    color: "#f87171",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Live Blood Donation Network
                </span>
              </motion.div>

              {/* Headline */}
              <div className="space-y-3">
                <h1
                  className="font-black leading-none tracking-tight"
                  style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05 }}
                >
                  <span className="text-white">Every Drop</span>
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #f97316 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Saves a Life.
                  </span>
                </h1>
                <p className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Bangladesh's most trusted blood donation platform. Connect with verified donors, post emergency requests, and be someone's hero — in minutes.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!user && (
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      asChild
                      className="text-white font-bold px-8 py-6 rounded-xl shadow-2xl text-base w-full sm:w-auto"
                      style={{
                        background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                        boxShadow: "0 0 30px rgba(220,38,38,0.45), 0 4px 20px rgba(0,0,0,0.4)",
                        border: "1px solid rgba(239,68,68,0.4)",
                      }}
                    >
                      <Link to="/register" className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Join as a Donor
                      </Link>
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    asChild
                    className="font-bold px-8 py-6 rounded-xl text-base w-full sm:w-auto"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#e2e8f0",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <Link to="/search" className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Find Donors
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    asChild
                    className="font-bold px-8 py-6 rounded-xl text-base w-full sm:w-auto"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#e2e8f0",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <Link to="/donation-requests" className="flex items-center gap-2">
                      <Droplets className="w-5 h-5" />
                      View Requests
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Mini trust chips */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { icon: Users, text: "5,000+ Active Donors" },
                  { icon: Activity, text: "24/7 Support" },
                  { icon: Shield, text: "Verified & Secure" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 text-red-400" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual — Blood Drop + Glassmorphism Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative flex justify-center items-center"
            >
              {/* Central glow */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 320, height: 320,
                  background: "radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              {/* Blood drop SVG */}
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <svg
                  viewBox="0 0 200 240"
                  width="220"
                  height="264"
                  className="drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 0 40px rgba(220,38,38,0.6))" }}
                >
                  <defs>
                    <radialGradient id="dropGrad" cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="50%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </radialGradient>
                    <radialGradient id="shineGrad" cx="35%" cy="25%" r="40%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  {/* Drop shape */}
                  <path
                    d="M100 10 C100 10, 180 110, 180 155 C180 200, 143 230, 100 230 C57 230, 20 200, 20 155 C20 110, 100 10, 100 10Z"
                    fill="url(#dropGrad)"
                  />
                  {/* Shine overlay */}
                  <path
                    d="M100 10 C100 10, 180 110, 180 155 C180 200, 143 230, 100 230 C57 230, 20 200, 20 155 C20 110, 100 10, 100 10Z"
                    fill="url(#shineGrad)"
                    opacity="0.5"
                  />
                  {/* Cross / heart symbol inside drop */}
                  <text x="75" y="175" fontSize="55" fill="rgba(255,255,255,0.85)">🩸</text>
                </svg>
              </motion.div>

              {/* Floating glass cards around the drop */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="absolute top-0 right-0 rounded-2xl p-4 shadow-2xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  minWidth: 160,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-slate-400 font-medium">Live Donors</span>
                </div>
                <p className="text-2xl font-extrabold text-white">2,482</p>
                <p className="text-xs text-green-400 font-medium mt-0.5">↑ Online now</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="absolute bottom-8 left-0 rounded-2xl p-4 shadow-2xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  minWidth: 170,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
                  <span className="text-xs text-slate-400 font-medium">Lives Saved</span>
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {statsLoading ? "…" : fmtNum(stats?.livesSaved)}
                </p>
                <p className="text-xs text-red-400 font-medium mt-0.5">& counting every day</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                className="absolute bottom-0 right-4 rounded-2xl p-4 shadow-2xl"
                style={{
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  backdropFilter: "blur(16px)",
                  minWidth: 150,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs text-slate-400 font-medium">Funded</span>
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {statsLoading ? "…" : fmtFunding(stats?.totalFunding)}
                </p>
                <p className="text-xs text-orange-400 font-medium mt-0.5">Total raised</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave separator */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0f172a" />
          </svg>
        </div>
      </section>

      {/* ─── Stats Section ──────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-t border-slate-800/50 py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center"
          >
            {[
              {
                value: statsLoading ? "…" : fmtNum(stats?.activeDonors),
                label: "Active Donors",
                icon: Users,
                color: "#ef4444",
              },
              {
                value: statsLoading ? "…" : fmtNum(stats?.totalRequests),
                label: "Requests Processed",
                icon: Activity,
                color: "#ef4444",
              },
              {
                value: statsLoading ? "…" : fmtNum(stats?.livesSaved),
                label: "Lives Saved",
                icon: Heart,
                color: "#ef4444",
              },
              {
                value: "64",
                label: "Districts Connected",
                icon: MapPin,
                color: "#ef4444",
              },
              {
                value: statsLoading ? "…" : fmtFunding(stats?.totalFunding),
                label: "Funding Raised",
                icon: DollarSign,
                color: "#f97316",
              },
            ].map(({ value, label, icon: Icon, color }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                className="group rounded-2xl p-5 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "all 0.3s ease",
                }}
                whileHover={{
                  scale: 1.04,
                  background: "rgba(220,38,38,0.08)",
                  borderColor: "rgba(220,38,38,0.3)",
                }}
              >
                <div className="flex justify-center mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(220,38,38,0.15)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold" style={{ color }}>
                  {value}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it Works (Featured Section) ───────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">How It Works</h2>
            <p className="text-slate-500 text-lg">
              Simplifying the blood donation process into three easy, seamless steps.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">1. Register Account</h3>
                  <p className="text-slate-500 text-sm">
                    Create a profile providing your blood group, contact info, and home address. Keep your status active so users can search and find you.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">2. Request or Search</h3>
                  <p className="text-slate-500 text-sm">
                    Post a public blood donation request specifying recipient name, hospital name, location, and date. Alternatively, search active donors directly.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
                    <Heart className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">3. Save a Life</h3>
                  <p className="text-slate-500 text-sm">
                    A donor accepts the request, visits the hospital, and donates blood. The request status updates to inprogress, and then done once completed.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Extra Featured Section (Core values) ─────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Why Support Blood Donation?
              </h2>
              <p className="text-slate-600 text-lg">
                Blood cannot be manufactured synthetically. It can only come from generous donors like you. Your donation can save up to three lives, help cancer patients under treatment, and support surgeries.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Safe & Protected Data", desc: "Your personal contact details are kept secure." },
                  { title: "Instant Notification", desc: "Fast matching and location-based filters for urgency." },
                  { title: "Transparency", desc: "Clear step-by-step request state monitoring." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-1 flex-shrink-0">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-red-600/10 flex items-center justify-center p-8 border border-slate-200">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg">
                    🩸
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Become a Hero</h3>
                  <p className="text-slate-500 text-sm max-w-sm">
                    No physical strength is required to save a life, only a big heart and 15 minutes of your time.
                  </p>
                  <Button asChild className="bg-slate-950 hover:bg-slate-800 text-white mt-2">
                    <Link to="/donation-requests" className="flex items-center gap-2">
                      View Open Requests
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact Us Section ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Card */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Get in Touch</h2>
            <p className="text-slate-500 text-lg">
              Have questions, issues, or suggestions? Drop us a message, or reach out to our emergency support hotline directly.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Emergency Hotline</h4>
                  <p className="text-lg font-bold text-slate-800">+880 1234 567890</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</h4>
                  <p className="text-lg font-bold text-slate-800">support@bloodflow.org</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main HQ Address</h4>
                  <p className="text-lg font-bold text-slate-800">Zahir Raihan Road, Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Working Hours</h4>
                  <p className="text-lg font-bold text-slate-800">24 Hours / 7 Days a week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg border border-slate-100 p-6 bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              Send Us a Message
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Your Name</Label>
                <Input
                  type="text"
                  id="contact_name"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Address</Label>
                <Input
                  type="email"
                  id="contact_email"
                  placeholder="john@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_message">Your Message</Label>
                <Textarea
                  id="contact_message"
                  placeholder="Write your message here..."
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
