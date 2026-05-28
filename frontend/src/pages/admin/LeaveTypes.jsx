import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function LeaveTypes() {

  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({

    leaveTypeId: null,

    leaveName: "",

    totalLeaves: "",

    description: "",

    status: true
  });

  // =========================================
  // FETCH LEAVE TYPES
  // =========================================

  const fetchLeaveTypes = async () => {

    try {

      const response = await api.get(
        "/admin/leave-types"
      );

      console.log(response.data);

      setLeaveTypes(response.data);

    } catch (error) {

      console.error(error);

      setError("Failed to load leave types");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchLeaveTypes();

  }, []);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setError("");

    setSuccess("");
  };

  // =========================================
  // HANDLE EDIT
  // =========================================

  const handleEdit = (leaveType) => {

    setIsEdit(true);

    setFormData({

      leaveTypeId:
        leaveType.leave_type_id,

      leaveName:
        typeof leaveType.leave_name === "object"
          ? ""
          : leaveType.leave_name,

      totalLeaves:
        typeof leaveType.total_leaves === "object"
          ? ""
          : leaveType.total_leaves,

      description:
        typeof leaveType.description === "object"
          ? ""
          : leaveType.description || "",

      status:
        leaveType.status
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {

    setIsEdit(false);

    setFormData({

      leaveTypeId: null,

      leaveName: "",

      totalLeaves: "",

      description: "",

      status: true
    });
  };

  // =========================================
  // HANDLE SUBMIT
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    try {

      const payload = {

        leaveTypeId:
          formData.leaveTypeId,

        leaveName:
          formData.leaveName,

        totalLeaves:
          parseInt(formData.totalLeaves),

        description:
          formData.description,

        status:
          formData.status === true ||
          formData.status === "true"
      };

      const response = await api.post(
        "/admin/upsert-leave-type",
        payload
      );

      setSuccess(
        response.data[0]?.message ||
        "Leave type saved successfully"
      );

      fetchLeaveTypes();

      resetForm();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to save leave type"
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <h4>Loading leave types...</h4>

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

      <div className="p-4">

        {/* FORM */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <h3 className="mb-4">

              {isEdit
                ? "Edit Leave Type"
                : "Add New Leave Type"}

            </h3>

            {/* ERROR */}

            {error && (

              <div className="alert alert-danger">
                {error}
              </div>

            )}

            {/* SUCCESS */}

            {success && (

              <div className="alert alert-success">
                {success}
              </div>

            )}

            <form onSubmit={handleSubmit}>

              {/* LEAVE NAME */}

              <div className="mb-3">

                <label className="form-label">
                  Leave Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="leaveName"
                  value={formData.leaveName}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* TOTAL LEAVES */}

              <div className="mb-3">

                <label className="form-label">
                  Total Leaves
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="totalLeaves"
                  value={formData.totalLeaves}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />

              </div>

              {/* STATUS */}

              <div className="mb-4">

                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value={true}>
                    Active
                  </option>

                  <option value={false}>
                    Inactive
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  {isEdit
                    ? "Update Leave Type"
                    : "Add Leave Type"}

                </button>

                {isEdit && (

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

        {/* TABLE */}

        <div className="card shadow border-0">

          <div className="card-body">

            <h3 className="mb-3">
              Existing Leave Types
            </h3>

            <div className="table-responsive">

              <table className="table table-striped table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>Leave Name</th>

                    <th>Total Leaves</th>

                    <th>Description</th>

                    <th>Status</th>

                    <th>Created At</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {leaveTypes.length > 0 ? (

                    leaveTypes.map((leaveType) => (

                      <tr key={leaveType.leave_type_id}>

                        {/* LEAVE NAME */}

                        <td>

                          {typeof leaveType.leave_name === "object"
                            ? "-"
                            : leaveType.leave_name || "-"}

                        </td>

                        {/* TOTAL LEAVES */}

                        <td>

                          {typeof leaveType.total_leaves === "object"
                            ? 0
                            : leaveType.total_leaves || 0}

                        </td>

                        {/* DESCRIPTION */}

                        <td>

                          {typeof leaveType.description === "object"
                            ? "-"
                            : leaveType.description || "-"}

                        </td>

                        {/* STATUS */}

                        <td>

                          {leaveType.status === true ||
                          leaveType.status === 1 ? (

                            <span className="badge bg-success">
                              Active
                            </span>

                          ) : (

                            <span className="badge bg-danger">
                              Inactive
                            </span>

                          )}

                        </td>

                        {/* CREATED AT */}

                        <td>

                          {leaveType.created_at &&
                          typeof leaveType.created_at !== "object"

                            ? new Date(
                                leaveType.created_at
                              ).toLocaleDateString()

                            : "-"}

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              handleEdit(leaveType)
                            }
                          >
                            Edit
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
                        No leave types found
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

export default LeaveTypes;