import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminVolunteerRoute from "./AdminVolunteerRoute";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DonationRequests from "@/pages/DonationRequests";
import DonationRequestDetails from "@/pages/DonationRequestDetails";
import SearchDonors from "@/pages/SearchDonors";
import Funding from "@/pages/Funding";

// Dashboard Pages
import DashboardHome from "@/pages/dashboard/DashboardHome";
import Profile from "@/pages/dashboard/Profile";
import MyDonationRequests from "@/pages/dashboard/MyDonationRequests";
import CreateDonationRequest from "@/pages/dashboard/CreateDonationRequest";
import EditDonationRequest from "@/pages/dashboard/EditDonationRequest";
import AllUsers from "@/pages/dashboard/AllUsers";
import AllBloodDonationRequests from "@/pages/dashboard/AllBloodDonationRequests";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "donation-requests", element: <DonationRequests /> },
      {
        path: "donation-request/:id",
        element: <PrivateRoute><DonationRequestDetails /></PrivateRoute>,
      },
      { path: "search", element: <SearchDonors /> },
      {
        path: "funding",
        element: <PrivateRoute><Funding /></PrivateRoute>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      { path: "edit-donation-request/:id", element: <EditDonationRequest /> },
      {
        path: "all-users",
        element: <AdminRoute><AllUsers /></AdminRoute>,
      },
      {
        path: "all-blood-donation-request",
        element: <AdminVolunteerRoute><AllBloodDonationRequests /></AdminVolunteerRoute>,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
