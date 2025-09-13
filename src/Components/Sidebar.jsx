import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>Admin Dashboard</h2>
        <ul className={styles.menu}>
          <li
            className={activePage === "dashboard" ? styles.active : ""}
            onClick={() => setActivePage("dashboard")}
          >
            View Plan
          </li>
          <li
            className={activePage === "addPlan" ? styles.active : ""}
            onClick={() => setActivePage("addPlan")}
          >
            Add Plan
          </li>
          <li
            className={activePage === "editPlan" ? styles.active : ""}
            onClick={() => setActivePage("editPlan")}
          >
            Edit Plan
          </li>
          <li
            className={activePage === "deletePlan" ? styles.active : ""}
            onClick={() => setActivePage("deletePlan")}
          >
            Delete Plan
          </li>
        </ul>
      </div>

      {/* Right Panel */}
      <div className={`${styles.rightPanel} ${styles[activePage]}`}>
        {activePage === "dashboard" && <h2>View Plan Panel</h2>}
        {activePage === "addPlan" && <h2>Add Plan Panel</h2>}
        {activePage === "editPlan" && <h2>Edit Plan Panel</h2>}
        {activePage === "deletePlan" && <h2>Delete Plan Panel</h2>}
      </div>
    </div>
  );
};

export default Sidebar;
