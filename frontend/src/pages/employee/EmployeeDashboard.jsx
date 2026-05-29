import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function EmployeeDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [leaveBalances, setLeaveBalances] = useState([]);

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  const fetchDashboardData = async () => {

    try {

      const leaveResponse = await api.get(
        "/Employee/my-leaves"
      );

      const balanceResponse = await api.get(
        "/Employee/dashboard"
      );

      setLeaves(
        leaveResponse.data || []
      );

      setLeaveBalances(
        balanceResponse.data || []
      );

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to load dashboard"
      );

    }
    finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchDashboardData();

  }, []);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <h4>
          Loading Dashboard...
        </h4>

      </div>

    );
  }

  const recentLeaves =
    leaves.slice(0, 5);

  return (

    <div className="container-fluid p-0">

      {/* TOP NAVBAR */}

      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

        <h3 className="m-0">
          Employee Dashboard
        </h3>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* PAGE CONTENT */}

      <div className="p-4">

        {/* WELCOME CARD */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <h2 className="mb-4">

              Welcome,
              {" "}
              {user.first_name}
              {" "}
              {user.last_name}

            </h2>

            <div className="row">

              <div className="col-md-4 mb-3">

                <strong>
                  Employee ID:
                </strong>

                <br />

                {user.employee_id}

              </div>

              <div className="col-md-4 mb-3">

                <strong>
                  Email:
                </strong>

                <br />

                {user.email}

              </div>

              <div className="col-md-4 mb-3">

                <strong>
                  Role:
                </strong>

                <br />

                {user.role_name}

              </div>

            </div>

          </div>

        </div>

        {/* APPLY LEAVE CARD */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body d-flex justify-content-between align-items-center">

            <div>

              <h3>
                Apply Leave
              </h3>

              <p className="mb-0">

                Submit a new leave request.

              </p>

            </div>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/apply-leave")
              }
            >
              Apply Leave
            </button>

          </div>

        </div>

                {/* RECENT LEAVE REQUESTS */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h3>
                Recent Leave Requests
              </h3>

              <button
                className="btn btn-success"
                onClick={() =>
                  navigate("/my-leaves")
                }
              >
                View All
              </button>

            </div>

            <div
              style={{
                maxHeight: "350px",
                overflowY: "auto"
              }}
            >

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>Leave Type</th>

                    <th>From Date</th>

                    <th>To Date</th>

                    <th>Reason</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {recentLeaves.length > 0 ? (

                    recentLeaves.map((leave) => (

                      <tr
                        key={
                          leave.leave_request_id
                        }
                      >

                        <td>
                          {leave.leave_name}
                        </td>

                        <td>

                          {leave.from_date
                            ? new Date(
                                leave.from_date
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        <td>

                          {leave.to_date
                            ? new Date(
                                leave.to_date
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        <td>
                          {leave.reason}
                        </td>

                        <td>

                          <span
                            className={
                              leave.status === "Approved"

                                ? "badge bg-success"

                                : leave.status === "Rejected"

                                ? "badge bg-danger"

                                : "badge bg-warning text-dark"
                            }
                          >

                            {leave.status}

                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center"
                      >
                        No Leave Requests Found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* LEAVE BALANCES */}

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h3>
                Leave Balances
              </h3>

              <button
                className="btn btn-warning"
                onClick={() =>
                  navigate("/leave-balance")
                }
              >
                Full Balance
              </button>

            </div>

            <div className="row">

              {leaveBalances.length > 0 ? (

                leaveBalances.map((leave,index) => {

                  const percentage =

                    leave.total_leaves > 0

                      ? (
                          leave.remaining_leaves /
                          leave.total_leaves
                        ) * 100

                      : 0;

                      const colors = [
  "#28a745", // Green
  "#007bff", // Blue
  "#fd7e14", // Orange
  "#dc3545", // Red
  "#6f42c1", // Purple
  "#20c997", // Teal
];
                  return (

                    <div
                      key={
                        leave.leave_type_id
                      }
                      className="col-md-3 mb-4"
                    >

                      <div
  className="card border-0 shadow h-100"
  style={{
    borderRadius: "20px",
    transition: "all 0.3s ease"
  }}
>

                        <div className="card-body text-center">

                          <h5
  className="mb-3 fw-bold"
  style={{
    color:
      colors[index % colors.length]
  }}
>
  {leave.leave_name}
</h5>

                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              margin: "0 auto"
                            }}
                          >

  <CircularProgressbar
  value={percentage}
  text={`${leave.remaining_leaves}`}
  styles={buildStyles({

    pathColor:
      colors[index % colors.length],

    textColor:
      colors[index % colors.length],

    trailColor:
      "#f1f3f5",

    strokeLinecap:
      "round",

    textSize:
      "18px"

  })}
/>

                          </div>

                          <div
  className="mt-3 text-start"
  style={{
    fontSize: "16px"
  }}
>

                            <p className="mb-1">

                              <strong>
                                Total:
                              </strong>
                              {" "}
                              {leave.total_leaves}

                            </p>

                            <p className="mb-1">

                              <strong>
                                Used:
                              </strong>
                              {" "}
                              {leave.used_leaves}

                            </p>

                            <p className="mb-0">

                              <strong>
                                Remaining:
                              </strong>
                              {" "}
                              {leave.remaining_leaves}

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                })

              ) : (

                <div className="col-12 text-center">

                  No Leave Balances Found

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default EmployeeDashboard;