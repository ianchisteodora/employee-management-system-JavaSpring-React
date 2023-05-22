import { useState } from "react";
import axios from "axios";

function ChangePassword({ onCancel, onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  async function save(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/user/changePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        alert("Password changed successfully!");
        onSuccess(); // Call the onSuccess callback provided by the parent component
      } else {
        setError("Failed to change password");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Change Password</h2>
        <form onSubmit={save}>
          <div className="form-group">
            <label>Old Password</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="button-container">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
