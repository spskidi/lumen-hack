import React, { useState } from "react";
import Sidebar from "../src/Components/Sidebar";
import Dashboard from "../src/Components/ViewPlan";
import AddPlan from "../src/Components/AddPlan";
import EditPlan from "./Components/EditPlan";
import DeletePlan from "./Components/DeletePlan";

const App = () => {
  const [activePage, setActivePage] = useState("dashboard"); // default page

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar fixed */}
      <div style={{ width: "250px", flexShrink: 0, height: "100vh", position: "fixed" }}>
        <Sidebar setActivePage={setActivePage} />
      </div>

      {/* Right panel scrollable */}
      <div
        style={{
          marginLeft: "250px", // equal to sidebar width
          flex: 1,
          height: "100vh",
          overflowY: "auto", // scrollable
          padding: "20px", // optional padding
        }}
      >
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "addPlan" && <AddPlan />}
        {activePage === "editPlan" && <EditPlan />}
        {activePage === "deletePlan" && <DeletePlan/>}
      </div>
    </div>
  );
};

export default App;
