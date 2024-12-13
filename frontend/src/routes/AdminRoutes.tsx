import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import MinimalLayout from "../layout/MinimalLayout";

// Use Loadable to reduce bundle size
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const ProfileUser = Loadable(lazy(() => import("../pages/User")));
const EditUser = Loadable(lazy(() => import("../pages/User/edit")));
const ChangePassword = Loadable(lazy(() => import("../pages/User/changepassword")));
const TutorProfile = Loadable(lazy(() => import("../pages/TutorProfile")));
const EditTutor = Loadable(lazy(() => import("../pages/TutorProfile/edit")));
const MyProfile = Loadable(lazy(() => import("../pages/TutorProfile/myprofile")));
const LoginHistory = Loadable(lazy(() => import("../pages/User/loginhistory")));

//Course
const MainCourse = Loadable(lazy(() => import("../pages/Courses/Course/index")));
const CourseDetails = Loadable(lazy(() => import("../pages/Courses/CourseDetail/index")));
const MyCourses = Loadable(lazy(() => import("../pages/Courses/MyCourse/index")));
const TutorCourse = Loadable(lazy(() => import("../pages/Courses/Tutor/index")));
const CourseDetailsTutor = Loadable(lazy(() => import("../pages/Courses/Tutor/CourseDetail/index")));
const EditCourse = Loadable(lazy(() => import("../pages/Courses/Tutor/Edit/index")));
const CreateCourse = Loadable(lazy(() => import("../pages/Courses/Tutor/Create/index")));
const SearchCourse = Loadable(lazy(() => import("../pages/Courses/Search/index")));

//Admin
const MainDashboard = Loadable(lazy(() => import("../pages/Admins/Dashboard/dashboard")));
const AdminCalender= Loadable(lazy(() => import("../pages/Admins/calendar/Calendar")));
const AdminCreateUser= Loadable(lazy(() => import("../pages/Admins/createUser/CreateUser")));

//Payment
const MainPayment = Loadable(lazy(() => import("../pages/Payment/index")));

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
  const userRoleId = parseInt(localStorage.getItem("user_role_id") || "0", 10);
  //const id = localStorage.getItem('id') || 'Unknown User';

  return {
    path: "/",
    element: <MinimalLayout />, 
    children: [
      {
        path: "/", 
        element: isLoggedIn 
          ? (userRoleId === 1 
              ? <MainDashboard />  
              : (userRoleId === 2 || userRoleId === 3) 
              ? <MainCourse /> 
              : <MainPages />) 
          : <MainPages />, 
      },
      {
        path: "/dashboard",
        element: isLoggedIn ? (userRoleId ===  1? <MainDashboard /> : <MainCourse />) : <MainPages />,
      },
      { // ปาย
        path: "calendarAdmin", 
        element: isLoggedIn ? <AdminCalender /> : <MainPages />,
      },
      { // ปาย
        path: "createuserbyAdmin", 
        element: isLoggedIn ? <AdminCreateUser /> : <MainPages />,
      },
      { // ปอน
        path: "myCourses", 
        element: isLoggedIn ? <MyCourses /> : <MainPages />,
      },
      { // ปอน
        path: "tutor", 
        element: isLoggedIn ? (userRoleId === 2  ? <TutorCourse /> : <MainPages />) : <MainPages />,
      },
      { // ปอน
        path: "search", 
        element: isLoggedIn ? <SearchCourse /> : <MainPages />,
      },
      { // ปอน
        path: "course", 
        element: isLoggedIn ? <MainCourse /> : <MainPages />,
      },
      { // ปอน
        path: "tutor/:id", 
        element: isLoggedIn ? <CourseDetailsTutor /> : <MainPages />,
      },
      { // ปอน
        path: "tutor/edit/:id", 
        element: isLoggedIn ? <EditCourse /> : <MainPages />,
      },
      { // ปอน
        path: "tutor/create", 
        element: isLoggedIn ? <CreateCourse /> : <MainPages />,
      },
      { // ปอน
        path: "course/:id", // เส้นทางสำหรับ CourseDetail
        element: isLoggedIn ? <CourseDetails /> : <MainPages />,
      },
      { // เเม็ก
        path: "payment", // เส้นทางสำหรับ CourseDetail
        element: isLoggedIn ? <MainPayment /> : <MainPages />,
      },
      { // อาย
        path: "users", 
        element: isLoggedIn ? (userRoleId === 2 ? <TutorProfile /> : <ProfileUser />) : <MainPages />,
        children: [
          {
            path: "edit/:id",  // อาย
            element: isLoggedIn ? <EditUser /> : <MainPages />,
          },
          {
            path: "password/:id", // อาย
            element: isLoggedIn ? <ChangePassword /> : <MainPages />,
          },
          {
            path: "loginhistory/:id", // อาย
            element: isLoggedIn ? <LoginHistory /> : <MainPages />,
          },
        ],
      },
      { // อาย
        path: "tutor_profiles", 
        element: isLoggedIn ? (userRoleId === 2 ? <MyProfile /> : <ProfileUser />) : <MainPages />,
        children: [

          {
            path: "edit/:UserID", // อาย
            element: isLoggedIn ? <EditTutor /> : <MainPages />,
          },
        ],
      },
    ],
  };
};

export default AdminRoutes;
