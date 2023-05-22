import { useState, useEffect } from "react";
import ChangePassword from "./changePassword";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function User() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await axios.get("http://localhost:8081/task/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setTasks(response.data);
        setShowTasks(true);
      } else {
        console.log("Failed to fetch tasks");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteTask(taskId) {
    try {
      const response = await axios.delete(`http://localhost:8081/task/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 200) {
        console.log("Task deleted successfully!");
        fetchTasks(); // Refresh the task list after deleting the task
      } else {
        console.log("Failed to delete task");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  

  async function updateTaskStatus(taskID, status) {
    try {
      const response = await axios.post(
        "http://localhost:8081/task/update",
        {
          id: taskID,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Task status updated successfully!");
        fetchTasks(); // Refresh the task list after updating the status
      } else {
        console.log("Failed to update task status");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  function toggleTasksList() {
    if (showTasks) {
      setShowTasks(false); // Hide the task list if it's already visible
    } else {
      fetchTasks(); // Fetch and show the task list
    }
  }

  function handleChangePassword() {
    setShowChangePassword(true);
  }

  function handleCancelChangePassword() {
    setShowChangePassword(false);
  }

  function handleSuccessChangePassword() {
    setShowChangePassword(false);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <h1>User page</h1>

      <div className="btn-group-vertical" role="group">
        <button type="button" className="btn btn-primary" onClick={toggleTasksList}>
          View Tasks
        </button>
        <button type="button" className="btn btn-primary" onClick={handleChangePassword}>
          Change password
        </button>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      {showTasks && (
        <div className="task-list">
          <h3>Task List</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.dueDate}</td>
                  <td>{task.employee}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === "true" ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => updateTaskStatus(task.id, "false")}
                      >
                        Completed
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => updateTaskStatus(task.id, "true")}
                      >
                        To do
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showChangePassword && (
        <ChangePassword
          onCancel={handleCancelChangePassword}
          onSuccess={handleSuccessChangePassword}
        />
      )}
    </div>
  );
}

export default User;
