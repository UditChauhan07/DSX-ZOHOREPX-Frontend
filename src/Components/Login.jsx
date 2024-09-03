
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BASE_API_URL from '../Utils/config'

function Login() {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email ")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/login`, values);
      if (response.data) {
        const { access_token, expires_in } = response.data.Res_Token;
        console.log(access_token)
        localStorage.setItem('accessToken', access_token);
        const expirationTime = new Date().getTime() + expires_in * 1000;
        localStorage.setItem('tokenExpiration', expirationTime);
        const responseString = JSON.stringify(response.data);
        localStorage.setItem('Loginres', responseString);
        navigate("/dashboard");
        console.log(response.data);
        toast.success("Logged in successfully");
      } else {
        console.log("Something went wrong, please try again.");
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
 
      toast.error(`Login failed: ${errorMessage.error}`);
      console.error("Login failed:", errorMessage);
    }
      // toast.error("Invalid email or password");
     finally {
      setSubmitting(false); // Set submitting to false when done
    }
  };

  const handleClientlogin = () => {
    navigate('/Client-login')
  }


  return (
    <div className="jl2">
     
     <button type="button" className="btn btn-primary  cl-btn " onClick={handleClientlogin}>Click to Client Login</button>

      <div className="">
      <div className="jl1">
        <div className="card cdd">
          <div className="card-body">
            <img
              src="https://status.designersx.com/css/images/cropped-logo.webp"
              className="iimmg"
            />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="lg5 mt-4">
                  <h3 className="lg3 text-center pt-2">
                    Login to Admin Account
                  </h3>
                  <p className="lg4 text-secondary text-center">
                    Enter your Email & Password to login
                  </p>
                  <div className="form-group">
                    <label htmlFor="email" className="l7">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control mt-2"
                      id="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="password" className="l7">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control mt-2"
                      id="password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="form-group mt-3">
                    <button
                      type="submit"
                      className="btn-btn form-control text-white lg6 p-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                  </div>

                  <p className="card-text mt-2 text-center">
                    <a href="#" className="l6">
                      Forgot password?
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}

export default Login;
