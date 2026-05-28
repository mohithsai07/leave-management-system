import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function AddEmployee() {

  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);

  const [managers, setManagers] = useState([]);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({

    firstName: "",

    lastName: "",

    email: "",

    passwordHash: "",

    roleId: "",

    managerId: "",

    department: "",

    status: "true"
  });

  // =========================================
  // FETCH ROLES
  // =========================================

  const fetchRoles = async () => {

    try {

      const response = await api.get(
        "/admin/roles"
      );

      setRoles(response.data);

    } catch (error) {

      console.error(error);

      setError("Failed to load roles");

    }
  };

  // =========================================
  // FETCH MANAGERS
  // =========================================

  const fetchManagers = async () => {

    try {

      const response = await api.get(
        "/admin/employees"
      );

      const managerList = response.data.filter(
        (employee) =>
          employee.role_name === "Manager"
      );

      setManagers(managerList);

    } catch (error) {

      console.error(error);

      setError("Failed to load managers");

    }
  };

  useEffect(() => {

    fetchRoles();

    fetchManagers();

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
  // HANDLE SUBMIT
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      const payload = {

        employeeId: null,

        firstName:
          formData.firstName,

        lastName:
          formData.lastName,

        email:
          formData.email,

        passwordHash:
          formData.passwordHash,

        roleId:
          parseInt(formData.roleId),

        managerId:
          formData.managerId
            ? parseInt(formData.managerId)
            : null,

        department:
          formData.department,

        status:
          formData.status === "true"
      };

      const response = await api.post(
        "/admin/upsert-employee",
        payload
      );

      setSuccess(
        response.data[0]?.message ||
        "Employee added successfully"
      );

      // RESET FORM

      setFormData({

        firstName: "",

        lastName: "",

        email: "",

        passwordHash: "",

        roleId: "",

        managerId: "",

        department: "",

        status: "true"
      });

    } catch (error) {

      console.error(error);

      if (error.response?.data?.message) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Failed to add employee"
        );

      }
    }
  };

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

        <div className="card shadow border-0">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h2 className="m-0">
                Add Employee
              </h2>

            </div>

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

              {/* FIRST NAME */}

              <div className="mb-3">

                <label className="form-label">
                  First Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* LAST NAME */}

              <div className="mb-3">

                <label className="form-label">
                  Last Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />

              </div>

              {/* EMAIL */}

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                  required
                />

              </div>

              {/* PASSWORD */}

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DEPARTMENT */}

              <div className="mb-3">

                <label className="form-label">
                  Department
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ROLE */}

              <div className="mb-3">

                <label className="form-label">
                  Role
                </label>

                <select
                  className="form-select"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Role
                  </option>

                  {roles.map((role) => (

                    <option
                      key={role.role_id}
                      value={role.role_id}
                    >
                      {role.role_name}
                    </option>

                  ))}

                </select>

              </div>

              {/* MANAGER */}

              <div className="mb-3">

                <label className="form-label">
                  Manager
                </label>

                <select
                  className="form-select"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Manager
                  </option>

                  {managers.map((manager) => (

                    <option
                      key={manager.employee_id}
                      value={manager.employee_id}
                    >
                      {manager.employee_name}
                    </option>

                  ))}

                </select>

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

                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Inactive
                  </option>

                </select>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Add Employee
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddEmployee;