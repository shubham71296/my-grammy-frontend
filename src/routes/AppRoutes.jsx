// import { Routes, Route, Navigate } from "react-router-dom";
// import UserLayout from "../layout/UserLayout";
// import Home from "../pages/user/Home";
// import Courses from "../pages/user/Courses";
// import CourseDetail from "../pages/user/CourseDetail";
// import Instruments from "../pages/user/Instruments";
// import InstrumentDetail from "../pages/user/InstrumentDetail";
// import ContactUs from "../pages/user/ContactUs";
// import Cart from "../pages/user/Cart";
// import AdminLayout from "../layout/AdminLayout";
// import Dashboard from "../pages/admin/Dashboard";
// import AddInstruments from "../pages/admin/AddInstruments";
// import MyCoursesList from "../pages/admin/MyCoursesList";
// import MyInstrumentsList from "../pages/admin/MyInstrumentsList";
// import CreateCourse from "../pages/admin/CreateCourse";
// import AddLectures from "../pages/admin/AddLectures";
// import MyCourseDetail from "../pages/admin/MyCourseDetail";
// import Login from "../pages/user/Login";
// import Signup from "../pages/user/Signup";
// import ProtectedRoute from "./ProtectedRoute";
// import PublicRoute from "./PublicRoute";
// import MyOrders from "../pages/user/MyOrders";
// import AllUsers from "../pages/admin/AllUsers";
// import Faq from "../pages/user/Faq";
// import UserProfile from "../pages/user/UserProfile";
// import AllOrders from "../pages/admin/AllOrders";
// import PaymentProcessing from "../pages/user/PaymentProcessing";
// import PaymentFailed from "../pages/user/PaymentFailed";
// import UserForgotPassword from "../pages/user/UserForgotPassword";
// import PrivacyPolicy from "../pages/user/PrivacyPolicy";
// import TermsConditions from "../pages/user/TermsConditions";
// import RefundPolicy from "../pages/user/RefundPolicy";
// import ShippingPolicy from "../pages/user/ShippingPolicy";

// function AppRoutes() {
//   return (
//       <Routes>
//         <Route path="/" element={<Navigate to="/user" replace />} />

        
//         <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//         <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
//         <Route path="/forgotpassword" element={<PublicRoute><UserForgotPassword /></PublicRoute>} />
        
//         <Route path="/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
//         <Route path="/shipping-policy" element={<PublicRoute><ShippingPolicy /></PublicRoute>} />
//         <Route path="/terms-conditions" element={<PublicRoute><TermsConditions /></PublicRoute>} />
//         <Route path="/refund-policy" element={<PublicRoute><RefundPolicy /></PublicRoute>} />
//         <Route path="/contact-us" element={<PublicRoute><ContactUs /></PublicRoute>} />


//         <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
//           <Route index element={<Home />} />
//           <Route path="courses" element={<Courses />} />
//           <Route path="courses/:id" element={<CourseDetail />} />
//           <Route path="instruments" element={<Instruments />} />
//           <Route path="instrument/:id" element={<InstrumentDetail />} />
//           {/* <Route path="contact" element={<Contact />} /> */}
//           <Route path="cart" element={<Cart />} />
//           <Route path="payment-processing" element={<PaymentProcessing />} />
//           <Route path="payment-failed" element={<PaymentFailed />} />
//           <Route path="myorders" element={<MyOrders />} />
//           <Route path="faq" element={<Faq />} />
//           <Route path="userprofile" element={<UserProfile />} />
//         </Route>

//         <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
//           <Route index element={<Dashboard />} />
//           <Route path="addinstruments" element={<AddInstruments />} />
//           <Route path="createcourse" element={<CreateCourse />} />
//           <Route path="addlectures" element={<AddLectures />} />
//           <Route path="mycourseslist" element={<MyCoursesList />} />
//           <Route path="mycoursedetail/:id" element={<MyCourseDetail />} />
//           <Route path="myinstrumentslist" element={<MyInstrumentsList />} />
//           <Route path="allusers" element={<AllUsers />} />
//           <Route path="allorders" element={<AllOrders />} />

//         </Route>
//       </Routes>
//   );
// }

// export default AppRoutes; 


import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";

const Home = lazy(() => import("../pages/user/Home"));
const Courses = lazy(() => import("../pages/user/Courses"));
const CourseDetail = lazy(() => import("../pages/user/CourseDetail"));
const Instruments = lazy(() => import("../pages/user/Instruments"));
const InstrumentDetail = lazy(() => import("../pages/user/InstrumentDetail"));
const ContactUs = lazy(() => import("../pages/user/ContactUs"));
const Cart = lazy(() => import("../pages/user/Cart"));
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
const CreateCourse = lazy(() => import("../pages/admin/CreateCourse"));
const AddLectures = lazy(() => import("../pages/admin/AddLectures"));
const MyCourseDetail = lazy(() => import("../pages/admin/MyCourseDetail"));
const AllUsers = lazy(() => import("../pages/admin/AllUsers"));
const AllOrders = lazy(() => import("../pages/admin/AllOrders"));

const Login = lazy(() => import("../pages/user/Login"));
const Signup = lazy(() => import("../pages/user/Signup"));


function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div>
        </div>
      }
    >
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
    </Suspense>
  );
}

export default AppRoutes;


