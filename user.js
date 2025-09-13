document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#userTable tbody");

  fetch("http://localhost:9090/users")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(users => {
      users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${user.userId}</td>
          <td>${user.name}</td>
          <td>${user.phone}</td>
          <td>${user.email}</td>
          <td>${user.status}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      tableBody.innerHTML = `<tr><td colspan="5">Failed to load data</td></tr>`;
    });
});