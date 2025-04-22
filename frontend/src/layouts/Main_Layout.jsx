import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const Main_Layout = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <Outlet />
      {/* Footer */}
    </div>
  );
};

export default Main_Layout;
