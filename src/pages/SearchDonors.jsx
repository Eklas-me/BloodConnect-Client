import { useState } from "react";
import { districts, upazilas } from "@/data/bangladeshData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Search, FileDown, Mail, Phone, Droplet, User, Loader2, Info } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SearchDonors = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      if (selectedDistrict) {
        const matchingUpazilas = upazilas.filter((u) => u.district_id === selectedDistrict.id);
        setFilteredUpazilas(matchingUpazilas);
      } else {
        setFilteredUpazilas([]);
      }
      setFormData((prev) => ({ ...prev, upazila: "" }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const { bloodGroup, district, upazila } = formData;

    if (!bloodGroup || !district || !upazila) {
      toast.error("Please select all search criteria");
      return;
    }

    setSearching(true);
    try {
      const res = await axios.get(`${API_URL}/api/search/donors`, {
        params: { bloodGroup, district, upazila },
      });
      setDonors(res.data);
      if (res.data.length === 0) {
        toast.info("No matching donors found in this location");
      } else {
        toast.success(`Found ${res.data.length} donor(s)`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!donors || donors.length === 0) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    const tableRows = donors.map((d, index) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${index + 1}</td>
        <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">${d.name}</td>
        <td style="border: 1px solid #ddd; padding: 10px; color: #dc2626; font-weight: bold; text-align: center;">${d.bloodGroup}</td>
        <td style="border: 1px solid #ddd; padding: 10px;">${d.email}</td>
        <td style="border: 1px solid #ddd; padding: 10px;">${d.district}, ${d.upazila}</td>
        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">Active</td>
      </tr>
    `).join("");

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const printHtml = `
      <html>
        <head>
          <title>Blood Donors Search Results</title>
          <style>
            body { font-family: 'Inter', sans-serif; color: #333; padding: 20px; }
            h1 { color: #dc2626; font-size: 24px; margin-bottom: 5px; }
            p { font-size: 14px; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f8fafc; border: 1px solid #ddd; padding: 12px; font-weight: bold; text-align: left; }
            td { font-size: 13px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Blood Donation Platform</h1>
              <p>Search Parameters: Group: ${formData.bloodGroup} | Location: ${formData.upazila}, ${formData.district}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold;">Date: ${dateStr}</p>
              <p style="margin: 0;">Total Records: ${donors.length}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">SL</th>
                <th style="width: 25%;">Donor Name</th>
                <th style="width: 15%; text-align: center;">Blood Group</th>
                <th style="width: 25%;">Email</th>
                <th style="width: 20%;">Location</th>
                <th style="width: 10%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated by Blood Flow Donation Platform. Thank you to all our generous lifesavers.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 100);
            }
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(printHtml);
    doc.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Search for Blood Donors</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Find active donors in your district or upazila. Send them an email or get in touch for assistance.
          </p>
        </div>

        {/* Search Criteria Form */}
        <Card className="shadow-md border border-slate-100 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Filter Location & Blood Group</CardTitle>
            <CardDescription>Select all three fields to execute the search query.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="searchBloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) => handleSelectChange("bloodGroup", val)}
                  required
                >
                  <SelectTrigger id="searchBloodGroup">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="searchDistrict">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(val) => handleSelectChange("district", val)}
                  required
                >
                  <SelectTrigger id="searchDistrict">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upazila */}
              <div className="space-y-2">
                <Label htmlFor="searchUpazila">Upazila</Label>
                <Select
                  value={formData.upazila}
                  onValueChange={(val) => handleSelectChange("upazila", val)}
                  disabled={!formData.district}
                  required
                >
                  <SelectTrigger id="searchUpazila">
                    <SelectValue placeholder={formData.district ? "Select Upazila" : "Select District First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUpazilas.map((u) => (
                      <SelectItem key={u.id} value={u.name}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={searching}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Donors
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Area */}
        {donors === null ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700">Awaiting Search Input</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Use the filter form above to find blood donors in a specific region.
            </p>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700">No Matching Donors</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              We couldn't find any active donors matching group <span className="font-semibold text-slate-600">{formData.bloodGroup}</span> in <span className="font-semibold text-slate-600">{formData.upazila}, {formData.district}</span>.
            </p>
          </div>
        ) : (
          <Card className="shadow-md border border-slate-100 bg-white">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Search Results ({donors.length} found)
                </CardTitle>
                <CardDescription>
                  List of active, registered donors available in the selected area.
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={handleDownloadPDF}
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              {/* Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((d) => (
                  <Card key={d._id} className="border border-slate-150 shadow-sm hover:shadow-md hover:border-red-100 transition-all overflow-hidden bg-white">
                    <div className="p-5 space-y-4">
                      {/* Avatar and Name */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-red-500/20">
                          <AvatarImage src={d.avatar} alt={d.name} />
                          <AvatarFallback><User className="w-5 h-5 text-slate-400" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-slate-800 leading-tight">{d.name}</h4>
                          <span className="text-xs text-slate-400">{d.district}, {d.upazila}</span>
                        </div>
                        <div className="ml-auto w-10 h-10 rounded-full bg-red-50 text-red-600 font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                          {d.bloodGroup}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{d.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>Status: <span className="text-green-600 font-semibold uppercase text-xs">Active</span></span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;
