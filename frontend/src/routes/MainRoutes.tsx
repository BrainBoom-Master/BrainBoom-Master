import { lazy } from "react";
//import React from "react";
import { RouteObject } from "react-router-dom";
import MinimalLayout from "../layout/MinimalLayout";
import Loadable from "../components/third-patry/Loadable";

//User
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const RegisterSelect = Loadable(lazy(() => import("../pages/authentication/RegisterSelect")));
const StudentSignup = Loadable(lazy(() => import("../pages/authentication/RegisterStudent")));
const TutorSignup1 = Loadable(lazy(() => import("../pages/authentication/RegisterTutor1")));
//Course


const MainRoutes = (): RouteObject => {

  return {

    path: "/",

    element: <MinimalLayout />,

    children: [

      {

        path: "/",

        element: <MainPages />,

      },

      {

        path: "/studentsignup",

        element: <StudentSignup />,

      },
      {

        path: "/tutorsignup",

        element: <TutorSignup1 />,

      },
      {

        path: "/signupselect",

        element: <RegisterSelect />,

      },

      {

        path: "*",

        element: <MainPages />,

      },

    ],

  };

};


export default MainRoutes;