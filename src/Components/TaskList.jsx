import React, { useEffect, useState } from "react";
import { BsColumnsGap } from "react-icons/bs";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import { GiProgression } from "react-icons/gi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { useFetcher, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import Box from "@mui/material/Box";
import { ThreeCircles } from "react-loader-spinner";
import Nav from "./Nav";

function TaskList(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();


  // Calculate the indexes of the items to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const jsonString = localStorage.getItem("Loginres");
  const ResToken = JSON.parse(jsonString);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("ProjectId"));
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:5000/getallTasks/${id}`,
          {
            accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
          }
        );
        setData(response.data.tasks);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleback = () => {
    navigate("/project-list");
  };



  return (
    <div>
      <Nav/>

      <div className="row">
        <div className="col-lg-2">
         
          <Sidebar />
        </div>

        <div className="col-lg-10 t4">
          <div className="container">
            <p className="text-start  a2 mt-1 ">Task List</p>
            <p className="a3 text-start  ">
              Home / <span className=" a26">Task List</span>
            </p>

            {/* main */}

            <div className="tabb">
              
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
                    color="rgb(13,110,253)" // Change the color to your desired color
                    ariaLabel="three-circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </Box>
              ) : (
                <>
                  <div
                    style={{
                      textAlign: "end",
                      marginTop: "2%",
                      marginRight: "3%",
                    }}
                  >
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={handleback}
                    >
                      Back
                    </button>
                  </div>
                  <hr></hr>
                  <div class="table-responsive">
                    <table class="table tb-1">
                      <thead>
                        <tr>
                          <th scope="col">S.No</th>
                          <th scope="co">Task Name</th>
                          <th scope="col">CreatedBy</th>
                          <th scope="col">Task Assigned </th>

                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentData.map((item, dataindex) => {
                          const details = item.details.owners.map((ite) => ({
                            name: ite.full_name,
                          }));

                          return (
                            <tr>
                              <th scope="row">{dataindex + 1}</th>

                              <td>{item.name}</td>
                              <td>{item.created_by_full_name}</td>
                              <td>
                                <ul>
                                  {details.map((ele, index) => (
                                    <li key={index}>{ele.name}</li>
                                  ))}
                                </ul>
                              </td>
                              <td>{item.created_time_format}</td>
                              <td>{item.end_date_format}</td>
                              {/* <td>{item?.status?.name}</td> */}
                              {/* <td>
                            <span
                              style={{
                                backgroundColor:
                                  item?.status?.name === "In Progress"
                                    ? "rgb(8,174,234)"
                                    : item?.status?.name === "Closed"
                                    ? "rgb(245,107,98)"
                                    : item?.status?.name === "Open"
                                    ? "rgb(116,203,128)"
                                    : item?.status?.name === "In Review"
                                    ? "rgb(255,123,215)"
                                    : item?.status?.name === "On Hold"
                                    ? "rgb(251,193,30)"
                                    : item?.status?.name === "To Be Tested"
                                    ? "rgb(246,169,109)"
                                    : "black", // default color
                                  
                              }}
                            >
                              {item?.status?.name}
                            </span>
                          </td> */}
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-"
                                  style={{
                                    backgroundColor:
                                      item?.status?.name === "In Progress"
                                        ? "rgb(8,174,234)"
                                        : item?.status?.name === "Closed"
                                        ? "rgb(245,107,98)"
                                        : item?.status?.name === "Open"
                                        ? "rgb(116,203,128)"
                                        : item?.status?.name === "In Review"
                                        ? "rgb(255,123,215)"
                                        : item?.status?.name === "To be Tested"
                                        ? "rgb(246,169,109)"
                                        : item?.status?.name === "On Hold"
                                        ? "rgb(251,193,30)"
                                        : "black",
                                    border: "none",
                                    color: "white",
                                  }}
                                >
                                  {item?.status?.name}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Pagination Controls */}

                    <nav aria-label="Page navigation example ">
                      <ul className="pagination justify-content-end pg-11 ">
                        {/* Previous Button */}
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <a
                            className="page-link"
                            href="#"
                            aria-label="Previous"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <a
                              className="page-link"
                              href="#"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </a>
                          </li>
                        ))}

                        {/* Next Button */}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <a
                            className="page-link"
                            href="#"
                            aria-label="Next"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            <span aria-hidden="true">&raquo;</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
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

export default TaskList;
