import React, { useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext);
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <div className="login-navbar">
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost"><li>Create Post</li></Link>
          <Link  to="/followingpost">
            <li>Following</li>
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={() => setModalOpen(true)}>
              Log Out
            </button>
          </Link>
        </div>,
      ];
    } else {
      return [
        <div className="Signup-nav">
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
            <li>SignIn</li>
          </Link>
        </div>,
      ];
    }
  };

  return (
    <div className="navbar">
      <Link to={""} className="Link"><h1>ShortPost</h1></Link>
      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
}
