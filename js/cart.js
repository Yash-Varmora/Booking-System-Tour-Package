function checkAuth() {
    const user = localStorage.getItem("loggedInUser");

    if (!user) {
        alert("Access denied! Please log in.");
        window.location.href = "auth.html";
    }
}
checkAuth();

document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const historyContainer = document.getElementById("booking-history");

    let selectedPackage = JSON.parse(localStorage.getItem("selectedPackage"));
    let booking = JSON.parse(localStorage.getItem("booking")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    let userEmail = loggedInUser?.email || "";

    if (selectedPackage) {
        if (!booking[selectedPackage.id] && !bookings.some(b => b.packageTitle === selectedPackage.name && b.userEmail === userEmail)) {
            booking[selectedPackage.id] = {
                userEmail,
                packageTitle: selectedPackage.name,
                packagePrice: selectedPackage.price,
                persons: 1,
                totalPrice: selectedPackage.price,
                status: "Pending",
                travelDate: new Date().toISOString().split("T")[0],
                bookingDate: new Date().toISOString(),
            };

            localStorage.setItem("booking", JSON.stringify(booking));
        }

        localStorage.removeItem("selectedPackage");
    }

    renderCart();
    renderHistory();

    function renderCart() {
        cartContainer.innerHTML = "<h2>Current Bookings</h2>";

        if (Object.keys(booking).length === 0) {
            cartContainer.innerHTML += "<p>No current bookings.</p>";
            return;
        }

        Object.keys(booking).forEach((key) => {
            let item = booking[key];

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <h3>${item.packageTitle}</h3>
                <p><strong>Package Price:</strong> &#8377;${item.packagePrice}</p>
                <p><strong>Persons:</strong> 
                    <button onclick="updatePeople('${key}', -1)">➖</button>
                    <span id="people-count-${key}">${item.persons}</span>
                    <button onclick="updatePeople('${key}', 1)">➕</button>
                </p>
                <p><strong>Total Price:</strong> &#8377;<span id="total-price-${key}">${item.totalPrice}</span></p>
                <p>
                    <label><strong>Travel Date:</strong> 
                        <input type="date" id="date-${key}" value="${item.travelDate}" onchange="updateDate('${key}')">
                    </label>
                </p>
                <p><strong>Booking Date:</strong> ${new Date(item.bookingDate).toLocaleString()}</p>
                <div class="cart-buttons">
                    <button class="book" onclick="confirmBooking('${key}')">Book</button>
                    <button class="delete" onclick="deleteBooking('${key}')">Delete</button>
                </div>
            `;

            cartContainer.appendChild(cartItem);
        });

        localStorage.setItem("booking", JSON.stringify(booking));
    }

    window.updatePeople = function (key, change) {
        if (booking[key].persons + change >= 1) {
            booking[key].persons += change;
            booking[key].totalPrice = booking[key].persons * booking[key].packagePrice;

            document.getElementById(`people-count-${key}`).textContent = booking[key].persons;
            document.getElementById(`total-price-${key}`).textContent = booking[key].totalPrice;

            localStorage.setItem("booking", JSON.stringify(booking));
        }
    };

    window.updateDate = function (key) {
        let newDate = document.getElementById(`date-${key}`).value;
        booking[key].travelDate = newDate;
        localStorage.setItem("booking", JSON.stringify(booking));
    };

    window.confirmBooking = function (key) {
        bookings.push({ ...booking[key] });

        delete booking[key];

        localStorage.setItem("booking", JSON.stringify(booking));
        localStorage.setItem("bookings", JSON.stringify(bookings));

        renderCart();
        renderHistory();
        alert("Booking done successfully!");
    };

    window.deleteBooking = function (key) {
        if (confirm("Are you sure you want to delete this booking?")) {
            delete booking[key];

            localStorage.setItem("booking", JSON.stringify(booking));

            renderCart();
        }
    };

    function renderHistory() {
        historyContainer.innerHTML = "<h2>Booking History</h2>";

        let userBookings = (bookings.filter(item => item.userEmail === userEmail)).reverse();

        if (userBookings.length === 0) {
            historyContainer.innerHTML += "<p>No past bookings.</p>";
            return;
        }

        userBookings.forEach((item, index) => {
            let historyItem = document.createElement("div");
            historyItem.classList.add("history-item");

            let travelDate = new Date(item.travelDate);
            let currentDate = new Date();

            let cancelBtn = "";
            let deleteBtn = "";
            let editBtn = "";

            if (item.status === "Pending") {
                editBtn = `<button class="edit" onclick="enableEdit(${index})">Edit</button>`;
            }
            if (item.status === "Canceled" || travelDate < currentDate) {
                deleteBtn = `<button class="delete" onclick="deleteHistory(${index})">Delete</button>`;
            } else if (travelDate > currentDate) {
                cancelBtn = `<button class="cancel" onclick="cancelBooking(${index})">Cancel Booking</button>`;
            }

            historyItem.innerHTML = `
                <h3>${item.packageTitle}</h3>
                <p><strong>Package Price:</strong> &#8377;${item.packagePrice}</p>
                <p><strong>Persons:</strong> <span id="persons-${index}">${item.persons}</span></p>
                <p><strong>Total Price:</strong> &#8377;<span id="total-${index}">${item.totalPrice}</span></p>
                <p><strong>Travel Date:</strong> 
                    <input type="date" id="edit-date-${index}" value="${item.travelDate}" disabled>
                </p>
                <p><strong>Booking Date:</strong> ${new Date(item.bookingDate).toLocaleString()}</p>
                <p><strong>Status:</strong> ${item.status}</p>
                <div class="history-buttons">
                    ${editBtn}
                    ${cancelBtn}
                    ${deleteBtn}
                </div>
            `;

            historyContainer.appendChild(historyItem);
        });
    }

    window.enableEdit = function (index) {
        let dateInput = document.getElementById(`edit-date-${index}`);
        let personsSpan = document.getElementById(`persons-${index}`);
        
        if (dateInput.disabled) {
            dateInput.disabled = false;
            
            personsSpan.innerHTML = `
                <button onclick="updateHistoryPersons(${index}, -1)">➖</button>
                <span id="edit-persons-${index}">${bookings[index].persons}</span>
                <button onclick="updateHistoryPersons(${index}, 1)">➕</button>
            `;

            let buttonsContainer = document.querySelectorAll(".history-buttons")[index];
            if (!buttonsContainer.querySelector(".save-btn")) {
                let saveBtn = document.createElement("button");
                saveBtn.classList.add("edit", "save-btn");
                saveBtn.textContent = "Save";
                saveBtn.onclick = function () { saveEdit(index); };
                buttonsContainer.appendChild(saveBtn);
            }
        }
    };

    window.updateHistoryPersons = function (index, change) {
        let newPersons = bookings[index].persons + change;
        if (newPersons >= 1) {
            bookings[index].persons = newPersons;
            bookings[index].totalPrice = bookings[index].persons * bookings[index].packagePrice;
            
            document.getElementById(`edit-persons-${index}`).textContent = newPersons;
            document.getElementById(`total-${index}`).textContent = bookings[index].totalPrice;
        }
    };

    window.saveEdit = function (index) {
        bookings[index].travelDate = document.getElementById(`edit-date-${index}`).value;
        bookings[index].persons = parseInt(document.getElementById(`edit-persons-${index}`).textContent);
        bookings[index].totalPrice = bookings[index].persons * bookings[index].packagePrice;

        localStorage.setItem("bookings", JSON.stringify(bookings));
        renderHistory();
        alert("Booking updated successfully!");
    };


    window.cancelBooking = function (index) {
        if (confirm("Are you sure you want to cancel this booking?")) {
            bookings[index].status = "Canceled";
            localStorage.setItem("bookings", JSON.stringify(bookings));
            renderHistory();
        }
    };

    window.deleteHistory = function (index) {
        if (confirm("Are you sure you want to delete this booking history?")) {
            bookings.splice(index, 1);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            renderHistory();
        }
    };
});
function updateAuthButton() {
    const authContainer = document.getElementById("authContainer");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
        authContainer.innerHTML = `
            <div class="profile-menu">
                <button class="profile-button">${user.name[0].toUpperCase()}</button>
                <div class="dropdown-content">
                    <button id="logoutBtn">Sign Out</button>
                </div>
            </div>
        `;

        document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    } else {
        window.location.href = "auth.html";
    }
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

updateAuthButton();