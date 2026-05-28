import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function TeamLeaves() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================
  // FETCH TEAM LEAVES
  // =========================================

  const fetchTeamLeaves = async () => {

    try {

      const response = await api.get(
        "/Manager/team-leaves"
      );

      console.log(
        "TEAM LEAVES:",
        response.data
      );

      setLeaves(response.data);

    } catch (error) {

      console.log(error);

      setError(
        "Failed to fetch team leaves"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchTeamLeaves();

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
          Loading team leaves...
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
            navigate("/manager")
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

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2 className="m-0">
            Team Leave Overview
          </h2>

        </div>

        {/* ERROR */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

        {/* TABLE */}

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-striped table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>Employee</th>

                    <th>Leave Type</th>

                    <th>From Date</th>

                    <th>To Date</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {leaves.length > 0 ? (

                    leaves.map((leave, index) => (

                      <tr key={index}>

                        {/* EMPLOYEE */}

                        <td>

                          {typeof leave.employee_name === "object"
                            ? "-"
                            : leave.employee_name || "-"}

                        </td>

                        {/* LEAVE TYPE */}

                        <td>

                          {typeof leave.leave_name === "object"
                            ? "-"
                            : leave.leave_name || "-"}

                        </td>

                        {/* FROM DATE */}

                        <td>

                          {leave.from_date
                            ? new Date(
                                leave.from_date
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* TO DATE */}

                        <td>

                          {leave.to_date
                            ? new Date(
                                leave.to_date
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* STATUS */}

                        <td>

                          {leave.status === "Approved" ? (

                            <span className="badge bg-success">
                              Approved
                            </span>

                          ) : leave.status === "Rejected" ? (

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

      </div>

    </div>

  );
}

export default TeamLeaves;