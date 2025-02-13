document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const historyContainer = document.getElementById("booking-history");

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let bookingHistory = JSON.parse(localStorage.getItem("bookingHistory")) || {};
    
    let selectedPackage = JSON.parse(localStorage.getItem("selectedPackage"));
    if (selectedPackage) {
        const bookingId = `${selectedPackage.id}-${Date.now()}`;
        bookings[bookingId] = {
            package: selectedPackage,
            peopleCount: 1,
            travelDate: new Date().toISOString().split("T")[0],
            bookingDate: new Date().toISOString(),
            editDate: null,
        };
        localStorage.setItem("bookings", JSON.stringify(bookings));
        localStorage.removeItem("selectedPackage");
    }

    renderCart();
    renderHistory();

    function renderCart() {
        cartContainer.innerHTML = "<h2>Current Bookings</h2>";
        if (Object.keys(bookings).length === 0) {
            cartContainer.innerHTML += "<p>No current bookings.</p>";
            return;
        }

        Object.keys(bookings).forEach((key) => {
            let item = bookings[key];
            let totalPrice = item.peopleCount * item.package.price;

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <h3>${item.package.name}</h3>
                <p><strong>Detail:</strong> ${item.package.detail}</p>
                <p><strong>Category:</strong> ${item.package.category} > ${item.package.subCategory}</p>
                <p><strong>Price per person:</strong> $${item.package.price}</p>
                <p><strong>People:</strong> 
                    <button onclick="updatePeople('${key}', -1')">➖</button>
                    <span id="people-count-${key}">${item.peopleCount}</span>
                    <button onclick="updatePeople('${key}', 1')">➕</button>
                </p>
                <p><strong>Total Price:</strong> $<span id="total-price-${key}">${totalPrice}</span></p>
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
        localStorage.setItem("bookings", JSON.stringify(bookings));
    }

    window.updatePeople = function (key, change) {
        if (bookings[key].peopleCount + change >= 1) {
            bookings[key].peopleCount += change;
            let peopleCountElement = document.getElementById(`people-count-${key}`);
            let totalPriceElement = document.getElementById(`total-price-${key}`);
            if (peopleCountElement && totalPriceElement) {
                peopleCountElement.textContent = bookings[key].peopleCount;
                totalPriceElement.textContent = bookings[key].peopleCount * bookings[key].package.price;
            }
            localStorage.setItem("bookings", JSON.stringify(bookings));
        }
    };

    window.updateDate = function (key) {
        let newDate = document.getElementById(`date-${key}`).value;
        bookings[key].travelDate = newDate;
        localStorage.setItem("bookings", JSON.stringify(bookings));
    };

    window.confirmBooking = function (key) {
        alert("Booking confirmed successfully!");
        bookings[key].bookingDate = new Date().toISOString();
        bookingHistory[key] = { ...bookings[key] };
        delete bookings[key];
        localStorage.setItem("bookings", JSON.stringify(bookings));
        localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));
        renderCart();
        renderHistory();
    };

    window.deleteBooking = function (key) {
        if (confirm("Are you sure you want to delete this booking?")) {
            delete bookings[key];
            localStorage.setItem("bookings", JSON.stringify(bookings));
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
                <p><strong>Price per person:</strong> $${item.package.price}</p>
                <p><strong>People:</strong> ${item.peopleCount}</p>
                <p><strong>Total Price:</strong> $${item.peopleCount * item.package.price}</p>
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
        if (confirm("Are you sure you want to cancel this booking?")) {
            delete bookingHistory[key];
            localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));
            renderHistory();
        }
    };
});
