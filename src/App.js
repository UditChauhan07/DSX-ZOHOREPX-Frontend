import logo from "./logo.svg";
import "./App.css";
import Login from "./Components/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import toast, { Toaster } from "react-hot-toast";
import ProjectList from "./Components/ProjectList";
import ClientList from "./Components/ClientList";
import TaskList from "./Components/TaskList";
import ProtectedRoute from './Utils/Protectedroute';
import CreateClient from "./Components/CreateClient";
import ClientTasklist from "./Components/ClientTasklist";
import ClientLogin from "./Components/ClientLogin";
import NewTaskList from "./Components/NewTaskList";

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />
          <Route path="/Client-login" element={<ClientLogin/>} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-list"
            element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Client-list"
            element={
              <ProtectedRoute>
                <ClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Task-list"
            element={
              <ProtectedRoute>
                {/* <TaskList /> */}
                <NewTaskList/>
              </ProtectedRoute>
            }
          />
            <Route
            path="/ListTask-list"
            element={
              <ProtectedRoute>
                <TaskList />
          
              </ProtectedRoute>
            }
          />
                <Route
            path="/Create-Client"
            element={
              <ProtectedRoute>
                <CreateClient/>
              </ProtectedRoute>
            }
          />
             <Route
            path="/Client-Tasklist"
            element={
              <ProtectedRoute>
               <ClientTasklist/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
