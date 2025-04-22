import { createBrowserRouter } from "react-router-dom";
import Main_Layout from "../layouts/Main_Layout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Jobs from "../pages/jobs/Jobs";
import JobDescription from "../pages/jobs/JobDescription";
import Profile from "../pages/profiles/Profile";
import ProtectedRoute from "./Protected.Routes";
import Companies from "../components/amdin/Companies";
import CompanyCreate from "../components/amdin/CompanyCreate";
import CompanySetup from "../components/amdin/CompanySetup";
import AdminJobs from "../components/amdin/AdminJobs";
import PostJob from "../components/amdin/PostJob";
import Applicants from "../components/amdin/Applicants";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main_Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/description/:id",
        element: <JobDescription />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/companies",
        element: (
          <ProtectedRoute role="recruiter">
            <Companies />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/companies/create",
        element: (
          <ProtectedRoute role="recruiter">
            <CompanyCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/companies/:id",
        element: (
          <ProtectedRoute role="recruiter">
            <CompanySetup />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs",
        element: (
          <ProtectedRoute role="recruiter">
            <AdminJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/create",
        element: (
          <ProtectedRoute role="recruiter">
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/:id/applicants",
        element: (
          <ProtectedRoute role="recruiter">
            <Applicants />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
