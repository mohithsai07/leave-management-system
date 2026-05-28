import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function LeaveBalance() {

  const navigate = useNavigate();

  const [leaveBalances, setLeaveBalances] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH LEAVE BALANCES
  // =========================================

  const fetchLeaveBalances = async () => {

    try {

      const response = await api.get(
        "/Employee/dashboard"
      );

      console.log(
        "LEAVE BALANCES:",
        response.data
      );

      setLeaveBalances(response.data);

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to fetch leave balances"
      );

    }
    finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchLeaveBalances();

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
          Loading leave balances...
        </h4>

      </div>

    );
  }

  return (

    <div className="container-fluid p-0">

      {/* TOP NAVBAR */}

      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/employee")
          }
        >
          Dashboard
        </button>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* PAGE CONTENT */}

      <div className="p-4">

        <div className="card shadow border-0">

          <div className="card-body">

            <h2 className="mb-4">
              Employee Leave Balance
            </h2>

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

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
                      (leave, index) => (

                        <tr key={index}>

                          {/* LEAVE TYPE */}

                          <td>

                            {typeof leave.leave_name === "object"
                              ? "-"
                              : leave.leave_name || "-"}

                          </td>

                          {/* TOTAL */}

                          <td>

                            {typeof leave.total_leaves === "object"
                              ? 0
                              : leave.total_leaves || 0}

                          </td>

                          {/* USED */}

                          <td>

                            {typeof leave.used_leaves === "object"
                              ? 0
                              : leave.used_leaves || 0}

                          </td>

                          {/* REMAINING */}

                          <td>

                            <span className="badge bg-primary">

                              {typeof leave.remaining_leaves === "object"
                                ? 0
                                : leave.remaining_leaves || 0}

                            </span>

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
                        No Leave Balance Found
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

export default LeaveBalance;