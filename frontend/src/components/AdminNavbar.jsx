import { useNavigate } from "react-router-dom";

function AdminNavbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    navigate("/");
  };

  return (

    <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

      {/* LEFT BUTTONS */}

      <div className="d-flex gap-2 flex-wrap">

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

        <button
          className="btn btn-warning"
          onClick={() =>
            navigate("/leave-types")
          }
        >
          Leave Types
        </button>

        <button
          className="btn btn-info"
          onClick={() =>
            navigate("/all-leaves")
          }
        >
          All Leaves
        </button>

      </div>

      {/* LOGOUT */}

      <button
        className="btn btn-danger"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default AdminNavbar;