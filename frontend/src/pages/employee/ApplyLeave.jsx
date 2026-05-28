import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function ApplyLeave() {

  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = useState([]);

  const [formData, setFormData] = useState({

    leave_type_id: "",

    start_date: "",

    end_date: "",

    reason: ""
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================================
  // FETCH LEAVE TYPES
  // =========================================

  useEffect(() => {

    fetchLeaveTypes();

  }, []);

  const fetchLeaveTypes = async () => {

    try {

      const response = await api.get(
        "/employee/leave-types"
      );

      setLeaveTypes(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load leave types"
      );

    }
  };

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });

    setError("");

    setSuccess("");
  };

  // =========================================
  // HANDLE SUBMIT
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    // =====================================
    // DATE VALIDATION
    // =====================================

    const start = new Date(
      formData.start_date
    );

    const end = new Date(
      formData.end_date
    );

    // END DATE VALIDATION

    if (end < start) {

      setError(
        "End date cannot be before start date"
      );

      return;
    }

    // PAST DATE VALIDATION

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (start < today) {

      setError(
        "Cannot apply leave for past dates"
      );

      return;
    }

    try {

      // =====================================
      // PAYLOAD
      // =====================================

      const payload = {

        leaveRequestId: null,

        leaveTypeId:
          parseInt(
            formData.leave_type_id
          ),

        fromDate:
          formData.start_date,

        toDate:
          formData.end_date,

        reason:
          formData.reason,

        notifyEmployeeId: null
      };

      // =====================================
      // API CALL
      // =====================================

      const response = await api.post(
        "/employee/upsert-leave",
        payload
      );

      // =====================================
      // HANDLE SP ERROR MESSAGE
      // =====================================

      if (
  response.data?.[0]?.message &&
  response.data[0].message !== "Success"
) {

  setError(
    response.data[0].message
  );

  return;
}

      // =====================================
      // SUCCESS
      // =====================================

      setSuccess(
        "Leave applied successfully"
      );

      // RESET FORM

      setFormData({

        leave_type_id: "",

        start_date: "",

        end_date: "",

        reason: ""
      });

    } catch (error) {

      console.error(error);

      // BACKEND MESSAGE

      if (
        error.response?.data?.[0]?.message
      ) {

        setError(
          error.response
            .data[0]
            .message
        );

      }

      else if (
        error.response?.data?.message
      ) {

        setError(
          error.response
            .data
            .message
        );

      }

      else {

        setError(
          "Failed to apply leave"
        );
      }
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    navigate("/");
  };

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
              Apply Leave
            </h2>

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

              {/* LEAVE TYPE */}

              <div className="mb-3">

                <label className="form-label">
                  Leave Type
                </label>

                <select
                  className="form-select"
                  name="leave_type_id"
                  value={
                    formData.leave_type_id
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Leave Type
                  </option>

                  {leaveTypes.map(
                    (leave) => (

                      <option
                        key={
                          leave.leave_type_id
                        }
                        value={
                          leave.leave_type_id
                        }
                      >
                        {leave.leave_name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* START DATE */}

              <div className="mb-3">

                <label className="form-label">
                  Start Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={
                    formData.start_date
                  }
                  onChange={handleChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />

              </div>

              {/* END DATE */}

              <div className="mb-3">

                <label className="form-label">
                  End Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={
                    formData.end_date
                  }
                  onChange={handleChange}
                  min={
                    formData.start_date ||

                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />

              </div>

              {/* REASON */}

              <div className="mb-4">

                <label className="form-label">
                  Reason
                </label>

                <textarea
                  className="form-control"
                  name="reason"
                  rows="4"
                  value={
                    formData.reason
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Apply Leave
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default ApplyLeave;