import React, { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Nav from "./Nav";

function CreateClient(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectId: "",
    password: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Name, setName] = useState([]);
  const handlelog = () => {
    localStorage.clear();
    navigate("/");
  };

  const jsonString = localStorage.getItem("Loginres");
  const ResToken = JSON.parse(jsonString);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          "http://localhost:5000/getAllProjects",
          {
            accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
          }
        );
        setData(response.data.projects);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/Createclient",
        formData
      );
      console.log("Response:", response.data);
      toast.success("Client Created Successfully..!");
      setFormData({
        name: "",
        email: "",
        projectId: "",
        password: "",
      });
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      toast.error(errorMessage.msg);
      console.error("Login failed:", errorMessage.msg);
    }
  };

  useEffect(() => {
    const storedResponseString = localStorage.getItem("Loginres");
    const storedResponse = JSON.parse(storedResponseString);

    setName(storedResponse);
  }, []);


  return (
    <div>
    <Nav/>

      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 t4">
          <div className="container">
            <p className="text-start  a2 mt-1 ">Create Client</p>
            <p className="a3 text-start  ">
              Home / <span className=" a26">Create Client</span>
            </p>

            {/* main */}

            <div className="tabb">
              <div className="container">
                <div className="form-group mt-3">
                  <label htmlFor="exampleFormControlInput1">Enter Name</label>
                  <input
                    type="text"
                    className="form-control mt-2"
                    id="exampleFormControlInput1"
                    placeholder="Enter your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="exampleFormControlInput2">Enter Email</label>
                  <input
                    type="email"
                    className="form-control mt-2"
                    id="exampleFormControlInput2"
                    placeholder="Enter your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="exampleFormControlSelect1">
                    Select Project
                  </label>
                  <select
                    className="form-control mt-2"
                    id="exampleFormControlSelect1"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Please Select Project
                    </option>
                    {data.map((item) => {
                      return (
                        <option key={item.id_string} value={item.id_string}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="exampleFormControlInput3">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    className="form-control mt-2"
                    id="exampleFormControlInput3"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary mt-4 mb-5"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
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

export default CreateClient;
