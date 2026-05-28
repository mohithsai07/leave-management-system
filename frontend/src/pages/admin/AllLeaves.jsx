import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AllLeaves() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  const [filteredLeaves, setFilteredLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");

  // =========================================
  // FETCH LEAVES
  // =========================================

  const fetchLeaves = async () => {

    try {

      const response = await api.get(
        "/admin/all-leaves"
      );

      setLeaves(response.data);

      setFilteredLeaves(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchLeaves();

  }, []);

  // =========================================
  // FILTER LOGIC
  // =========================================

  useEffect(() => {

    let filtered = [...leaves];

    // STATUS FILTER

    if (statusFilter !== "All") {

      filtered = filtered.filter(
        (leave) =>
          leave.status === statusFilter
      );
    }

    // SEARCH FILTER

    if (searchTerm.trim() !== "") {

      filtered = filtered.filter(
        (leave) =>
          leave.employee_name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );
    }

    // LEAVE TYPE FILTER

    if (leaveTypeFilter !== "All") {

      filtered = filtered.filter(
        (leave) =>
          leave.leave_name === leaveTypeFilter
      );
    }

    setFilteredLeaves(filtered);

  }, [
    statusFilter,
    searchTerm,
    leaveTypeFilter,
    leaves
  ]);

  // =========================================
  // UNIQUE LEAVE TYPES
  // =========================================

  const leaveTypes = [
    "All",
    ...new Set(
      leaves.map(
        (leave) => leave.leave_name
      )
    )
  ];

  // =========================================
  // STATUS BADGE
  // =========================================

  const getStatusBadge = (status) => {

    switch (status) {

      case "Approved":
        return "bg-success";

      case "Rejected":
        return "bg-danger";

      default:
        return "bg-warning text-dark";
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="container mt-5">
        <h4>Loading leave requests...</h4>
      </div>
    );
  }

  return (

    <div className="container-fluid">

      {/* TOP NAVBAR */}

      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

        <h3 className="m-0">
          All Leave Requests
        </h3>

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
            className="btn btn-danger"
            onClick={() => {

              localStorage.removeItem("token");

              localStorage.removeItem("role");

              navigate("/");
            }}
          >
            Logout
          </button>

        </div>

      </div>

      <div className="p-4">

        {/* FILTERS */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <div className="row">

              {/* SEARCH */}

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Search Employee
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter employee name"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

              {/* STATUS FILTER */}

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Filter by Status
                </label>

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >

                  <option value="All">
                    All
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>

              </div>

              {/* LEAVE TYPE FILTER */}

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Filter by Leave Type
                </label>

                <select
                  className="form-select"
                  value={leaveTypeFilter}
                  onChange={(e) =>
                    setLeaveTypeFilter(e.target.value)
                  }
                >

                  {leaveTypes.map((type, index) => (

                    <option
                      key={index}
                      value={type}
                    >
                      {type}
                    </option>

                  ))}

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-striped table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>ID</th>

                    <th>Employee</th>

                    <th>Department</th>

                    <th>Leave Type</th>

                    <th>From Date</th>

                    <th>To Date</th>

                    <th>Total Days</th>

                    <th>Status</th>

                    <th>Applied At</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLeaves.length > 0 ? (

                    filteredLeaves.map((leave) => (

                      <tr key={leave.leave_request_id}>

                        <td>
                          {leave.leave_request_id}
                        </td>

                        <td>
                          {leave.employee_name}
                        </td>

                        <td>
                          {leave.department}
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
                          {leave.total_days}
                        </td>

                        <td>

                          <span
                            className={`badge ${getStatusBadge(
                              leave.status
                            )}`}
                          >
                            {leave.status}
                          </span>

                        </td>

                        <td>
                          {new Date(
                            leave.applied_at
                          ).toLocaleDateString()}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="9"
                        className="text-center"
                      >
                        No leave requests found
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

export default AllLeaves;