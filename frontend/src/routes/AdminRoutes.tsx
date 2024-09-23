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

//Course
const MainCourse = Loadable(lazy(() => import("../pages/Pond/Course/index")));
const CourseDetails = Loadable(lazy(() => import("../pages/Pond/CourseDetail/index")));
const MyCourses = Loadable(lazy(() => import("../pages/Pond/MyCourse/index")));
const TutorCourse = Loadable(lazy(() => import("../pages/Pond/Tutor/index")));
const CourseDetailsTutor = Loadable(lazy(() => import("../pages/Pond/Tutor/CourseDetail/index")));
const EditCourse = Loadable(lazy(() => import("../pages/Pond/Tutor/Edit/index")));
const CreateCourse = Loadable(lazy(() => import("../pages/Pond/Tutor/Create/index")));
const SearchCourse = Loadable(lazy(() => import("../pages/Pond/Search/index")));

//Admin
const MainDashboard = Loadable(lazy(() => import("../pages/Pai/Dashboard/dashboard")));
const AdminTutor = Loadable(lazy(() => import("../pages/Pai/tutor/Tutor")));
const AdminCourse = Loadable(lazy(() => import("../pages/Pai/course/Course")));
const AdminCalender= Loadable(lazy(() => import("../pages/Pai/calendar/Calendar")));
const AdminCreateUser= Loadable(lazy(() => import("../pages/Pai/createUser/CreateUser")));

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
        path: "tutorAdmin", 
        element: isLoggedIn ? <AdminTutor /> : <MainPages />,
      },
      { // ปาย
        path: "courseAdmin", 
        element: isLoggedIn ? <AdminCourse /> : <MainPages />,
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
            path: "changepassword/:id", // อาย
            element: isLoggedIn ? <ChangePassword /> : <MainPages />,
          },
        ],
      },
      {
        path: "tutor_profiles/users/:userID", // อาย
        element: isLoggedIn ? <MyProfile /> : <MainPages />,
      },
      {
        path: "tutor_profiles/edit/:userID", // อาย
        element: isLoggedIn ? <EditTutor /> : <MainPages />,
      }
    ],
  };
};

export default AdminRoutes;
