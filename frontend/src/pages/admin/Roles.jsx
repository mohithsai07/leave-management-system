import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Roles() {

  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({

    roleId: null,

    roleName: ""

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

    }
    catch (error) {

      console.error(error);

      setError("Failed to load roles");

    }
    finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchRoles();

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

  };

  // =========================================
  // HANDLE EDIT
  // =========================================

  const handleEdit = (role) => {

    setIsEdit(true);

    setFormData({

      roleId: role.role_id,

      roleName: role.role_name

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

      roleId: null,

      roleName: ""

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

        roleId: formData.roleId,

        roleName: formData.roleName

      };

      const response = await api.post(

        "/admin/upsert-role",

        payload

      );

      setSuccess(

        response.data.message ||

        "Role saved successfully"

      );

      fetchRoles();

      resetForm();

    }
    catch (error) {

      console.error(error);

      setError(

        error.response?.data ||

        "Failed to save role"

      );

    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <h4>Loading roles...</h4>

      </div>

    );
  }

  return (

    <div className="container-fluid p-0">

      {/* NAVBAR */}

      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

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

                ? "Edit Role"

                : "Add New Role"}

            </h3>

            {error && (

              <div className="alert alert-danger">

                {error}

              </div>

            )}

            {success && (

              <div className="alert alert-success">

                {success}

              </div>

            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">

                  Role Name

                </label>

                <input
                  type="text"
                  className="form-control"
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  {isEdit

                    ? "Update Role"

                    : "Add Role"}

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

              Existing Roles

            </h3>

            <div className="table-responsive">

              <table className="table table-striped table-hover">

                <thead className="table-dark">

                  <tr>

                    <th>Role ID</th>

                    <th>Role Name</th>

                    <th>Created At</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {roles.length > 0 ? (

                    roles.map((role) => (

                      <tr key={role.role_id}>

                        <td>

                          {role.role_id}

                        </td>

                        <td>

                          {role.role_name}

                        </td>

                        <td>

                          {new Date(
                            role.created_at
                          ).toLocaleDateString()}

                        </td>

                        <td>

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              handleEdit(role)
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
                        colSpan="4"
                        className="text-center"
                      >
                        No roles found
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

export default Roles;