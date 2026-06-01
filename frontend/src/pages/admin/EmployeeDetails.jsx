import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../services/api";

function EmployeeDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [employee, setEmployee] = useState(null);

  const [leaveBalances, setLeaveBalances] = useState([]);

  const [leaveHistory, setLeaveHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================
  // FETCH EMPLOYEE DETAILS
  // =========================================

  const fetchEmployeeDetails = async () => {

    try {

      // EMPLOYEE DETAILS

      const employeeResponse = await api.get(
        `/admin/employees/${id}`
      );

      if (
        employeeResponse.data &&
        employeeResponse.data.length > 0
      ) {

        setEmployee(
          employeeResponse.data[0]
        );
      }

      // LEAVE BALANCES

      try {

      const balanceResponse = await api.get(
  `/admin/employee/${id}/leave-balance`
);

        setLeaveBalances(
          balanceResponse.data
        );

      } catch (error) {

        console.error(
          "Leave balance API error",
          error
        );
      }

      // LEAVE HISTORY

      try {

        const leaveResponse = await api.get(
          "/admin/all-leaves"
        );

        const employeeLeaves =
          leaveResponse.data.filter(
            (leave) =>
              leave.employee_id ==
              id
          );

        setLeaveHistory(
          employeeLeaves
        );

      } catch (error) {

        console.error(
          "Leave history API error",
          error
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load employee details"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchEmployeeDetails();

  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <h4>
          Loading employee details...
        </h4>

      </div>

    );
  }

  return (

    <div className="container-fluid p-0">

      {/* TOP NAVBAR */}

      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

        <div className="d-flex gap-2">

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin")
            }
          >
            Dashboard
          </button>

          <button
            className="btn btn-light"
            onClick={() =>
              navigate("/employees")
            }
          >
            Employees
          </button>

        </div>

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

      {/* PAGE CONTENT */}

      <div className="p-4">

        {/* ERROR */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

        {/* EMPLOYEE INFO */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h2 className="m-0">
                Employee Profile
              </h2>

              <button
                className="btn btn-warning"
                onClick={() =>
                  navigate(
                    `/edit-employee/${id}`
                  )
                }
              >
                Edit Employee
              </button>

            </div>

            {employee && (

              <div className="row">

                {/* EMPLOYEE ID */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Employee ID
                  </strong>

                  <br />

                  {employee.employee_id}

                </div>

                {/* EMPLOYEE CODE */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Employee Code
                  </strong>

                  <br />

                  {employee.employee_code || "-"}

                </div>

                {/* NAME */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Name
                  </strong>

                  <br />

                  {employee.employee_name || "-"}

                </div>

                {/* EMAIL */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Email
                  </strong>

                  <br />

                  {employee.email || "-"}

                </div>

                {/* DEPARTMENT */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Department
                  </strong>

                  <br />

                  {employee.department || "-"}

                </div>

                {/* ROLE */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Role
                  </strong>

                  <br />

                  {employee.role_name || "-"}

                </div>

                {/* MANAGER */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Manager
                  </strong>

                  <br />

                  {
  typeof employee.manager_name === "string"
    ? employee.manager_name
    : "-"
}

                </div>

                {/* STATUS */}

                <div className="col-md-4 mb-3">

                  <strong>
                    Status
                  </strong>

                  <br />

                  {employee.status === true ||
                  employee.status === 1 ? (

                    <span className="badge bg-success">
                      Active
                    </span>

                  ) : (

                    <span className="badge bg-danger">
                      Inactive
                    </span>

                  )}

                </div>

              </div>

            )}

          </div>

        </div>

        {/* LEAVE BALANCES */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <h3 className="mb-3">
              Leave Balances
            </h3>

            <div className="table-responsive">

              <table className="table table-striped table-hover">

                <thead className="table-dark">

                  <tr>

                    <th>Leave Type</th>

                    <th>Total Leaves</th>

                    <th>Used Leaves</th>

                    <th>Remaining Leaves</th>

                  </tr>

                </thead>

                <tbody>

                  {leaveBalances.length > 0 ? (

                    leaveBalances.map(
                      (balance) => (

                        <tr
                          key={
                            balance.leave_balance_id
                          }
                        >

                          <td>
                            {balance.leave_name}
                          </td>

                          <td>
                            {balance.total_leaves}
                          </td>

                          <td>
                            {balance.used_leaves}
                          </td>

                          <td>
                            {balance.remaining_leaves}
                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="text-center"
                      >
                        No leave balances found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* LEAVE HISTORY */}

        <div className="card shadow border-0">

          <div className="card-body">

            <h3 className="mb-3">
              Leave History
            </h3>

            <div className="table-responsive">

              <table className="table table-striped table-hover">

                <thead className="table-dark">

                  <tr>

                    <th>Leave Type</th>

                    <th>From Date</th>

                    <th>To Date</th>

                    <th>Total Days</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {leaveHistory.length > 0 ? (

                    leaveHistory.map(
                      (leave) => (

                        <tr
                          key={
                            leave.leave_request_id
                          }
                        >

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
                            {leave.total_days}
                          </td>

                          <td>

                            {leave.status ===
                            "Approved" ? (

                              <span className="badge bg-success">
                                Approved
                              </span>

                            ) : leave.status ===
                              "Rejected" ? (

                              <span className="badge bg-danger">
                                Rejected
                              </span>

                            ) : (

                              <span className="badge bg-warning text-dark">
                                Pending
                              </span>

                            )}

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center"
                      >
                        No leave history found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EmployeeDetails;