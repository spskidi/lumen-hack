import React, { useState, useEffect } from "react";
import styles from "../Components/ViewPlan.module.css";

const ViewPlan = () => {
  const [activeTab, setActiveTab] = useState("Basic");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch plans dynamically from API
  useEffect(() => {
    fetch("https://example.com/api/plans") // Replace with your API endpoint
      .then((res) => res.json())
      .then((data) => {
        setPlans(data); // Assuming API returns an array of plan objects
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        setLoading(false);
      });
  }, []);

  const filteredPlans = plans.filter(plan => plan.type === activeTab);

  if (loading) {
    return <div className={styles.container}>Loading plans...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {["Basic", "Standard", "Premium"].map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className={styles.planList}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map(plan => (
            <div key={plan.id} className={styles.planCard}>
              {plan.type === "Standard" && <span className={styles.popularBadge}>Most Popular</span>}
              <h2>{plan.name}</h2>
              <p className={styles.price}>₹{plan.price}</p>
              <p className={styles.duration}>{plan.duration}</p>
              <p className={styles.description}>{plan.description}</p>
            </div>
          ))
        ) : (
          <p>No plans available for {activeTab}.</p>
        )}
      </div>
    </div>
  );
};

export default ViewPlan;
