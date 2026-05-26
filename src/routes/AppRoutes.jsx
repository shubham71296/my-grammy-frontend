import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LazyPage from "../components/ui/loader/LazyPage";

import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import GuestLayout from "../layout/GuestLayout";

const Home = lazy(() => import("../pages/user/Home"));
const Courses = lazy(() => import("../pages/user/Courses"));
const GuestCourses = lazy(() => import("../pages/user/GuestCourses"));
const CourseDetail = lazy(() => import("../pages/user/CourseDetail"));
const Instruments = lazy(() => import("../pages/user/Instruments"));
const GuestInstruments = lazy(() => import("../pages/user/GuestInstruments"));
const InstrumentDetailPage = lazy(() => import("../pages/user/InstrumentDetailPage"));
const ContactUs = lazy(() => import("../pages/user/ContactUs"));
const Cart = lazy(() => import("../pages/user/Cart"));
const Guest = lazy(() => import("../pages/user/Guest"));
const MyOrders = lazy(() => import("../pages/user/MyOrders"));
const Faq = lazy(() => import("../pages/user/Faq"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const PaymentProcessing = lazy(() => import("../pages/user/PaymentProcessing"));
const PaymentFailed = lazy(() => import("../pages/user/PaymentFailed"));
const UserForgotPassword = lazy(() => import("../pages/user/UserForgotPassword"));
const PrivacyPolicy = lazy(() => import("../pages/user/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/user/TermsConditions"));
const RefundPolicy = lazy(() => import("../pages/user/RefundPolicy"));
const ShippingPolicy = lazy(() => import("../pages/user/ShippingPolicy"));

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AddInstruments = lazy(() => import("../pages/admin/AddInstruments"));
const MyCoursesList = lazy(() => import("../pages/admin/MyCoursesList"));
const MyInstrumentsList = lazy(() => import("../pages/admin/MyInstrumentsList"));
const AdminInstrumentDetail = lazy(() => import("../pages/admin/AdminInstrumentDetail"));
const CreateCourse = lazy(() => import("../pages/admin/CreateCourse"));
const AddLectures = lazy(() => import("../pages/admin/AddLectures"));
const MyCourseDetail = lazy(() => import("../pages/admin/MyCourseDetail"));
const AllUsers = lazy(() => import("../pages/admin/AllUsers"));
const AllOrders = lazy(() => import("../pages/admin/AllOrders"));
const AdminUserDetail = lazy(() => import("../pages/admin/AdminUserDetail"));
const AdminOrderDetail = lazy(() => import("../pages/admin/AdminOrderDetail"));

const Login = lazy(() => import("../pages/user/Login"));
const Signup = lazy(() => import("../pages/user/Signup"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/guest" replace />} />

      <Route path="/guest" element={<PublicRoute><GuestLayout /></PublicRoute>}>
        <Route index element={<Guest />} />
        <Route path="guestinstruments" element={<GuestInstruments />} />
        <Route path="guestinstrument/:id" element={<InstrumentDetailPage mode="guest" />} />
        <Route path="guestcourses" element={<GuestCourses />} />
        <Route path="guestcourse/:id" element={<CourseDetail mode="guest" />} />
      </Route>

      <Route path="/login" element={<PublicRoute><LazyPage><Login /></LazyPage></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><LazyPage><Signup /></LazyPage></PublicRoute>} />
      <Route path="/forgotpassword" element={<PublicRoute><LazyPage><UserForgotPassword /></LazyPage></PublicRoute>} />

      <Route path="/privacy-policy" element={<PublicRoute><LazyPage><PrivacyPolicy /></LazyPage></PublicRoute>} />
      <Route path="/shipping-policy" element={<PublicRoute><LazyPage><ShippingPolicy /></LazyPage></PublicRoute>} />
      <Route path="/terms-conditions" element={<PublicRoute><LazyPage><TermsConditions /></LazyPage></PublicRoute>} />
      <Route path="/refund-policy" element={<PublicRoute><LazyPage><RefundPolicy /></LazyPage></PublicRoute>} />
      <Route path="/contact-us" element={<PublicRoute><LazyPage><ContactUs /></LazyPage></PublicRoute>} />

      <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="instruments" element={<Instruments />} />
        <Route path="instrument/:id" element={<InstrumentDetailPage mode="user" />} />
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
        <Route path="myinstrument/:id" element={<AdminInstrumentDetail />} />
        <Route path="allusers" element={<AllUsers />} />
        <Route path="user/:id" element={<AdminUserDetail />} />
        <Route path="allorders" element={<AllOrders />} />
        <Route path="order/:id" element={<AdminOrderDetail />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
