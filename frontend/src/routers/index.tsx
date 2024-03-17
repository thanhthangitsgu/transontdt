import { useRoutes } from "react-router-dom";
import App from "../App";
import { Login } from "../pages/Login";
import PageNotFound from "../pages/PageNotFound";

import Account from "../pages/Account";
import Student from "../pages/Student";
import Role from "../pages/Role";
import Faculty from "../pages/Faculty";
import Major from "../pages/Major";
import Lecturer from "../pages/Lecturer";
import Classroom from "../pages/Classroom";
import Thesis from "../pages/Thesis";
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
      path: 'thesis',
      element: <Thesis />
    },
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
