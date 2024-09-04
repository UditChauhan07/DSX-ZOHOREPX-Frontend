import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { LuArrowLeftFromLine } from "react-icons/lu";
import axios from "axios";
import Box from "@mui/material/Box";
import { ThreeCircles } from "react-loader-spinner";
import { PiListDashes } from "react-icons/pi";
import { useNavigate } from "react-router";
import BASE_API_URL from "../Utils/config";
import ClientSidebar from "./ClientSidebar";

function KBProjectlistClint(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const jsonString = localStorage.getItem("Loginres");
  const ResToken = JSON.parse(jsonString);
  const navigate = useNavigate();

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("ClProjectId"));
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${BASE_API_URL}/getallTasks/${id}`, {
          accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
        });
        setData(response.data.tasks);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openTasks = data.filter((task) => task.status.name === "Open");
  const progressTasks = data.filter(
    (task) => task.status.name === "In Progress"
  );
  const testedTasks = data.filter(
    (task) => task.status.name === "To be Tested"
  );
  const reviewTasks = data.filter((task) => task.status.name === "In Review");
  const closedTasks = data.filter((task) => task.status.name === "Closed");
  const onHoldTasks = data.filter((task) => task.status.name === "On hold");
  const CancelTasks = data.filter((task) => task.status.name === "Cancelled");

  const handleclick = () => {
    navigate("/Client-Tasklistview");
  };

  return (
    <div>
      <Nav />

      <div className="row">
        <div className="col-lg-2">
          <ClientSidebar />
        </div>

        <div className="col-lg-10 t4">
          <div className="container">
            <p className="text-start  a2 mt-1 ">Task List</p>
            <p className="a3 text-start  ">
              Home / <span className=" a26">Task List</span>
            </p>

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
                    marginBottom: "2%",
                    marginTop: "-5%",
                    marginRight: "1%",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleclick}
                  >
                    View in List
                  </button>
                </div>
                <div className="container main-backpage ">
                  {/* Open Tasks */}
                  <div className="container task-div mt-3">
                    <div className="d-flex text-task">
                      <button type="button" className="btn btn- open-btn mt-2">
                        Open({openTasks.length})
                      </button>
                      <button type="button" className="btn btn- arrow-btn mt-2">
                        <LuArrowLeftFromLine />{" "}
                      </button>
                    </div>
                    {openTasks.map((task, index) => (
                      <div className="listdivv mt-3" key={index}>
                        <p className="task-key">{task.key}</p>
                        <p className=" task-name">{task.name}</p>
                        <p className=" tasklist-name">
                          <PiListDashes className="taskicon" />{" "}
                          {task.tasklist.name}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </div>

                  {/* In Progress Tasks */}
                  <div className="container task-div mt-3">
                    <div className="d-flex text-task">
                      <button
                        type="button"
                        className="btn btn- progress-btn mt-2"
                      >
                        In Progress({progressTasks.length})
                      </button>
                      <button type="button" className="btn btn arrow1-btn mt-2">
                        <LuArrowLeftFromLine />{" "}
                      </button>
                    </div>
                    {progressTasks.map((task, index) => (
                      <div className="listdivv mt-3" key={index}>
                        <p className="task-key">{task.key}</p>
                        <p className=" task-name">{task.name}</p>
                        <p className=" tasklist-name">
                          <PiListDashes className="taskicon" />{" "}
                          {task.tasklist.name}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </div>

                  {/* To Be Tested Tasks */}
                  <div className="container task-div mt-3">
                    <div className="d-flex text-task">
                      <button
                        type="button"
                        className="btn btn- Tested-btn mt-2"
                      >
                        To be Tested({testedTasks.length})
                      </button>
                      <button
                        type="button"
                        className="btn btn- arrow2-btn mt-2"
                      >
                        <LuArrowLeftFromLine />{" "}
                      </button>
                    </div>
                    {testedTasks.map((task, index) => (
                      <div className="listdiv mt-3" key={index}>
                        <p className="task-key">{task.key}</p>
                        <p className=" task-name">{task.name}</p>
                        <p className=" tasklist-name">
                          <PiListDashes className="taskicon" />{" "}
                          {task.tasklist.name}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </div>

                  {/* In Review Tasks */}
                  <div className="container task-div mt-3">
                    <div className="d-flex text-task">
                      <button
                        type="button"
                        className="btn btn- review-btn mt-2"
                      >
                        In Review({reviewTasks.length})
                      </button>
                      <button
                        type="button"
                        className="btn btn- arrow3-btn mt-2"
                      >
                        <LuArrowLeftFromLine />{" "}
                      </button>
                    </div>
                    {reviewTasks.map((task, index) => (
                      <div className="listdiv mt-3" key={index}>
                        <p className="task-key">{task.key}</p>
                        <p className=" task-name">{task.name}</p>
                        <p className=" tasklist-name">
                          <PiListDashes className="taskicon" />{" "}
                          {task.tasklist.name}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </div>

                  {/* Closed Tasks */}
                  <div className="container task-div mt-3">
                    <div className="d-flex text-task">
                      <button
                        type="button"
                        className="btn btn- closed-btn mt-2"
                      >
                        Closed({closedTasks.length})
                      </button>
                      <button
                        type="button"
                        className="btn btn- arrow4-btn mt-2"
                      >
                        <LuArrowLeftFromLine />{" "}
                      </button>
                    </div>
                    {closedTasks.map((task, index) => (
                      <div className="listdiv mt-3" key={index}>
                        <p className="task-key">{task.key}</p>
                        <p className=" task-name">{task.name}</p>
                        <p className=" tasklist-name">
                          <PiListDashes className="taskicon" />{" "}
                          {task.tasklist.name}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </div>

                  {/* On Hold Tasks */}
                  <div className="container task-div mt-3">
                    <div className="d-flex text-task">
                      <button type="button" className="btn btn- hold-btn mt-2">
                        OnHold({onHoldTasks.length})
                      </button>
                      <button
                        type="button"
                        className="btn btn- arrow5-btn mt-2"
                      >
                        <LuArrowLeftFromLine />{" "}
                      </button>
                    </div>
                    {onHoldTasks.map((task, index) => (
                      <div className="listdiv mt-3" key={index}>
                        <p className="task-key">{task.key}</p>
                        <p className=" task-name">{task.name}</p>
                        <p className=" tasklist-name">
                          <PiListDashes className="taskicon" />{" "}
                          {task.tasklist.name}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KBProjectlistClint;
