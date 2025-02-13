document.addEventListener("DOMContentLoaded", () => {
    const bookingTableBody = document.getElementById("bookingTableBody");

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let packages = JSON.parse(localStorage.getItem("packages")) || [];

    function loadBookings() {
        bookingTableBody.innerHTML = "";

        bookings.forEach((booking, index) => {
            const user = users.find(user => user.email === booking.userEmail) || { name: "Unknown" };
            const packageData = packages.find(pkg => pkg.name === booking.packageTitle) || { name: "Unknown Package", price: "0" };

            const travelDate = new Date(booking.travelDate);
            const today = new Date();

            const canDelete = travelDate < today;
            const canEdit = travelDate >= today;

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${packageData.name}</td>
                <td>${booking.persons}</td>
                <td>
                    <span class="status-text" id="statusText-${index}">${booking.status}</span>
                    <select class="status-select" id="statusSelect-${index}" data-index="${index}" style="display: none;">
                        <option value="Pending" ${booking.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Approved" ${booking.status === "Approved" ? "selected" : ""}>Approved</option>
                        <option value="Canceled" ${booking.status === "Canceled" ? "selected" : ""}>Canceled</option>
                    </select>
                </td>
                <td>${booking.bookingDate}</td>
                <td>${booking.travelDate}</td>
                <td>
                   ${packageData.price}
                </td>
                <td>
                   ${packageData.price * booking.persons}
                </td>
                <td>
                    <button class="action-btn edit-btn" id="editBtn-${index}" ${canEdit ? "" : "style='display: none;'"}>Edit</button>
                    <button class="action-btn delete-btn" id="deleteBtn-${index}" ${canDelete ? "" : "style='display: none;'"}>Delete</button>
                </td>
            `;
            bookingTableBody.appendChild(row);

            document.getElementById(`editBtn-${index}`).addEventListener("click", () => toggleEdit(index));
            document.getElementById(`deleteBtn-${index}`).addEventListener("click", () => deleteBooking(index));
        });
    }
    function toggleEdit(index) {
        const statusText = document.getElementById(`statusText-${index}`);
        const statusSelect = document.getElementById(`statusSelect-${index}`);
        const editBtn = document.getElementById(`editBtn-${index}`);

        if (editBtn.textContent === "Edit") {
            statusText.style.display = "none";
            statusSelect.style.display = "inline-block";
            editBtn.textContent = "Save";
        } else {
            bookings[index].status = statusSelect.value;
            localStorage.setItem("bookings", JSON.stringify(bookings));

            statusText.textContent = statusSelect.value;
            statusText.style.display = "inline";
            statusSelect.style.display = "none";
            editBtn.textContent = "Edit";
        }
    }



    function deleteBooking(index) {
        bookings.splice(index, 1);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        loadBookings();
    }

    loadBookings();
});
