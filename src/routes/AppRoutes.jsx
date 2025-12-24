import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import Home from "../pages/user/Home";
import Courses from "../pages/user/Courses";
import CourseDetail from "../pages/user/CourseDetail";
import Instruments from "../pages/user/Instruments";
import InstrumentDetail from "../pages/user/InstrumentDetail";
import ContactUs from "../pages/user/ContactUs";
import Cart from "../pages/user/Cart";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AddInstruments from "../pages/admin/AddInstruments";
import MyCoursesList from "../pages/admin/MyCoursesList";
import MyInstrumentsList from "../pages/admin/MyInstrumentsList";
import CreateCourse from "../pages/admin/CreateCourse";
import AddLectures from "../pages/admin/AddLectures";
import MyCourseDetail from "../pages/admin/MyCourseDetail";
import Login from "../pages/user/Login";
import Signup from "../pages/user/Signup";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MyOrders from "../pages/user/MyOrders";
import AllUsers from "../pages/admin/AllUsers";
import Faq from "../pages/user/Faq";
import UserProfile from "../pages/user/UserProfile";
import AllOrders from "../pages/admin/AllOrders";
import PaymentProcessing from "../pages/user/PaymentProcessing";
import PaymentFailed from "../pages/user/PaymentFailed";
import UserForgotPassword from "../pages/user/UserForgotPassword";
import PrivacyPolicy from "../pages/user/PrivacyPolicy";
import TermsConditions from "../pages/user/TermsConditions";
import RefundPolicy from "../pages/user/RefundPolicy";
import ShippingPolicy from "../pages/user/ShippingPolicy";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/user" replace />} />

        
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgotpassword" element={<PublicRoute><UserForgotPassword /></PublicRoute>} />
        
        <Route path="/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/shipping-policy" element={<PublicRoute><ShippingPolicy /></PublicRoute>} />
        <Route path="/terms-conditions" element={<PublicRoute><TermsConditions /></PublicRoute>} />
        <Route path="/refund-policy" element={<PublicRoute><RefundPolicy /></PublicRoute>} />
        <Route path="/contact-us" element={<PublicRoute><ContactUs /></PublicRoute>} />


        <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="instruments" element={<Instruments />} />
          <Route path="instrument/:id" element={<InstrumentDetail />} />
          {/* <Route path="contact" element={<Contact />} /> */}
          <Route path="cart" element={<Cart />} />
          <Route path="payment-processing" element={<PaymentProcessing />} />
          <Route path="payment-failed" element={<PaymentFailed />} />
          <Route path="myorders" element={<MyOrders />} />
          <Route path="faq" element={<Faq />} />
          <Route path="userprofile" element={<UserProfile />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="addinstruments" element={<AddInstruments />} />
          <Route path="createcourse" element={<CreateCourse />} />
          <Route path="addlectures" element={<AddLectures />} />
          <Route path="mycourseslist" element={<MyCoursesList />} />
          <Route path="mycoursedetail/:id" element={<MyCourseDetail />} />
          <Route path="myinstrumentslist" element={<MyInstrumentsList />} />
          <Route path="allusers" element={<AllUsers />} />
          <Route path="allorders" element={<AllOrders />} />

        </Route>
      </Routes>
  );
}

export default AppRoutes;

