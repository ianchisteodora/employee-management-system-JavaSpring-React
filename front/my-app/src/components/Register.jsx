import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8081/user/signup", {
        name: name,
        email: email,
        password: password,
      });
      alert("Successfully registered!");
    } catch (err) {
      alert(err);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function back() {
    navigate("/");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ textAlign: "center" }}>Employee Registration</h1>
      <div style={{ width: "50%", marginTop: "2rem" }}>
        <form>
          <div className="form-group">
            <label>Employee name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              {showPassword ? (
                <FaEyeSlash
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <FaEye className="password-toggle-icon" onClick={togglePasswordVisibility} />
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit" className="btn btn-primary mr-2" onClick={save}>
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={back}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
