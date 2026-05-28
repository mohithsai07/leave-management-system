import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function PendingLeaves() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH PENDING LEAVES
  // =========================================

  const fetchPendingLeaves = async () => {

    try {

      const response = await api.get(
        "/Manager/pending"
      );

      console.log(
        "PENDING LEAVES:",
        response.data
      );

      setLeaves(response.data);

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to fetch pending leaves"
      );

    }
    finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchPendingLeaves();

  }, []);

  // =========================================
  // APPROVE LEAVE
  // =========================================

  const approveLeave = async (
    leaveRequestId
  ) => {

    try {

      await api.put(
        "/Manager/approve",
        {
          leaveRequestId:
            leaveRequestId,

          managerComments:
            "Approved"
        }
      );

      alert("Leave Approved");

      fetchPendingLeaves();

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to approve leave"
      );

    }
  };

  // =========================================
  // REJECT LEAVE
  // =========================================

  const rejectLeave = async (
    leaveRequestId
  ) => {

    try {

      await api.put(
        "/Manager/reject",
        {
          leaveRequestId:
            leaveRequestId,

          managerComments:
            "Rejected"
        }
      );

      alert("Leave Rejected");

      fetchPendingLeaves();

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to reject leave"
      );

    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <h4>
          Loading pending leaves...
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

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h1 className="m-0">
            Pending Leave Requests
          </h1>

        </div>

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>Employee</th>

                    <th>Leave Type</th>

                    <th>From Date</th>

                    <th>To Date</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {leaves.length > 0 ? (

                    leaves.map((leave) => (

                      <tr key={leave.leave_request_id}>

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

                          <span className="badge bg-warning text-dark">

                            {leave.status || "Pending"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              approveLeave(
                                leave.leave_request_id
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              rejectLeave(
                                leave.leave_request_id
                              )
                            }
                          >
                            Reject
                          </button>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center"
                      >
                        No Pending Leaves
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

export default PendingLeaves;