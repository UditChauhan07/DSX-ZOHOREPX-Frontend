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
import ClientSidebar from "./ClientSidebar";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { format, getMonth, getYear, isValid, parseISO } from "date-fns";
import BASE_API_URL from '../Utils/config'

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Autocomplete } from "@mui/material";

function ClientDashboard(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Name, setName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [projectIdExists, setProjectIdExists] = useState(false);
  console.log(data)

  useEffect(() => {
    // Extract unique names
    const namesSet = new Set();
    data.forEach((item) => {
      item.details.owners.forEach((ite) => {
        namesSet.add(ite.full_name);
      });
    });
    setUniqueNames(Array.from(namesSet));
  }, [data]);

  const handlelog = () => {
    localStorage.clear();
    navigate("/");
  };

  const jsonString = localStorage.getItem("Loginres");
  const ResToken = JSON.parse(jsonString);


  useEffect(() => {
    const id = localStorage.getItem("ClientProjectId")
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${BASE_API_URL}/getallClientTask/${id}`,
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

  const allowedStatuses = [
    "Closed",
    "In Progress",
    "In Review",
    "Open",
    "To be Tested",
  ];

  const filteredData = data.filter(
    (item) =>
      selectedUser === "" ||
      (item.details.owners.some((ite) => ite.full_name === selectedUser) &&
        allowedStatuses.includes(item.status.name))
  );

  const filteredDataforPIE = data.filter(
    (item) =>
      selectedUser === "" ||
      item.details.owners.some((ite) => ite.full_name === selectedUser)
  );

  // Prepare data for the bar chart
  const chartData = data.map((item) => ({
    Taskname: item.name, // Task name or project name
    startdate: item.created_time_format,
    enddate: item.end_date_format,
    value: item.value || 1,
  }));
  const COLORSS = [
    "rgb(8,174,234)",
    "rgb(255,123,215)",
    "rgb(112,240,112)",
    "rgb(245,181,131)",
    "rgb(245,107,98)",
    "#FF69B4",
  ];

  useEffect(() => {
    const storedResponseString = localStorage.getItem("Loginres");
    const storedResponse = JSON.parse(storedResponseString);

    setName(storedResponse);
  }, []);

  // STACKED BAR GRAPH

  const COLORS = {
    InProgress: "rgb(8,174,234)", // Greenrgb(18,35,158)
    InReview: "rgb(255,123,215)", // Blue
    Closed: "rgb(112,240,112)", // Red
    Tobetested: "rgb(245,181,131)",
    Open: "rgb(245,107,98)",
    // Yellow
  };

  const generateWeeklyTicks = (startDate, endDate) => {
    const ticks = [];
    const oneWeek = 1000 * 60 * 60 * 24 * 7; // milliseconds in a week
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      ticks.push(currentDate.getTime());
      currentDate = new Date(currentDate.getTime() + oneWeek);
    }

    return ticks;
  };

  const chartDataas = data.map((item) => ({
    Taskname: item.name,
    startdate: new Date(item.created_time_format).getTime(),
    enddate: new Date(item.end_date_format).getTime(),
    status: item.status.name,
    value:
      new Date(item.end_date_format).getTime() -
      new Date(item.created_time_format).getTime(),
  }));

  // Generate weekly ticks based on data range
  const minDate = Math.min(...chartDataas.map((item) => item.startdate));
  const maxDate = Math.max(...chartDataas.map((item) => item.enddate));
  const weeklyTicks = generateWeeklyTicks(minDate, maxDate);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Review":
        return COLORS.InReview;
      case "In Progress":
        return COLORS.InProgress;
      case "Closed":
        return COLORS.Closed;
      case "To be Tested":
        return COLORS.onHold;
      case "Open":
        return COLORS.Open;
      default:
        return "black"; // Default color
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`;
  };

  useEffect(() => {
    const projectid = localStorage.getItem("ClientProjectId");
    if (projectid) {
      setProjectIdExists(true);
    }
  }, []);

  return (
    <div>
      <div className="nav_1">
        <img
          src="https://status.designersx.com/css/images/cropped-logo.webp"
          className="nav_img"
        />
        <div className=" d-flex justify-content-end sizz">
          <div className="d9 d-flex">
            {/* <img src={Userimage} className="sizing1" /> */}
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
                  // href="/"
                  className="link logo1 d-flex dropdown-item"
                  onClick={handlelog}
                >
                  Logout
                </a>
              </li>
              <li>
                <a className="link logo1 d-flex dropdown-item">My Profile</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 ">
          {projectIdExists === true ? <ClientSidebar /> : <Sidebar />}

        </div>

        <div className="col-lg-9 t4">
          <div className="container">
            <p className="text-start  a2 mt-1 ">Dashboard</p>
            <p className="a3 text-start  ">
              Home / <span className=" a26">Dashboard</span>
            </p>

            <div className="main_pro">
              <div className="d-flex mt-4">
                <div className="d-flex a8">
                  <GoProjectSymlink className="a13 " />
                </div>
                <h2 className="txttt">{`Total Tasks | ${data.length} `}</h2>
              </div>
            </div>

            {/* <div className="main_pro mt-4">
              <div className="d-flex mt-4">
                <div className="d-flex a8">
                  <IoMdContacts className="a14 " />
                </div>
                <h2 className="txttt">Total Clients | 6</h2>
              </div>
            </div> */}

            {/* CHARTS */}

          

         
            {/* The Pie Chart */}
            <div style={{ display: "flex" }}>
              <ResponsiveContainer width="50%" height={400}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="Taskname"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORSS[index % COLORSS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const { Taskname, startdate, enddate } =
                          payload[0].payload;
                        return (
                          <div>
                            <p>
                              <strong>{Taskname}</strong>
                            </p>
                            <p>Start Date: {startdate}</p>
                            <p>End Date: {enddate}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div
                style={{ marginLeft: "20px", marginTop: "50px" }}
                className="piechart"
              >
                <ul>
                  {chartData.map((item, index) => (
                    <li
                      key={index}
                      style={{ color: COLORSS[index % COLORSS.length] }}
                    >
                      {item.Taskname}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="container mt-4 text-end ">
              <h4 className="hdd">Status</h4>
              <h6>
                <li class="red-bullet mt-2">Completed</li>
              </h6>
              <h6>
                <li class="blue-bullet">In Progress</li>
              </h6>
              <h6>
                {" "}
                <li class="pink-bullet jk-1">In Review</li>
              </h6>
              <h6>
                {" "}
                <li class="open-bullet jk-2">Open</li>
              </h6>
              <h6>
                {" "}
                <li class="tobe-bullet jk-3">To be Tested</li>
              </h6>
            </div>

            {/* BAR GRAPGH  */}
            <div style={{ display: "flex", marginTop: "3%" }}>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={chartDataas} layout="horizontal">
                  {" "}
           
                  <YAxis
                    type="number"
                    domain={["dataMin", "dataMax"]}
             
                    tickFormatter={(tick) => formatDate(tick)}
                  />
                  <XAxis
                    type="category"
                
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const { Taskname, startdate, enddate, status } =
                          payload[0].payload;
                        return (
                          <div>
                            <p>
                              <strong>Task Name: {Taskname}</strong>
                            </p>
                            <p>
                              <strong>
                                Start Date:{" "}
                                {new Date(startdate).toLocaleDateString()}
                              </strong>
                            </p>
                            <p>
                              <strong>
                                End Date:{" "}
                                {new Date(enddate).toLocaleDateString()}
                              </strong>
                            </p>
                            <p>
                              <strong>
                                Status:{" "}
                                {status === "Closed" ? "Completed" : status}
                              </strong>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[20, 20, 20, 20]}
                    minPointSize={3}
                    barSize={20}
                  >
            
                    {chartDataas.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.status)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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

export default ClientDashboard;
