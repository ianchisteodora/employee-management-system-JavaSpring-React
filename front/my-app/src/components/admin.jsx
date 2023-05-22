import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false); 
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newTask, setNewTask] = useState({ // New state
    name: "",
    description: "",
    dueDate: "",
    employee: "",
    status: "",
  });
  const handleAddUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddUserSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/user/signup",
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log("User added successfully!");
        fetchUsers(); // Refresh the user list after adding a new user
        setShowAddUserPopup(false); // Hide the add user popup
      } else {
        console.log("Failed to add user");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  


  async function fetchUsers() {
    try {
      const response = await axios.get("http://localhost:8081/user/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data);
        setShowUsers(true);
      } else {
        console.log("Failed to fetch users");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

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

  async function updateUserStatus(userId, status) {
    try {
      const response = await axios.post(
        "http://localhost:8081/user/update",
        {
          id: userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("User status updated successfully!");
        fetchUsers(); // Refresh the user list after updating the status
      } else {
        console.log("Failed to update user status");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteUser(userId) {
    try {
      const response = await axios.delete(`http://localhost:8081/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 200) {
        console.log("User deleted successfully!");
        fetchUsers(); // Refresh the user list after deleting the user
      } else {
        console.log("Failed to delete user");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  
  

  async function deleteTask(taskID){
    try{

      const response = await axios.delete(`http://localhost:8081/task/delete/{id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 200) {
        console.log("Task deleted successfully!");
        fetchUsers(); // Refresh the user list after deleting the user
      } else {
        console.log("Failed to delete task");
      }

    }catch(err){
      console.log(err.message);
    }
  }

  function toggleTasksList() {
    if (showTasks) {
      setShowTasks(false); // Hide the tasks list if it's already visible
    } else {
      fetchTasks(); // Fetch and show the tasks list
    }
  }

  function verifyUser() {
    if (showUsers) {
      setShowUsers(false); // Hide the user list if it's already visible
    } else {
      fetchUsers(); // Fetch and show the user list
    }
  }


  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function assignTask() {
    setShowAddTaskPopup(true); // Show the add task popup
  }

  const handleAddTaskInputChange = (event) => { 
    const { name, value } = event.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddTaskSubmit = async (event) => { 
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/task/add",
        {
          name: newTask.name,
          description: newTask.description,
          dueDate: newTask.dueDate,
          employee: newTask.employee,
          status: newTask.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Task added successfully!");
        fetchTasks(); // Refresh the task list after adding a new task
        setShowAddTaskPopup(false); // Hide the add task popup
      } else {
        console.log("Failed to add task");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Admin Page</h2>
      <div className="button-group">
        <button type="button" className="btn btn-primary" onClick={toggleTasksList}>
          {showTasks ? "Hide Tasks" : "View Tasks"}
        </button>
        <button type="button" className="btn btn-primary" onClick={verifyUser}>
          Users
        </button>
        <button type="button" className="btn btn-primary" onClick={assignTask}>
          Assign Task
        </button>
        <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowAddUserPopup(true)}>
        Add User
      </button>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      {showAddUserPopup && (
  <div className="add-popup">
    <h3>Add User</h3>
    <form onSubmit={handleAddUserSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newUser.name}
          onChange={handleAddUserInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleAddUserInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleAddUserInputChange}
        />
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-primary">
          Add
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowAddUserPopup(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

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
              <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{showUsers && (
  <div className="user-list">
    <h3>User List</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.email}</td>
            <td>{user.status}</td>
            <td>
              {user.status === "true" ? (
                <button className="btn btn-danger" onClick={() => updateUserStatus(user.id, "false")}>
                  Deactivate
                </button>
              ) : (
                <button className="btn btn-success" onClick={() => updateUserStatus(user.id, "true")}>
                  Activate
                </button>
              )}
              <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



{showAddTaskPopup && ( // New section for the add task popup
        <div className="add-popup">
          <h3>Add Task</h3>
          <form onSubmit={handleAddTaskSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTask.name}
                onChange={handleAddTaskInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleAddTaskInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="text"
                id="dueDate"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleAddTaskInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="employee">Employee:</label>
              <input
                type="text"
                id="employee"
                name="employee"
                value={newTask.employee}
                onChange={handleAddTaskInputChange}
              />
            </div>
            
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Add
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddTaskPopup(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;