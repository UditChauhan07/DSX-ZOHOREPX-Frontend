import React, { useEffect, useState } from 'react';
import { BsColumnsGap } from "react-icons/bs";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import { useLocation, Link } from "react-router-dom";


function Sidebar(props) {
    const [active, IsActive] = useState(1);
    const location = useLocation();

    useEffect(() => {
      // Check the current path and update the active state
      if (location.pathname === "/dashboard") {
        IsActive(1);
      } else if (location.pathname === "/Client-list") {
        IsActive(2);
      } else if (location.pathname === "/Project-list") {
        IsActive(3);
      } else if (location.pathname === "/Create-Client") {
        IsActive(4);
      }
    }, [location]);

 

    return (
        <div>
        <div
          className="dashboard"
          onClick={() => IsActive(1)}
          style={
            active === 1
              ? {
                  backgroundColor: "rgb(246,249,255)",
                  // color: "white",
                  borderRadius: "10px",
                }
              : { color: "rgb(1,41,112)" }
          }
        >
    
          <Link to="/dashboard" className="nav-link">
            <div className="d-flex justify-content-center ">
              <BsColumnsGap className="iccon" />

              <p>Dashboard</p>
            </div>
          </Link>
        </div>
        

        <div
          className="dashboard"
          onClick={() => IsActive(2)}
          style={
            active === 2
              ? {
                  backgroundColor: "rgb(246,249,255)",
                  // color: "white",
                  borderRadius: "10px",
                }
              : { color: "rgb(1,41,112)" }
          }
        >
          <Link to="/Client-list" className="nav-link">
            <div className="d-flex justify-content-center ">
              <MdOutlinePersonOutline className="iccon1" />
              <p>Client List</p>
            </div>
          </Link>
        </div>

        <div
          className="dashboard"
          onClick={() => IsActive(3)}
          style={
            active === 3
              ? {
                  backgroundColor: "rgb(246,249,255)",
                  // color: "white",
                  borderRadius: "10px",
                }
              : { color: "rgb(1,41,112)" }
          }
        >
          <Link to="/Project-list" className="nav-link">
            <div className="d-flex justify-content-center ">
              <GoProjectSymlink className="iccon2" />
              <p>Project List</p>
            </div>
          </Link>
        </div>

        <div
          className="dashboard"
          onClick={() => IsActive(4)}
          style={
            active === 4
              ? {
                  backgroundColor: "rgb(246,249,255)",
                  // color: "white",
                  borderRadius: "10px",
                }
              : { color: "rgb(1,41,112)" }
          }
        >
          <Link to="/Create-Client" className="nav-link">
            <div className="d-flex justify-content-center ">
              <MdOutlinePersonOutline className="iccon2" />
              <p>Create Client</p>
            </div>
          </Link>
        </div>

      
      </div>
    );
}

export default Sidebar;