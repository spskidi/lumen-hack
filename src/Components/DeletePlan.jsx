import React, { useState, useEffect } from "react";
import styles from "../Components/DeletePlan.module.css";

const DeletePlan = () => {
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const plansPerPage = 10;

  // Fetch plans dynamically from API
  useEffect(() => {
    fetch("https://example.com/api/plans") // Replace with your API endpoint
      .then(res => res.json())
      .then(data => {
        setPlans(data); // Assuming API returns array of plan objects with id, type, name, price, duration, description
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching plans:", err);
        setLoading(false);
      });
  }, []);

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  const handleSelect = (id) => {
    if (selectedPlans.includes(id)) {
      setSelectedPlans(selectedPlans.filter(planId => planId !== id));
    } else {
      setSelectedPlans([...selectedPlans, id]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedPlans.length === 0) {
      alert("Please select at least one plan to delete.");
      return;
    }
    setShowModal(true);
  };

  const confirmDelete = () => {
    // Call API to delete plans
    Promise.all(
      selectedPlans.map(id =>
        fetch(`https://example.com/api/plans/${id}`, { method: "DELETE" })
      )
    )
      .then(() => {
        setPlans(prev => prev.filter(plan => !selectedPlans.includes(plan.id)));
        setSelectedPlans([]);
        setShowModal(false);
        if ((currentPage - 1) * plansPerPage >= plans.length - selectedPlans.length) {
          setCurrentPage(1);
        }
        alert("Selected plans deleted successfully!");
      })
      .catch(err => console.error("Error deleting plans:", err));
  };

  const cancelDelete = () => setShowModal(false);

  const selectedPlanNames = plans
    .filter(plan => selectedPlans.includes(plan.id))
    .map(plan => plan.name);

  if (loading) return <div className={styles.container}>Loading plans...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Delete Plans</h1>

      <input
        type="text"
        placeholder="Search plans..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchBox}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Type</th>
            <th>Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {currentPlans.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.noPlans}>No plans found.</td>
            </tr>
          ) : (
            currentPlans.map(plan => (
              <tr
                key={plan.id}
                className={selectedPlans.includes(plan.id) ? styles.selectedRow : ""}
                onClick={() => handleSelect(plan.id)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPlans.includes(plan.id)}
                    onChange={() => handleSelect(plan.id)}
                  />
                </td>
                <td>{plan.type}</td>
                <td>{plan.name}</td>
                <td>₹{plan.price}</td>
                <td>{plan.duration}</td>
                <td>{plan.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? styles.activePage : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button className={styles.deleteButton} onClick={handleDeleteClick}>
        Delete Selected
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the following plan(s)?</p>
            <ul>
              {selectedPlanNames.map(name => <li key={name}>{name}</li>)}
            </ul>
            <div className={styles.modalButtons}>
              <button onClick={confirmDelete} className={styles.okButton}>OK</button>
              <button onClick={cancelDelete} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePlan;
