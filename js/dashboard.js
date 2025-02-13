function fetchData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function updateDashboard() {
    const packages = fetchData("packages");
    const bookings = fetchData("bookings");
    const users = fetchData("users");

    document.getElementById("totalPackages").textContent = packages.length;
    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("totalUsers").textContent = users.length - 1;

    drawBookingsChart(bookings);
}

updateDashboard();
