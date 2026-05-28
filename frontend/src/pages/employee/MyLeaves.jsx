import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function MyLeaves() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH MY LEAVES
  // =========================================

  const fetchMyLeaves = async () => {

    try {

      const response = await api.get(
        "/Employee/my-leaves"
      );

      console.log(
        "MY LEAVES:",
        response.data
      );

      setLeaves(response.data);

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to fetch leaves"
      );

    }
    finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchMyLeaves();

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
          Loading leave requests...
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
              My Leave Requests
            </h2>

            <div className="table-responsive">

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

                  {leaves.length > 0 ? (

                    leaves.map((leave) => (

                      <tr key={leave.leave_request_id}>

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

                        {/* REASON */}

                        <td>

                          {typeof leave.reason === "object"
                            ? "-"
                            : leave.reason || "-"}

                        </td>

                        {/* STATUS */}

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

                            {leave.status || "Pending"}

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

      </div>

    </div>

  );

}

export default MyLeaves;