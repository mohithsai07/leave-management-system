import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {

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
          Employee Dashboard
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

            <h2 className="mb-4">

              Welcome,
              {" "}
              {user.first_name}
              {" "}
              {user.last_name}

            </h2>

            <div className="row">

              {/* EMPLOYEE ID */}

              <div className="col-md-4 mb-3">

                <strong>
                  Employee ID:
                </strong>

                <br />

                {user.employee_id}

              </div>

              {/* EMAIL */}

              <div className="col-md-4 mb-3">

                <strong>
                  Email:
                </strong>

                <br />

                {user.email}

              </div>

              {/* ROLE */}

              <div className="col-md-4 mb-3">

                <strong>
                  Role:
                </strong>

                <br />

                {user.role_name}

              </div>

            </div>

          </div>

        </div>

        {/* DASHBOARD ACTIONS */}

        <div className="row">

          {/* APPLY LEAVE */}

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body d-flex flex-column">

                <h2 className="mb-3">
                  Apply Leave
                </h2>

                <p className="flex-grow-1">

                  Submit a new leave request.

                </p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    navigate("/apply-leave")
                  }
                >
                  Apply Leave
                </button>

              </div>

            </div>

          </div>

          {/* MY LEAVES */}

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body d-flex flex-column">

                <h2 className="mb-3">
                  My Leaves
                </h2>

                <p className="flex-grow-1">

                  View your leave history
                  and status.

                </p>

                <button
                  className="btn btn-success w-100"
                  onClick={() =>
                    navigate("/my-leaves")
                  }
                >
                  View My Leaves
                </button>

              </div>

            </div>

          </div>

          {/* LEAVE BALANCE */}

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body d-flex flex-column">

                <h2 className="mb-3">
                  Leave Balance
                </h2>

                <p className="flex-grow-1">

                  View your remaining
                  leave balances.

                </p>

                <button
                  className="btn btn-warning w-100"
                  onClick={() =>
                    navigate("/leave-balance")
                  }
                >
                  View Leave Balance
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default EmployeeDashboard;