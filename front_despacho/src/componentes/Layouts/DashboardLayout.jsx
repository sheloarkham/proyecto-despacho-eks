import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const DashboardLayout = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-gray-50">
      <div className="col-span-1">
        <Navbar />
      </div>
      <div className="overflow-y-auto p-6">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};
