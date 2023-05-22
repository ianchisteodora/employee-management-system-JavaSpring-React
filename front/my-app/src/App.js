
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/login";
import Home from "./components/home";
import Admin from "./components/admin";
import User from "./components/user";
import ChangePassword from "./components/changePassword";
import './App.css';


function App() {
  return (
    <BrowserRouter>
            <Routes>
              <Route path="/home" element= { <Home/>} />
              <Route path="/register" element= { <Register/>} />
              <Route path="/" element= { <Login/>} />
              <Route path = "/admin" element = {<Admin/>}/>
              <Route path = "/user" element = {<User/>}/>
              <Route path = "/changePassword" element = {<ChangePassword/>}/>
            </Routes>
        </BrowserRouter>
  );
}

export default App;
