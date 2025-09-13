import React, { useState, useEffect } from "react";
import styles from "./Editplan.module.css";

const EditPlan = () => {
  const [plans, setPlans] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    price: "",
    duration: "",
    description: ""
  });
  const [showModal, setShowModal] = useState(false);

  // Fetch plans dynamically from API on mount
  useEffect(() => {
    fetch("https://example.com/api/plans") // Replace with your API
      .then((res) => res.json())
      .then((data) => {
        // Assuming API returns array of plans [{id, type, name, price, duration, description}]
        const plansObj = {};
        data.forEach(plan => plansObj[plan.id] = plan);
        setPlans(plansObj);
      })
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  // Handle plan selection
  const handlePlanSelect = (e) => {
    const planId = e.target.value;
    setSelectedPlanId(planId);
    if (plans[planId]) {
      setFormData({ ...plans[planId] });
    } else {
      setFormData({ type: "", name: "", price: "", duration: "", description: "" });
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlanId) return alert("Please select a plan");
    setShowModal(true);
  };

  // Confirm update via API
  const confirmUpdate = () => {
    fetch(`https://example.com/api/plans/${selectedPlanId}`, {
      method: "PUT", // or PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((updatedPlan) => {
        setPlans(prev => ({ ...prev, [selectedPlanId]: updatedPlan }));
        setShowModal(false);
        alert("Plan updated successfully!");
      })
      .catch(err => console.error("Error updating plan:", err));
  };

  const cancelUpdate = () => setShowModal(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Plan</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Select Plan */}
        <div className={styles.formGroup}>
          <label>Select Plan</label>
          <select value={selectedPlanId} onChange={handlePlanSelect}>
            <option value="">Choose a plan</option>
            {Object.values(plans).map((plan) => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </select>
        </div>

        {/* Plan Type */}
        <div className={styles.formGroup}>
          <label>Plan Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select type</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Plan Name */}
        <div className={styles.formGroup}>
          <label>Plan Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter plan name"
          />
        </div>

        {/* Plan Price */}
        <div className={styles.formGroup}>
          <label>Plan Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>

        {/* Plan Duration */}
        <div className={styles.formGroup}>
          <label>Plan Duration</label>
          <select name="duration" value={formData.duration} onChange={handleChange}>
            <option value="">Select duration</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Update plan details"
          />
        </div>

        <button type="submit" className={styles.submitBtn}>Update Plan</button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm Update</h2>
            <p>Are you sure you want to update the plan <strong>{formData.name}</strong>?</p>
            <div className={styles.modalButtons}>
              <button className={styles.okButton} onClick={confirmUpdate}>Update</button>
              <button className={styles.cancelButton} onClick={cancelUpdate}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlan;
