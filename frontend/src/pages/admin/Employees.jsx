import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Employees() {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  // =========================================
  // FETCH EMPLOYEES
  // =========================================

  const fetchEmployees = async () => {

    try {

      const response = await api.get(
        "/admin/employees"
      );

      console.log(response.data);

      setEmployees(response.data);

      setFilteredEmployees(response.data);

    } catch (error) {

      console.error(error);

      setError("Failed to load employees");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchEmployees();

  }, []);

  // =========================================
  // FILTER LOGIC
  // =========================================

  useEffect(() => {

    let filtered = [...employees];

    // SEARCH FILTER

    if (searchTerm.trim() !== "") {

      filtered = filtered.filter(
        (employee) =>

          String(employee.employee_name || "")
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          String(employee.employee_code || "")
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );
    }

    // ROLE FILTER

    if (roleFilter !== "All") {

      filtered = filtered.filter(
        (employee) =>
          employee.role_name === roleFilter
      );
    }

    // STATUS FILTER

    if (statusFilter !== "All") {

      filtered = filtered.filter(
        (employee) => {

          const status =
            employee.status === true ||
            employee.status === 1
              ? "Active"
              : "Inactive";

          return status === statusFilter;
        }
      );
    }

    setFilteredEmployees(filtered);

  }, [
    searchTerm,
    roleFilter,
    statusFilter,
    employees
  ]);

  // =========================================
  // UNIQUE ROLES
  // =========================================

  const roles = [
    "All",
    ...new Set(
      employees.map(
        (employee) =>
          String(employee.role_name || "")
      )
    )
  ];

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <h4>Loading employees...</h4>

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

      {/* PAGE CONTENT */}

      <div className="p-4">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2 className="m-0">
            Employee Management
          </h2>

          <button
            className="btn btn-success"
            onClick={() =>
              navigate("/add-employee")
            }
          >
            + Add Employee
          </button>

        </div>

        {/* ERROR */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

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
                  placeholder="Search by name or employee code"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

              {/* ROLE FILTER */}

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Filter by Role
                </label>

                <select
                  className="form-select"
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                >

                  {roles.map((role, index) => (

                    <option
                      key={index}
                      value={role}
                    >
                      {role}
                    </option>

                  ))}

                </select>

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

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* EMPLOYEE TABLE */}

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-striped table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>Employee Code</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Department</th>

                    <th>Role</th>

                    <th>Manager</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.length > 0 ? (

                    filteredEmployees.map((employee) => (

                      <tr key={employee.employee_id}>

                        {/* EMPLOYEE CODE */}

                        <td>

                          {typeof employee.employee_code === "object"
                            ? "-"
                            : employee.employee_code || "-"}

                        </td>

                        {/* NAME */}

                        <td>

                          {typeof employee.employee_name === "object"
                            ? "-"
                            : employee.employee_name || "-"}

                        </td>

                        {/* EMAIL */}

                        <td>

                          {typeof employee.email === "object"
                            ? "-"
                            : employee.email || "-"}

                        </td>

                        {/* DEPARTMENT */}

                        <td>

                          {typeof employee.department === "object"
                            ? "-"
                            : employee.department || "-"}

                        </td>

                        {/* ROLE */}

                        <td>

                          {typeof employee.role_name === "object"
                            ? "-"
                            : employee.role_name || "-"}

                        </td>

                        {/* MANAGER */}

                        <td>

                          {typeof employee.manager_name === "object"
                            ? "-"
                            : employee.manager_name || "-"}

                        </td>

                        {/* STATUS */}

                        <td>

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

                        </td>

                        {/* ACTIONS */}

                        <td>

                          {/* VIEW */}

                          <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() =>
                              navigate(
                                `/employee-details/${employee.employee_id}`
                              )
                            }
                          >
                            View
                          </button>

                          {/* EDIT */}

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              navigate(
                                `/edit-employee/${employee.employee_id}`
                              )
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
                        colSpan="8"
                        className="text-center"
                      >
                        No employees found
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

export default Employees;