import React, { useEffect, useState } from "react";

import { useFetcher, useNavigate } from "react-router-dom";

function Nav(props) {
  const [Name, setName] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResponseString = localStorage.getItem("Loginres");
    const storedResponse = JSON.parse(storedResponseString);

    setName(storedResponse);
  }, []);

  const handlelog = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
       <div className="nav_1">
        <img
          src="https://status.designersx.com/css/images/cropped-logo.webp"
          className="nav_img"
        />
        <div className=" d-flex justify-content-end sizz">
          <div className="d9 d-flex">
            <p
              className="mt-3 d8 dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
                 {Name.user?.name}
            </p>

            <ul class="dropdown-menu">
              <li>
                <a
               
                  className="link logo1 d-flex dropdown-item"
                  onClick={handlelog}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default Nav;
