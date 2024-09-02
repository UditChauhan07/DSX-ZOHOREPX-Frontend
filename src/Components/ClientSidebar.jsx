import React, { useEffect, useState } from 'react';
import { BsColumnsGap } from "react-icons/bs";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import { GiProgression } from "react-icons/gi";

import { useLocation, Link } from "react-router-dom";


function Sidebar(props) {
    const [active, IsActive] = useState(1);
    // const [projectIdExists, setProjectIdExists] = useState(false);
    const location = useLocation();

    useEffect(() => {
      // Check the current path and update the active state
      if (location.pathname === "/dashboard") {
        IsActive(1);
      } else if (location.pathname === "/Client-Tasklist") {
        IsActive(2);
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
          <Link to="/Client-Tasklist" className="nav-link">
            <div className="d-flex justify-content-center ">
              <MdOutlinePersonOutline className="iccon1" />
              <p>Task List</p>
            </div>
          </Link>
        </div>

     

  

      
      </div>
    );
}

export default Sidebar;