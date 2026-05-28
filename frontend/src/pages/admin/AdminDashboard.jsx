import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchId, setSearchId] = useState("");

  const [searchedEmployee, setSearchedEmployee] = useState(null);

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  const fetchDashboardData = async () => {

    try {

      const employeeResponse = await api.get(
        "/admin/employees"
      );

      setEmployees(employeeResponse.data);

      const leaveResponse = await api.get(
        "/admin/all-leaves"
      );

      setLeaveRequests(leaveResponse.data);

    } catch (error) {

      console.error(error);

      setError("Failed to load dashboard");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchDashboardData();

  }, []);

  // =========================================
  // SEARCH EMPLOYEE
  // =========================================

  const handleSearch = async () => {

    if (!searchId) return;

    try {

      const response = await api.get(
        `/admin/employees/${searchId}`
      );

      if (response.data.length > 0) {

        setSearchedEmployee(response.data[0]);

      } else {

        setSearchedEmployee(null);

        alert("Employee not found");

      }

    } catch (error) {

      console.error(error);

      alert("Error searching employee");

    }
  };

  // =========================================
  // COUNTS
  // =========================================

  const totalEmployees = employees.length;

  const totalManagers = employees.filter(
    (employee) =>
      employee.role_name === "Manager"
  ).length;

  const totalApproved = leaveRequests.filter(
    (leave) =>
      leave.status === "Approved"
  ).length;

  const totalRejected = leaveRequests.filter(
    (leave) =>
      leave.status === "Rejected"
  ).length;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="container mt-5">
        <h4>Loading dashboard...</h4>
      </div>
    );
  }

  return (

    <div className="container-fluid p-0">

      {/* TOP NAVBAR */}

      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

        <h2 className="m-0">
          Admin Dashboard
        </h2>

        <button
          className="btn btn-danger"
          onClick={() => {

            localStorage.removeItem("token");

            localStorage.removeItem("role");

            localStorage.removeItem("user");

            navigate("/");
          }}
        >
          Logout
        </button>

      </div>

      <div className="p-4">

        {/* ERROR */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

        {/* DASHBOARD CARDS */}

        <div className="row">

          {/* TOTAL EMPLOYEES */}

          <div className="col-md-3 mb-4">

            <div className="card shadow border-0 bg-primary text-white h-100">

              <div className="card-body">

                <h5>Total Employees</h5>

                <h2>{totalEmployees}</h2>

                {/* SEARCH */}

                <div className="mt-4">

                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Enter Employee ID"
                    value={searchId}
                    onChange={(e) =>
                      setSearchId(e.target.value)
                    }
                  />

                  <button
                    className="btn btn-light w-100"
                    onClick={handleSearch}
                  >
                    Search Employee
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* TOTAL MANAGERS */}

          <div className="col-md-3 mb-4">

            <div className="card shadow border-0 bg-success text-white h-100">

              <div className="card-body">

                <h5>Total Managers</h5>

                <h2>{totalManagers}</h2>

              </div>

            </div>

          </div>

          {/* APPROVED LEAVES */}

          <div className="col-md-3 mb-4">

            <div className="card shadow border-0 bg-info text-white h-100">

              <div className="card-body">

                <h5>Approved Leaves</h5>

                <h2>{totalApproved}</h2>

              </div>

            </div>

          </div>

          {/* REJECTED LEAVES */}

          <div className="col-md-3 mb-4">

            <div className="card shadow border-0 bg-danger text-white h-100">

              <div className="card-body">

                <h5>Rejected Leaves</h5>

                <h2>{totalRejected}</h2>

              </div>

            </div>

          </div>

        </div>

        {/* SEARCH RESULT */}

        {searchedEmployee && (

          <div className="card shadow border-0 mb-4">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="m-0">
                  Employee Details
                </h3>

                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(
                      `/employee-details/${searchedEmployee.employee_id}`
                    )
                  }
                >
                  View Full Profile
                </button>

              </div>

              <div className="row">

                <div className="col-md-4 mb-3">

                  <strong>ID:</strong>

                  <br />

                  {searchedEmployee.employee_id}

                </div>

                <div className="col-md-4 mb-3">

                  <strong>Name:</strong>

                  <br />

                  {searchedEmployee.employee_name}

                </div>

                <div className="col-md-4 mb-3">

                  <strong>Email:</strong>

                  <br />

                  {searchedEmployee.email}

                </div>

                <div className="col-md-4 mb-3">

                  <strong>Department:</strong>

                  <br />

                  {searchedEmployee.department}

                </div>

                <div className="col-md-4 mb-3">

                  <strong>Role:</strong>

                  <br />

                  {searchedEmployee.role_name}

                </div>

                <div className="col-md-4 mb-3">

                  <strong>Status:</strong>

                  <br />

                  {searchedEmployee.status === true ||
                  searchedEmployee.status === 1
                    ? "Active"
                    : "Inactive"}

                </div>

              </div>

            </div>

          </div>

        )}

        {/* QUICK ACTIONS */}

        <div className="row mb-4">

          {/* MANAGE EMPLOYEES */}

          <div className="col-md-3 mb-3">

            <button
              className="btn btn-primary w-100 p-3"
              onClick={() =>
                navigate("/employees")
              }
            >
              Manage Employees
            </button>

          </div>

          {/* ADD EMPLOYEE */}

          <div className="col-md-3 mb-3">

            <button
              className="btn btn-success w-100 p-3"
              onClick={() =>
                navigate("/add-employee")
              }
            >
              Add Employee
            </button>

          </div>

          {/* MANAGE LEAVE TYPES */}

          <div className="col-md-3 mb-3">

            <button
              className="btn btn-warning w-100 p-3"
              onClick={() =>
                navigate("/leave-types")
              }
            >
              Manage Leave Types
            </button>

          </div>

          {/* ADD LEAVE TYPE */}

          <div className="col-md-3 mb-3">

            <button
              className="btn btn-dark w-100 p-3"
              onClick={() =>
                navigate("/leave-types")
              }
            >
              Add Leave Type
            </button>

          </div>

        </div>

        {/* RECENT LEAVE REQUESTS */}

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h4 className="m-0">
                Recent Leave Requests
              </h4>

              <button
                className="btn btn-outline-dark"
                onClick={() =>
                  navigate("/all-leaves")
                }
              >
                View All
              </button>

            </div>

            <div className="table-responsive">

              <table className="table table-striped table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>Employee</th>

                    <th>Leave Type</th>

                    <th>From</th>

                    <th>To</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {leaveRequests
                    .slice(0, 5)
                    .map((leave) => (

                      <tr key={leave.leave_request_id}>

                        <td>
                          {leave.employee_name}
                        </td>

                        <td>
                          {leave.leave_name}
                        </td>

                        <td>
                          {new Date(
                            leave.from_date
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          {new Date(
                            leave.to_date
                          ).toLocaleDateString()}
                        </td>

                        <td>

                          {leave.status === "Approved" && (
                            <span className="badge bg-success">
                              Approved
                            </span>
                          )}

                          {leave.status === "Rejected" && (
                            <span className="badge bg-danger">
                              Rejected
                            </span>
                          )}

                          {leave.status === "Pending" && (
                            <span className="badge bg-warning text-dark">
                              Pending
                            </span>
                          )}

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;