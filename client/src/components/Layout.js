import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility
    const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    { name: "Home", path: "/", icon: "ri-home-line" },
    { name: "Appointments", path: "/appointments", icon: "ri-file-list-line" },
    { name: "Apply Doctor", path: "/apply-doctor", icon: "ri-hospital-line" },
    { name: "Book Appointment", path:  `/book-appointment/${user?._id} `, icon: "ri-calendar-check-line" }, // Added

  ];
  

  const doctorMenu = [
    { name: "Home", path: "/", icon: "ri-home-line" },
    { name: "Appointments", path: "/doctor/appointments", icon: "ri-file-list-line" },
    { name: "Profile", path: `/doctor/profile/${user?._id}`, icon: "ri-user-line" },

  ];

  const adminMenu = [
    { name: "Home", path: "/", icon: "ri-home-line" },
    { name: "Users", path: "/admin/userslist", icon: "ri-user-line" },
    { name: "Doctors", path: "/admin/doctorslist", icon: "ri-user-star-line" },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";

  return (
    <div className="main">
      <div className="d-flex layout">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h1 className="logo">SH</h1>
            <h1 className="role">{role}</h1>
            {/* Close Button */}
            <i
              className="ri-close-line close-btn"
              onClick={() => setIsSidebarOpen(false)}
            ></i>
          </div>

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.path}
                  className={`d-flex menu-item ${isActive && "active-menu-item"}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <i className="ri-logout-circle-line"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <div className="header">
            {/* Hamburger Menu Icon */}
            <i
              className="ri-menu-line header-action-icon"
              onClick={() => setIsSidebarOpen(true)}
            ></i>

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>

              <Link className="anchor mx-2" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;