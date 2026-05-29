import { BrowserRouter, Routes, Route }
from "react-router-dom";

import Login
from "../pages/Login";

// =========================================
// EMPLOYEE PAGES
// =========================================

import EmployeeDashboard
from "../pages/employee/EmployeeDashboard";

import ApplyLeave
from "../pages/employee/ApplyLeave";

import MyLeaves
from "../pages/employee/MyLeaves";

import LeaveBalance
from "../pages/employee/LeaveBalance";

// =========================================
// MANAGER PAGES
// =========================================

import ManagerDashboard
from "../pages/manager/ManagerDashboard";

import TeamLeaves
from "../pages/manager/TeamLeaves";

import PendingLeaves
from "../pages/manager/PendingLeaves";

// =========================================
// ADMIN PAGES
// =========================================

import AdminDashboard
from "../pages/admin/AdminDashboard";

import Employees
from "../pages/admin/Employees";

import AddEmployee
from "../pages/admin/AddEmployee";

import EditEmployee
from "../pages/admin/EditEmployee";

import LeaveTypes
from "../pages/admin/LeaveTypes";

import AllLeaves
from "../pages/admin/AllLeaves";

import EmployeeDetails
from "../pages/admin/EmployeeDetails";

import Roles from "../pages/admin/Roles";

// =========================================
// PROTECTED ROUTE
// =========================================

import ProtectedRoute
from "./ProtectedRoute";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================================= */}
        {/* LOGIN */}
        {/* ================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ================================= */}
        {/* EMPLOYEE ROUTES */}
        {/* ================================= */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="Employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute role="Employee">
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute role="Employee">
              <MyLeaves />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-balance"
          element={
            <ProtectedRoute role="Employee">
              <LeaveBalance />
            </ProtectedRoute>
          }
        />

        {/* ================================= */}
        {/* MANAGER ROUTES */}
        {/* ================================= */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="Manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-leaves"
          element={
            <ProtectedRoute role="Manager">
              <TeamLeaves />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-leaves"
          element={
            <ProtectedRoute role="Manager">
              <PendingLeaves />
            </ProtectedRoute>
          }
        />

        {/* ================================= */}
        {/* ADMIN ROUTES */}
        {/* ================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute role="Admin">
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-employee"
          element={
            <ProtectedRoute role="Admin">
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-employee/:id"
          element={
            <ProtectedRoute role="Admin">
              <EditEmployee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-details/:id"
          element={
            <ProtectedRoute role="Admin">
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-types"
          element={
            <ProtectedRoute role="Admin">
              <LeaveTypes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-leaves"
          element={
            <ProtectedRoute role="Admin">
              <AllLeaves />
            </ProtectedRoute>
          }
        />

        <Route
  path="/roles"
  element={
    <ProtectedRoute role="Admin">
      <Roles />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;