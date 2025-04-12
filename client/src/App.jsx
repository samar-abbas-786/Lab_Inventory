import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUp from "./components/signup.jsx";
import Login from "./components/login.jsx";
import AddItem from "./components/addItem.jsx";
import RequestItem from "./components/requestItem.jsx";
import ApproveRequests from "./components/approverequest.jsx";
import StudentRequests from "./components/studentRequest.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={SignUp} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/Home" Component={Home} />

          <Route path="/login" Component={Login} />
          <Route path="/add-items" Component={AddItem} />
          <Route path="/request-item" Component={RequestItem} />
          <Route path="/approve-item" Component={ApproveRequests} />
          <Route path="/student-request" Component={StudentRequests} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
