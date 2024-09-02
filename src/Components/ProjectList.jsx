import React, { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ThreeCircles } from 'react-loader-spinner'
import Nav from "./Nav";
import BASE_API_URL from "../Utils/config";

function ProjectList(props) {
  const [active, IsActive] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Name, setName] = useState([]);

  const navigate = useNavigate();

  const handlelog = () => {
    localStorage.clear();
    navigate("/");
  };

  const jsonString = localStorage.getItem('Loginres');
  const ResToken = JSON.parse(jsonString);
  // console.log(ResToken.Res_Token.access_token)



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.post(`${BASE_API_URL}/getAllProjects`, {
          accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
        });
        setData(response.data.projects);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  const HandleTasklist = (id) =>{
    // console.log(id)
    localStorage.setItem('ProjectId', JSON.stringify(id))
    navigate('/Task-list')
  }
  useEffect(() => {
    const storedResponseString = localStorage.getItem("Loginres");
    const storedResponse = JSON.parse(storedResponseString);

    setName(storedResponse);
  }, []);

  return (
    <div>
   
      <Nav/>

      <div className="row">
        <div className="col-lg-2 ">
          <Sidebar />
        </div>

        <div className="col-lg-10 t4">
          <div className="container">
            <p className="text-start  a2 mt-1 ">Project List</p>
            <p className="a3 text-start  ">
              Home / <span className=" a26">Project List</span>
            </p>

            {/* main */}

            <div className="tabb">
              <div
                style={{ textAlign: "end", marginTop: "2%", marginRight: "3%" }}
              >
                <button type="button" class="btn btn-primary">
                  Auto Sync Project
                </button>
              </div>
              <hr></hr>

              {loading ? (
           
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh" // Full viewport height
              >
                <ThreeCircles
                  visible={true}
                  height="80"
                  width="100"
                  color="rgb(13,110,253)"  // Change the color to your desired color
                  ariaLabel="three-circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </Box>
        
              ) : (
                <table class="table tb-1">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Project ID</th>
                      <th scope="col">Task Action</th>

                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, productIndex) => {
                      const task = item.layout_details.task;
                      return (
                        <tr key={productIndex}>
                          <th scope="row">{productIndex + 1}</th>
                          <td>{task.name}</td>
                          <td>{item.id_string}</td>

                          <td>
                            <button type="button" class="btn btn-warning" 
                             onClick={() => HandleTasklist(item.id_string)}
                            >
                              Task-List
                            </button>
                          </td>
                          <td>
                            <button type="button" className="btn btn-primary ">
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger bbtn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <br /> <br />
          <div className="hr_line"></div>
          <p className="p11 text-center mt-2">
            {" "}
            Copyright <span className="p12">Designers X.</span> All Rights
            Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectList;
