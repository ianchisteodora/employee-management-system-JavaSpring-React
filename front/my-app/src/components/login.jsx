import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/user/login", {
        email: email,
        password: password,
      });

      console.log("Response data:", response.data);

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("token", token);
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/user");
        } else {
          setError("Unknown user role");
        }
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function register() {
    navigate("/register");
  }

  function forgotPassword() {
    // Add the logic for the "Forgot Password" functionality here
    console.log("Forgot Password clicked");
  }


  return (
    <div className="container">
      <div className="login-form">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="button-group">
            <button
              type="button"
              className="btn btn-link btn-forgot-password"
              onClick={forgotPassword}
            >
              Forgot Password
            </button>

            <button
              type="button"
              className="btn btn-link btn-register"
              onClick={register}
            >
              Register
            </button>
          </div>

          <button type="submit" className="btn btn-primary" onClick={login}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
