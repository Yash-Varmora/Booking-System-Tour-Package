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
                packagePrice: selectedPackage.price, // Added package price
                persons: 1,
                totalPrice: selectedPackage.price, // Initial total price
                status: "Pending",
                travelDate: new Date().toISOString().split("T")[0], // Default to today
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
                <p><strong>Package Price:</strong> $${item.packagePrice}</p>
                <p><strong>Persons:</strong> 
                    <button onclick="updatePeople('${key}', -1)">➖</button>
                    <span id="people-count-${key}">${item.persons}</span>
                    <button onclick="updatePeople('${key}', 1)">➕</button>
                </p>
                <p><strong>Total Price:</strong> $<span id="total-price-${key}">${item.totalPrice}</span></p>
                <p>
                    <label><strong>Travel Date:</strong> 
                        <input type="date" id="date-${key}" value="${item.travelDate}" onchange="updateDate('${key}')">
                    </label>
                </p>
                <p><strong>Booking Date:</strong> ${new Date(item.bookingDate).toLocaleString()}</p>
                <div class="cart-buttons">
                    <button onclick="confirmBooking('${key}')">Book</button>
                    <button onclick="deleteBooking('${key}')">Delete</button>
                </div>
            `;

            cartContainer.appendChild(cartItem);
        });

        localStorage.setItem("booking", JSON.stringify(booking));
    }

    window.updatePeople = function (key, change) {
        if (booking[key].persons + change >= 1) {
            booking[key].persons += change;
            booking[key].totalPrice = booking[key].persons * booking[key].packagePrice; // Update total price

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
        alert("Booking done successfully!");

        // Move booking to history
        bookings.push({ ...booking[key] });

        // Remove from current bookings
        delete booking[key];

        localStorage.setItem("booking", JSON.stringify(booking));
        localStorage.setItem("bookings", JSON.stringify(bookings));

        renderCart();
        renderHistory();
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

        let userBookings = bookings.filter(item => item.userEmail === userEmail);

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

            if (item.status === "Cancelled" || travelDate < currentDate) {
                deleteBtn = `<button onclick="deleteHistory(${index})">Delete</button>`;
            } else if (travelDate > currentDate) {
                cancelBtn = `<button onclick="cancelBooking(${index})">Cancel Booking</button>`;
            }

            historyItem.innerHTML = `
                <h3>${item.packageTitle}</h3>
                <p><strong>Package Price:</strong> $${item.packagePrice}</p>
                <p><strong>Persons:</strong> ${item.persons}</p>
                <p><strong>Total Price:</strong> $${item.totalPrice}</p>
                <p><strong>Travel Date:</strong> ${item.travelDate}</p>
                <p><strong>Booking Date:</strong> ${new Date(item.bookingDate).toLocaleString()}</p>
                <p><strong>Status:</strong> ${item.status}</p>
                <div class="history-buttons">
                    ${cancelBtn}
                    ${deleteBtn}
                </div>
            `;

            historyContainer.appendChild(historyItem);
        });
    }

    window.cancelBooking = function (index) {
        if (confirm("Are you sure you want to cancel this booking?")) {
            bookings[index].status = "Cancelled";
            localStorage.setItem("bookings", JSON.stringify(bookings));
            renderHistory(); // Re-render history to update buttons
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
