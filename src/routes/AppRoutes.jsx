// import { Routes, Route } from "react-router-dom";
// import UserLayout from "../layout/UserLayout";
// import Home from "../pages/user/Home";
// import Courses from "../pages/user/Courses";
// import CourseDetail from "../pages/user/CourseDetail";
// import Instruments from "../pages/user/Instruments";
// import InstrumentDetail from "../pages/user/InstrumentDetail";
// import Contact from "../pages/user/Contact";
// import Profile from "../pages/user/Profile";
// import Cart from "../pages/user/Cart";
// import AdminLayout from "../layout/AdminLayout";
// import Dashboard from "../pages/admin/Dashboard";
// import AddInstruments from "../pages/admin/AddInstruments";
// import MyCoursesList from "../pages/admin/MyCoursesList";
// import MyInstrumentsList from "../pages/admin/MyInstrumentsList";
// import Dummy from "../pages/admin/Dummy";
// import CreateCourse from "../pages/admin/CreateCourse";
// import AddLectures from "../pages/admin/AddLectures";
// import MyCourseDetail from "../pages/admin/MyCourseDetail";

// function AppRoutes() {
//   return (
//       <Routes>
//         <Route path="/" element={<UserLayout />}>
//           <Route index element={<Home />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/courses/:id" element={<CourseDetail />} />
//           <Route path="/instruments" element={<Instruments />} />
//           <Route path="/instrument/:id" element={<InstrumentDetail />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/cart" element={<Cart />} />
//         </Route>

//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="addinstruments" element={<AddInstruments />} />
//           <Route path="createcourse" element={<CreateCourse />} />
//           <Route path="addlectures" element={<AddLectures />} />
//           <Route path="mycourseslist" element={<MyCoursesList />} />
//           <Route path="mycoursedetail/:id" element={<MyCourseDetail />} />
//           <Route path="myinstrumentslist" element={<MyInstrumentsList />} />
//           <Route path="dummy" element={<Dummy />} />
//         </Route>
//       </Routes>
//   );
// }

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import Home from "../pages/user/Home";
import Courses from "../pages/user/Courses";
import CourseDetail from "../pages/user/CourseDetail";
import Instruments from "../pages/user/Instruments";
import InstrumentDetail from "../pages/user/InstrumentDetail";
import Contact from "../pages/user/Contact";
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
import PaymentSuccess from "../pages/user/PaymentSuccess";
import MyOrders from "../pages/user/MyOrders";
import AllUsers from "../pages/admin/AllUsers";
import Faq from "../pages/user/Faq";
import UserProfile from "../pages/user/UserProfile";
import AllOrders from "../pages/admin/AllOrders";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/user" replace />} />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="instruments" element={<Instruments />} />
          <Route path="instrument/:id" element={<InstrumentDetail />} />
          {/* <Route path="contact" element={<Contact />} /> */}
          <Route path="cart" element={<Cart />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
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

