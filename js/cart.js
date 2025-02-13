
document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const historyContainer = document.getElementById("booking-history");

    // Retrieve booking data from localStorage
    let selectedPackage = JSON.parse(localStorage.getItem("selectedPackage"));
    let booking = JSON.parse(localStorage.getItem("booking")) || {};
    let bookingHistory = JSON.parse(localStorage.getItem("bookingHistory")) || {};

    if (selectedPackage) {
        // Ensure each new selected package is added separately
        if (!booking[selectedPackage.id] && !bookingHistory[selectedPackage.id]) {  
            booking[selectedPackage.id] = {
                package: selectedPackage,
                peopleCount: 1,
                travelDate: new Date().toISOString().split("T")[0], // Default to today
                bookingDate: new Date().toISOString(), // Store booking date
                editDate: null, // Initially null, updated when edited
            };

            localStorage.setItem("booking", JSON.stringify(booking));
        }

        // Remove selected package to prevent reloading it
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
                <h3>${item.package.name}</h3>
                <p><strong>Detail:</strong> ${item.package.detail}</p>
                <p><strong>Category:</strong> ${item.package.category} > ${item.package.subCategory}</p>
                <p><strong>Price:</strong> $${item.package.price}</p>
                <p><strong>People:</strong> 
                    <button onclick="updatePeople('${key}', -1)">➖</button>
                    <span id="people-count-${key}">${item.peopleCount}</span>
                    <button onclick="updatePeople('${key}', 1)">➕</button>
                </p>
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
        if (booking[key].peopleCount + change >= 1) {
            booking[key].peopleCount += change;
            document.getElementById(`people-count-${key}`).textContent = booking[key].peopleCount;
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

        // Move to history
        booking[key].bookingDate = new Date().toISOString();
        bookingHistory[key] = { ...booking[key] };

        // Remove from current bookings
        delete booking[key];

        localStorage.setItem("booking", JSON.stringify(booking));
        localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));

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

        if (Object.keys(bookingHistory).length === 0) {
            historyContainer.innerHTML += "<p>No past bookings.</p>";
            return;
        }

        Object.keys(bookingHistory).forEach((key) => {
            let item = bookingHistory[key];

            let historyItem = document.createElement("div");
            historyItem.classList.add("history-item");

            historyItem.innerHTML = `
                <h3>${item.package.name}</h3>
                <p><strong>Detail:</strong> ${item.package.detail}</p>
                <p><strong>Category:</strong> ${item.package.category} > ${item.package.subCategory}</p>
                <p><strong>Price:</strong> $${item.package.price}</p>
                <p><strong>People:</strong> ${item.peopleCount}</p>
                <p><strong>Travel Date:</strong> ${item.travelDate}</p>
                <p><strong>Booking Date:</strong> ${new Date(item.bookingDate).toLocaleString()}</p>
                <p><strong>Last Edited:</strong> ${item.editDate ? new Date(item.editDate).toLocaleString() : "Never"}</p>
                <button onclick="editBooking('${key}')">Edit</button>
                <button onclick="cancelBooking('${key}')">Cancel Booking</button>
            `;

            historyContainer.appendChild(historyItem);
        });
    }

    window.editBooking = function (key) {
        let newDate = prompt("Enter new travel date (YYYY-MM-DD):", bookingHistory[key].travelDate);
        if (newDate) {
            bookingHistory[key].travelDate = newDate;
            bookingHistory[key].editDate = new Date().toISOString();

            localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));
            renderHistory();
        }
    };

    window.cancelBooking = function (key) {
        if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            delete bookingHistory[key];

            localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));

            renderHistory();
        }
    };
});
