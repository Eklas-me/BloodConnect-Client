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
  Calendar,
  Shield,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

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
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        {/* Background blobs for premium glass look */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-700 rounded-full filter blur-3xl opacity-10 animate-pulse" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              <Droplets className="w-4 h-4 fill-current text-red-500 animate-pulse" />
              Saves Lives, Give Blood
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
              Your Blood Can <br />
              <span className="text-red-500">Save a Life Today</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
              Every drop counts. Join our community of lifesavers. Request blood during emergencies, find matching active donors nearby, or donate to support our blood bank network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!user && (
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 rounded-md shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 text-md"
                >
                  <Link to="/register">
                    <UserPlus className="w-5 h-5" />
                    Join as a Donor
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white font-semibold px-8 py-6 rounded-md transition-all flex items-center gap-2 text-md"
              >
                <Link to="/search">
                  <Search className="w-5 h-5" />
                  Search Donors
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-red-600/20 to-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-start">
                <Heart className="w-12 h-12 text-red-500 fill-current" />
                <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                  Emergency Support
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-2xl font-bold leading-snug">
                  "Only 10 minutes of your time can add years to someone's life."
                </p>
                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <span className="text-xs text-slate-400">Available Donors Online</span>
                  </div>
                  <span className="text-sm font-bold text-red-500">2,482 active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ──────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-t border-slate-800 py-10 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-red-500">5k+</h3>
            <p className="text-sm text-slate-400">Active Donors</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-red-500">12k+</h3>
            <p className="text-sm text-slate-400">Requests Processed</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-red-500">8k+</h3>
            <p className="text-sm text-slate-400">Success Stories</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-red-500">64</h3>
            <p className="text-sm text-slate-400">Districts Connected</p>
          </div>
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
