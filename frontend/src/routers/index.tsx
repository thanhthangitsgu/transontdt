import { useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import { Login } from "../pages/Login";
import PageNotFound from "../pages/PageNotFound";

import Account from "../pages/Account";
import Student from "../pages/Student";
import Role from "../pages/Role";
import Schedule from "../pages/Schedule";
import Faculty from "../pages/Faculty";
import Major from "../pages/Major";
import Lecturer from "../pages/Lecturer";
import Classroom from "../pages/Classroom";
import Semester from "../pages/Semester";
import Thesis from "../pages/Thesis";
import { Computer } from "@mui/icons-material";
import ComputerRoom from "../pages/ComputerRoom";
import Subject from "../pages/Subject";
import Notice from "../pages/Notice";
const AppRouter = {
  path: "/",
  element: <App />,
  children: [
    {
      index: true,
      element: <Thesis />,
    },

    {
      path: 'lecturer',
      element: <Lecturer />
    },
    {
      path: 'account',
      element: <Account />
    },
    {
      path: 'student',
      element: <Student />
    },
    {
      path: 'role',
      element: <Role />
    },
    {
      path: 'schedule',
      element: <Schedule />
    },
    {
      path: 'faculty',
      element: <Faculty />
    },
    {
      path: 'major',
      element: <Major />
    },
    {
      path: 'classroom',
      element: <Classroom />
    },
    {
      path: 'semester',
      element: <Semester />
    },
    {
      path: 'thesis',
      element: <Thesis />
    },
    {
      path: 'computer-room',
      element: <ComputerRoom />
    },
    {
      path: 'subject',
      element: <Subject />
    },
    {
      path: 'notice',
      element: <Notice />

    }
  ],
};

const LoginRouter = {
  path: 'login',
  element: <Login />
}

const NotFound = {
  path: '*',
  element: <PageNotFound />

}
export default function Router() {
  return useRoutes([AppRouter, LoginRouter, NotFound]);
}
