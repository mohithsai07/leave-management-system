import { useNavigate } from "react-router-dom";

function ManagerDashboard() {

  const navigate = useNavigate();

  // =========================================
  // LOGGED IN USER
  // =========================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

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

        <h3 className="m-0">
          Manager Dashboard
        </h3>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* PAGE CONTENT */}

      <div className="p-4">

        {/* WELCOME CARD */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <h3 className="mb-3">

              Welcome,
              {" "}
              {user.first_name}
              {" "}
              {user.last_name}

            </h3>

            <div className="row">

              <div className="col-md-6 mb-2">

                <strong>Role:</strong>
                {" "}
                {user.role_name}

              </div>

              <div className="col-md-6 mb-2">

                <strong>Email:</strong>
                {" "}
                {user.email}

              </div>

            </div>

          </div>

        </div>

        {/* DASHBOARD CARDS */}

        <div className="row">

          {/* TEAM LEAVE OVERVIEW */}

          <div className="col-md-6 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body d-flex flex-column">

                <h2 className="mb-3">
                  Team Leave Overview
                </h2>

                <p className="flex-grow-1">

                  Check team leave history
                  and leave request status.

                </p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    navigate("/team-leaves")
                  }
                >
                  Team Leaves
                </button>

              </div>

            </div>

          </div>

          {/* PENDING REQUESTS */}

          <div className="col-md-6 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body d-flex flex-column">

                <h2 className="mb-3">
                  Pending Leave Requests
                </h2>

                <p className="flex-grow-1">

                  View and approve pending
                  leave requests from employees.

                </p>

                <button
                  className="btn btn-success w-100"
                  onClick={() =>
                    navigate("/pending-leaves")
                  }
                >
                  View Requests
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ManagerDashboard;