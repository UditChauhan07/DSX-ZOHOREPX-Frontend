import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useFetcher, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import ClientSidebar from "./ClientSidebar";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { AreaChart, Area, CartesianGrid } from "recharts";
import Box from "@mui/material/Box";
import { ThreeCircles } from "react-loader-spinner";
import Nav from "./Nav";
import BASE_API_URL from "../Utils/config";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Autocomplete } from "@mui/material";
import ClientDashboard from "./ClientDashboard";

function Dashboard(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Projectdata, setProjectData] = useState([]);
  const [Name, setName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [projectIdExists, setProjectIdExists] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([
    "In Progress",
    "In Review",
    "To be Tested",
  ]);
  const [selectedFrequency, setSelectedFrequency] = useState("Monthly");

  useEffect(() => {
    // You can add any side effects here if needed when selectedStatuses changes
  }, [selectedStatuses]);

  const jsonString = localStorage.getItem("Loginres");
  const ResToken = JSON.parse(jsonString);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.post(`${BASE_API_URL}/getAllProjects`, {
          accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
        });
        setProjectData(response.data.projects);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formattedData = Projectdata.map((project) => ({
    name: project.name, // Using project name as the X-axis label
    openTasks: project.task_count.open, // Open tasks count
    closedTasks: project.task_count.closed, // Closed tasks count
    startDate: project.start_date, // Project start date (optional, if you want to use this)
    // Add any other properties you want to plot
  }));

  const handleProjectSelect = async (event) => {
    const selectedName = event.target.value;
    const project = Projectdata.find(
      (project) => project.name === selectedName
    );
    setSelectedProjectId(project?.id_string);
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}/getallTasks/${project?.id_string}`,
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
  // const chartData = filteredDataforPIE.map((item) => ({
  //   Taskname: item.name, // Task name or project name
  //   startdate: item.created_time_format,
  //   enddate: item.end_date_format,
  //   value: item.value || 1,
  // }));

  const aggregatedData = filteredDataforPIE.reduce((acc, item) => {
    const statusName = item.status.name; // Access status name correctly
    acc[statusName] = (acc[statusName] || 0) + 1; // Increment the count of each status name
    return acc;
  }, {});

  // Convert aggregated data to array format for chart
  const chartData = Object.entries(aggregatedData).map(([status, count]) => ({
    status, // status name like 'Open', 'In Review', etc.
    value: count, // Number of tasks for that status
  }));

  const relevantData = filteredDataforPIE.filter(
    (item) =>
      item.billingtype === "Billable" || item.billingtype === "Non Billable"
  );
 


  const aggregatedDataas = relevantData.reduce((acc, item) => {
    const billableType = item.billingtype;
    acc[billableType] = (acc[billableType] || 0) + 1;
    return acc;
  }, {});

  const charttData = Object.entries(aggregatedDataas).map(
    ([billableType, count]) => ({
      billableType, // 'Billable' or 'Non-Billable'
      value: count, // Number of tasks for each billable type
    })
  );
  // console.log(charttData);

  const BILLIABLE_COLORS = {
    Billable: "rgb(77,209,232)", // Red for 'Open'
    "Non Billable": "rgb(250,181,98)", // Pink for 'In Review'
    None: "rgb(245,107,98)", // Blue for 'In Progress'
  };

  const STATUS_COLORS = {
    Open: "rgb(116,203,128)", // Red for 'Open'
    "In Review": "rgb(255,123,215)", // Pink for 'In Review'
    "In Progress": "rgb(8,174,234)", // Blue for 'In Progress'
    "On Hold": "rgb(251,193,30)", // Orange for 'On Hold'
    Cancelled: "rgb(85,141,202)", // Green for 'Cancelled'
    Closed: "rgb(245,107,98)",
    "To be Tested": "rgb(246,169,109)",
  };

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

  const handlecheckbox = (event) => {
    const { value, checked } = event.target;
    setSelectedStatuses((prev) =>
      checked ? [...prev, value] : prev.filter((status) => status !== value)
    );
  };

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
        return "black";
    }
  };

  useEffect(() => {
    const projectid = localStorage.getItem("ClientProjectId");
    if (projectid) {
      setProjectIdExists(true);
    }
  }, []);

  // NEW CODE OF FILTERS

  const groupDataByFrequency = (data, frequency) => {
    const groupedData = {};

    data.forEach((item) => {
      const taskDate = new Date(item.created_time_format);
      let key;

      if (frequency === "Daily") {
        key = taskDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      } else if (frequency === "Weekly") {
        const weekStartDate = new Date(
          taskDate.setDate(taskDate.getDate() - taskDate.getDay())
        );
        key = weekStartDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      } else if (frequency === "Monthly") {
        key = `${taskDate.toLocaleDateString("en-US", {
          month: "long",
        })} ${taskDate.getFullYear()}`;
      } else if (frequency === "Yearly") {
        key = taskDate.getFullYear().toString();
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          Taskname: item.name,
          startdate: new Date(item.created_time_format).getTime(),
          enddate: new Date(item.end_date_format).getTime(),
          status: item.status.name,
          value: new Date(item.created_time_format).getTime(),
          CompletePercentage: item.percent_complete,
        };
      } else {
        // Increment count or aggregate based on your requirement
        groupedData[key].value += 1;
      }
    });

    return Object.values(groupedData);
  };

  // Filter data and group by selected frequency
  const chartDataas = groupDataByFrequency(
    filteredData.filter((item) => selectedStatuses.includes(item.status.name)),
    selectedFrequency
  );

  const minValue = Math.min(...chartDataas.map((data) => data.startdate));
  const maxValue = Math.max(...chartDataas.map((data) => data.enddate));

  const formatDates = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // pie chart filteres

  const [selectedpiestatus, setselectedpiestatus] = useState([
    "Open",
    "In Review", 
    "In Progress", 
    "On Hold", 
    "Cancelled",
    "Closed",
    "To be Tested",
  ]);

  const filteredChartData = chartData.filter((item) =>
    selectedpiestatus.includes(item.status)
  );

  const handleCheckboxChange = (status) => {
    setselectedpiestatus(
      (prevSelected) =>
        prevSelected.includes(status)
          ? prevSelected.filter((s) => s !== status) // Remove if unchecked
          : [...prevSelected, status] // Add if checked
    );
  };


  const { totalBillableHours, totalNonBillableHours } = relevantData.reduce(
    (acc, item) => {
      const billableHours = parseFloat(item.log_hours.billable_hours) || 0; 
      const nonBillableHours = parseFloat(item.log_hours.non_billable_hours) || 0;
  
      acc.totalBillableHours += billableHours;
      acc.totalNonBillableHours += nonBillableHours;
  
      return acc;
    },
    { totalBillableHours: 0, totalNonBillableHours: 0 }
  );
  
  // Format to two decimal places
  const formattedBillableHours = totalBillableHours.toFixed(2);
  const formattedNonBillableHours = totalNonBillableHours.toFixed(2);
  const formattedTotalHours = (totalBillableHours + totalNonBillableHours).toFixed(2);
  

  

  return (
    <div>
      {projectIdExists === true ? (
        <ClientDashboard />
      ) : (
        <>
          <Nav />

          <div className="row">
            <div className="col-lg-2 ">
              {projectIdExists === true ? <ClientSidebar /> : <Sidebar />}
            </div>

            <div className="col-lg-10 t4">
              <div className="container">
                <p className="text-start  a2 mt-1 ">Dashboard</p>
                <p className="a3 text-start  ">
                  Home / <span className=" a26">Dashboard</span>
                </p>

                <div className="row mt-4">
                  <div className="col-lg-4 a41">
                    <p className="d-flex a5 mt-2">Total Projects</p>
                    <div className="d-flex">
                      <div className="d-flex a8">
                        <AiOutlineShoppingCart className="a9 " />
                      </div>
                      <h4 className="aq1">{Projectdata?.length}</h4>
                    </div>
                    <p className="aq2">Total Projects</p>
                  </div>
                  <div className="col-lg-4 a43">
                    <p className="d-flex a5 mt-2">Total Clients</p>
                    <div className="d-flex">
                      <div className="d-flex a8">
                        <AiOutlineShoppingCart className="a13 " />
                      </div>
                      <h4 className="aq1">29</h4>
                    </div>
                    <p className="aq2a">Total Clients</p>
                  </div>
                  <div className="col-lg-4 a42">
                    <p className="d-flex a5 mt-2">Total Task</p>
                    <div className="d-flex">
                      <div className="d-flex a8">
                        <AiOutlineShoppingCart className="a14 " />
                      </div>
                      <h4 className="aq1">{data?.length}</h4>
                    </div>
                    <p className="aq2b">Total Task</p>
                  </div>
                </div>

                {/* CHARTS */}

                {/* AREA CHART  */}

                <div className="linechatt">
                  <div className="mt-3 d-flex justify-content-end">
                    {/* <h5>Select Project :-</h5> */}
                    <select
                      className="form-select sel-project"
                      aria-label="Default select example"
                      onChange={handleProjectSelect}
                    >
                      <option value="">Select a Project</option>
                      {Projectdata.map((item, index) => (
                        <option key={index} value={item.item_string}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={400}
                    className="mt-3"
                  >
                    <AreaChart data={formattedData}>
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="openTasks"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="closedTasks"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {selectedProjectId ? (
                  <>
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
                        <h4 className="text-center mt-3">Users Report</h4>

                        <div className=" d-flex ">
                          <div className="mt-3 dateselect1">
                            {/* <h5>Select User :-</h5> */}
                            <select
                              class="form-select"
                              aria-label="Default select example"
                              value={selectedUser}
                              onChange={(e) => setSelectedUser(e.target.value)}
                            >
                              <option value="">Select a User</option>
                              {uniqueNames.map((name, index) => (
                                <option key={index} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-3 dateselect">
                            {/* <h5>Select User :-</h5> */}
                            <select
                              class="form-select datselect"
                              aria-label="Default select example"
                              value={selectedFrequency}
                              onChange={(e) =>
                                setSelectedFrequency(e.target.value)
                              }
                            >
                              <option value="">Select a Date</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </select>
                          </div>
                        </div>

                        <div className="container mt-3 d-flex ststas">
                          {/* <h4 className="hdd">Status</h4> */}
                          <h6>
                            <li class="red-bullet ">
                              <span>
                                {" "}
                                <input
                                  className="jk-3"
                                  type="checkbox"
                                  value="Closed"
                                  onChange={handlecheckbox}
                                />
                              </span>{" "}
                              Completed
                            </li>
                          </h6>
                          <h6>
                            <li class="blue-bullet">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="In Progress"
                                  onChange={handlecheckbox}
                                  defaultChecked={true}
                                />
                              </span>{" "}
                              In Progress
                            </li>
                          </h6>
                          <h6>
                            <li class="pink-bullet ">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="In Review"
                                  onChange={handlecheckbox}
                                  defaultChecked={true}
                                />
                              </span>{" "}
                              In Review
                            </li>
                          </h6>
                          <h6>
                            <li class="open-bullet ">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="Open"
                                  onChange={handlecheckbox}
                                />
                              </span>{" "}
                              Open
                            </li>
                          </h6>
                          <h6>
                            <li class="tobe-bullet">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="To be Tested"
                                  onChange={handlecheckbox}
                                  defaultChecked={true}
                                />
                              </span>{" "}
                              To be Tested
                            </li>
                          </h6>
                        </div>

                        {/* BAR GRAPGH  */}
                        <div style={{ display: "flex", marginTop: "3%" }}>
                          <ResponsiveContainer
                            width="100%"
                            height={500}
                            className=""
                          >
                            <BarChart data={chartDataas} layout="vertical">
                              <XAxis
                                type="number"
                                scale="time"
                                domain={[minValue, maxValue]}
                                tickFormatter={(tick) => formatDates(tick)}
                              />
                              {/* <YAxis type="category" dataKey="Taskname" /> */}
                              <YAxis
                                type="category"
                                dataKey="Taskname"
                                tick={({ x, y, payload }) => {
                                  const fullText = payload.value;
                                  const words = fullText.split(" ");
                                  const truncatedText =
                                    words.slice(0, 1).join(" ") +
                                    (words.length > 1 ? ".." : ""); // Truncate to 4 words

                                  return (
                                    <g transform={`translate(${x},${y})`}>
                                      <text
                                        x={0} // Align text horizontally
                                        y={0}
                                        dy={4} // Adjust vertical alignment
                                        textAnchor="end" // Align text to the right
                                        style={{
                                          fontSize: "14px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <title>{fullText}</title>{" "}
                                        {/* Tooltip with full text */}
                                        {truncatedText}
                                      </text>
                                    </g>
                                  );
                                }}
                              />
                              <Tooltip
                                content={({ payload }) => {
                                  if (payload && payload.length) {
                                    const {
                                      Taskname,
                                      startdate,
                                      enddate,
                                      status,
                                      CompletePercentage,
                                    } = payload[0].payload;
                                    return (
                                      <div className="container tooltipgraph">
                                        <p className="mt-2">
                                          <strong>Task Name: {Taskname}</strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Start Date:{" "}
                                            {new Date(
                                              startdate
                                            ).toLocaleDateString()}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            End Date:{" "}
                                            {new Date(
                                              enddate
                                            ).toLocaleDateString()}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Status:{" "}
                                            {status === "Closed"
                                              ? "Completed"
                                              : status}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Complete Percentage:{" "}
                                            {CompletePercentage}
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
                                barSize={30}
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

                        {/* The Pie Chart */}
                        <h4 className="text-center mt-3">Task Reports</h4>

                        <div className="d-flex">
                          <ResponsiveContainer width="35%" height={300}>
                            <PieChart>
                              <Pie
                                data={filteredChartData}
                                dataKey="value"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                              >
                                {filteredChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      STATUS_COLORS[entry.status] || "#8884d8"
                                    } // Assign color based on status or default
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                content={({ payload }) => {
                                  if (payload && payload.length) {
                                    const { status, value } =
                                      payload[0].payload;
                                    return (
                                      <div className="container tooltipgraph">
                                        <p className="mt-2">
                                          <strong>Status: {status}</strong>
                                        </p>
                                        <p>
                                          {" "}
                                          <strong> Tasks: {value} </strong>
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>

                          <div
                            style={{ marginLeft: "10px", marginTop: "40px" }}
                            className=""
                          >
                            <ul>
                              {chartData.map((item, index) => (
                                <li
                                  key={index}
                                  style={{
                                    color:
                                      STATUS_COLORS[item.status] || "#8884d8",
                                    fontWeight: "600",
                                    fontSize: "18px", // Assign color based on status or default
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedpiestatus.includes(
                                      item.status
                                    )} // Bind to state
                                    onChange={() =>
                                      handleCheckboxChange(item.status)
                                    } // Update state on change
                                    defaultChecked={true}
                                  />
                                  <span> {item.status} </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                         

                          <ResponsiveContainer
                            width="35%"
                            height={300}
                            className="piiis"
                          >
                            <PieChart>
                              <Pie
                                data={charttData}
                                dataKey="value"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                              >
                                {charttData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      BILLIABLE_COLORS[entry.billableType] ||
                                      "#8884d8"
                                    } // Assign color based on status or default
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                content={({ payload }) => {
                                  if (payload && payload.length) {
                                    const { billableType, value } =
                                      payload[0].payload;
                                    return (
                                      <div className="container tooltipgraph">
                                        <p className="mt-2">
                                          <strong>
                                            Billaible Type: {billableType}
                                          </strong>
                                        </p>
                                        <p>
                                          {" "}
                                          <strong> Value: {value} </strong>
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* <div
                            style={{ marginLeft: "10px", marginTop: "40px" }}
                            className=""
                          >
                            <ul>
                              {charttData.map((item, index) => (
                                <li
                                  key={index}
                                  style={{
                                    color:
                                      BILLIABLE_COLORS[item.billableType] ||
                                      "#8884d8",
                                    fontWeight: "600",
                                    fontSize: "18px", // Assign color based on status or default
                                  }}
                                >
                                  {item.billableType}
                                </li>
                              ))}
                            </ul>
                          </div> */}
                        </div>

                        <div className="row">
                          <div className="col-lg-6">

                          </div>
                          <div className="col-lg-6 mt-4 ">
                          <ul className="main-hour">
                            <li className="billiable-hour">Billiable <br/>{formattedBillableHours}</li>
                            <li className="nonbiliable-hour">Non-Billiable <br/>{formattedNonBillableHours}</li>
                            <li className="total-hour">Total<br/>{formattedTotalHours} </li>
                          </ul>

                          </div>
                       
                        </div>  

                    
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
