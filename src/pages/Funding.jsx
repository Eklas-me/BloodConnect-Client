import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Heart, DollarSign, Calendar, User, Key, Loader2, AlertCircle } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card == null) return;

    setProcessing(true);
    setError(null);

    try {
      const { data } = await axiosSecure.post("/api/create-payment-intent", { amount });
      const clientSecret = data.clientSecret;

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: user?.name || "Anonymous",
              email: user?.email || "anonymous@example.com",
            },
          },
        }
      );

      if (confirmError) {
        console.error(confirmError);
        setError(confirmError.message);
        toast.error(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/api/funds", {
          userName: user.name,
          userEmail: user.email,
          amount,
          transactionId: paymentIntent.id,
        });

        toast.success(`Thank you! Successfully donated $${amount}.`);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment processing failed");
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label className="text-slate-500 font-normal">Donation Amount (USD)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            value={`$${amount}`}
            disabled
            className="pl-9 bg-slate-50 font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="space-y-2 border border-slate-100 p-4 rounded-lg bg-slate-50/50">
        <Label className="text-slate-600 font-semibold mb-2 block">Card Information</Label>
        <div className="bg-white p-3 border border-slate-200 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#334155",
                  fontFamily: "Inter, system-ui, sans-serif",
                  "::placeholder": {
                    color: "#94a3b8",
                  },
                },
                invalid: {
                  color: "#dc2626",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2 justify-end border-t border-slate-100 pt-4 mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount}`
          )}
        </Button>
      </div>
    </form>
  );
};

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalFundAmount, setTotalFundAmount] = useState(0);

  const fetchFunds = async () => {
    try {
      const res = await axiosSecure.get("/api/funds");
      setFunds(res.data);
      const total = res.data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      setTotalFundAmount(total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load funding records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [axiosSecure]);

  const handlePaymentSuccess = () => {
    setDialogOpen(false);
    setFundAmount("");
    fetchFunds();
  };

  const handleOpenDonateModal = () => {
    const parsed = parseFloat(fundAmount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Support Our Organization</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Your contributions help fund blood campaign logistics, medical supplies, and emergency coordinate transport.
          </p>
        </div>

        {/* Dashboard Stat & Action Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Card */}
          <Card className="shadow-md border border-slate-100 bg-white flex flex-col justify-between">
            <CardHeader className="pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Funds Collected</span>
              <CardTitle className="text-3xl font-black text-slate-800 mt-1 flex items-center gap-1.5">
                <DollarSign className="w-7 h-7 text-green-600 stroke-[3px]" />
                {totalFundAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-400">
              Updated in real-time from all user donations.
            </CardContent>
          </Card>

          {/* Action Input Card */}
          <Card className="shadow-md border border-slate-100 bg-white md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-800">Contribute Money</CardTitle>
              <CardDescription>Enter the amount in USD you would like to donate.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="10.00"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <Button
                    type="button"
                    onClick={handleOpenDonateModal}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-current text-white" />
                    Give Fund
                  </Button>
                  <DialogContent className="max-w-md bg-white border border-slate-200 shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-slate-800">Checkout Payment</DialogTitle>
                      <DialogDescription>
                        Complete your donation securely using Stripe payment services.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Elements provider inside the modal */}
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        amount={parseFloat(fundAmount)}
                        onSuccess={handlePaymentSuccess}
                        onClose={() => setDialogOpen(false)}
                      />
                    </Elements>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funds List Table */}
        <Card className="shadow-md border border-slate-100 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Donation History</CardTitle>
            <CardDescription>A record of all financial support provided by donors.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : funds.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No donations recorded yet. Be the first to contribute!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Date Donated</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funds.map((f) => (
                      <TableRow key={f._id}>
                        <TableCell className="font-semibold text-slate-850">{f.userName}</TableCell>
                        <TableCell className="text-slate-500">{f.userEmail}</TableCell>
                        <TableCell className="text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(f.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-400">{f.transactionId}</TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          ${parseFloat(f.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Funding;
