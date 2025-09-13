import React, { useState, useEffect } from "react";
import styles from "../Components/AddPlan.module.css";

const AddPlan = () => {
  const [planData, setPlanData] = useState({
    type: "",
    name: "",
    price: "",
    duration: "",
    description: ""
  });

  const [planOptions, setPlanOptions] = useState({ types: [], durations: [] });

  useEffect(() => {
    // Fetch all plan options from a single API
    fetch("https://example.com/api/plan-options")
      .then((res) => res.json())
      .then((data) => {
        // Assume API returns { types: ["Basic","Standard"], durations: ["1 Month","3 Months"] }
        setPlanOptions(data);
      })
      .catch((err) => console.error("Error fetching plan options:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanData({ ...planData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Plan Data:", planData);
    fetch("https://example.com/api/add-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(planData)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Plan added successfully!");
        setPlanData({ type: "", name: "", price: "", duration: "", description: "" });
      })
      .catch((err) => console.error("Error adding plan:", err));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Plan</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Plan Type */}
        <div className={styles.formGroup}>
          <label>Plan Type</label>
          <select name="type" value={planData.type} onChange={handleChange} required>
            <option value="">Select type</option>
            {planOptions.types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Plan Name */}
        <div className={styles.formGroup}>
          <label>Plan Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter plan name"
            value={planData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Plan Price */}
        <div className={styles.formGroup}>
          <label>Plan Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={planData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Plan Duration */}
        <div className={styles.formGroup}>
          <label>Plan Duration</label>
          <select name="duration" value={planData.duration} onChange={handleChange} required>
            <option value="">Select duration</option>
            {planOptions.durations.map((d, index) => (
              <option key={index} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter plan details"
            value={planData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className={styles.submitBtn}>Add Plan</button>
      </form>
    </div>
  );
};

export default AddPlan;
