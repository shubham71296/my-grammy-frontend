import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppDialog from "../components/ui/dialog/AppDialog";
import PageSpinner from "../components/ui/loader/PageSpinner";

const UserLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="page-gradient flex-1">
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <AppDialog />
  </div>
);

export default UserLayout;
