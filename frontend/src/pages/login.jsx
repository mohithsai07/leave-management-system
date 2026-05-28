import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/Auth/login", {
        email,
        passwordHash: password
      });

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

  const role =
  response.data.role_name;

      console.log("ROLE:", role);

      if (role === "Employee") {

        navigate("/employee");

      }
      else if (role === "Manager") {

        navigate("/manager");

      }
      else if (role === "Admin") {

        navigate("/admin");

      }
      else {

        alert("Role not found");

      }

    }
    catch (error) {

      console.log("LOGIN ERROR:", error);

      alert("Invalid Login");

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card p-4 shadow">

            <h2 className="text-center mb-4">
              Leave Management Login
            </h2>

            <form onSubmit={handleLogin}>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;