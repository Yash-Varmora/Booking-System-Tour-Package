
const itemsPerPage = 6;
let currentPage = 1;
let filteredPackages = [];

// Fetch packages from localStorage
function getPackages() {
    return JSON.parse(localStorage.getItem("packages")) || [];
}

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

// Display packages with pagination
function displayPackages(page = 1) {
    const container = document.getElementById("packagesContainer");
    const paginationContainer = document.getElementById("pagination");
    if (!container || !paginationContainer) return;

    container.innerHTML = "";
    paginationContainer.innerHTML = "";

    let packages = filteredPackages.length ? filteredPackages : getPackages();
    const totalItems = packages.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) {
        container.innerHTML = "<p>No packages available.</p>";
        return;
    }

    currentPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPackages = packages.slice(startIndex, endIndex);

    paginatedPackages.forEach(pkg => {
        const card = document.createElement("div");
        card.classList.add("package-card");

        card.innerHTML = `
            <img src="${pkg.imgSrc}" alt="${pkg.name}">
            <h3>${pkg.name}</h3>
            <p>${pkg.detail}</p>
            <p class="price">Price: ₹${pkg.price}</p>
            <p class="category">Category: ${pkg.category}</p>
            <p class="SubCategory">SubCategory: ${pkg.subCategory}</p>   
            <button style="margin-top:10px;" class="book-now" data-id="${pkg.id}">Book Now</button>
        `;

        container.appendChild(card);

        card.querySelector(".book-now").addEventListener("click", function () {
            if (!isUserLoggedIn()) {
                localStorage.setItem("redirectAfterLogin", "cart.html");
                alert("Please log in to book this package.");
                window.location.href = "auth.html";
                return;
            }
            let packageData = {
                // id: card.dataset.packageId, // Ensure the card has data-package-id attribute
                // imgSrc: pkg.imgSrc,
                name: (pkg.name || "").trim(),
                detail: (pkg.detail || "").trim(),
                category: (pkg.category || "").trim(),
                subCategory: (pkg.subCategory || "").trim(),
                price: parseFloat(pkg.price) || 0, // Ensure price is a number
            };
            console.log("Stored Package:", packageData);
        
            // Store the selected package in localStorage
            localStorage.setItem("selectedPackage", JSON.stringify(packageData));
            window.location.href = "cart.html";
        });
    });

    updatePaginationControls(totalPages);
}

// Update Pagination Controls (Fixes Next & Previous Buttons)
function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    // Previous Button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.classList.add("pagination-btn");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => displayPackages(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Page Number Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-btn");
        if (i === currentPage) pageButton.classList.add("active");
        pageButton.addEventListener("click", () => displayPackages(i));
        paginationContainer.appendChild(pageButton);
    }

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("pagination-btn");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => displayPackages(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

// Search & Filter Logic (Applies to ALL Fields)
document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
    const selectedCategory = document.getElementById("filterSelect").value.trim();

    let packages = getPackages();

    filteredPackages = packages.filter(pkg => {
        // Convert properties to lowercase strings for case-insensitive search
        const name = (pkg.name || "").toLowerCase();
        const detail = (pkg.detail || "").toLowerCase();
        const category = (pkg.category || "").toLowerCase();
        const subCategory = (pkg.subCategory || "").toLowerCase();
        const price = (pkg.price || "").toString().toLowerCase(); // Convert price to string

        const matchesSearch =
            searchTerm === "" || // No search term = match everything
            name.includes(searchTerm) ||
            detail.includes(searchTerm) ||
            category.includes(searchTerm) ||
            subCategory.includes(searchTerm) ||
            price.includes(searchTerm);

        const matchesCategory = selectedCategory === "" || category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayPackages(1);
});


// Initial Load
filteredPackages = [];
displayPackages(currentPage);

// Function to Check if User is Logged In
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Function to Logout User
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    updateAuthButton(); // Refresh UI
}

// Function to Update Navbar (Login/Register OR Profile)
function updateAuthButton() {
    const authContainer = document.getElementById("authContainer");
    const user = getLoggedInUser();

    if (user) {
        // Show Profile Button if Logged In
        authContainer.innerHTML = `
            <div class="profile-menu">
                <button id="profileBtn" class="profile-button">${user.name[0].toUpperCase()}</button>
                <div class="dropdown-content">
                    <button id="logoutBtn">Logout</button>
                </div>
            </div>
        `;

        // Logout Button Click Event
        document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    } else {
        // Show Login/Register Button if Not Logged In
        authContainer.innerHTML = `<button id="loginBtn" class="login-button">Login/Register</button>`;
        document.getElementById("loginBtn").addEventListener("click", () => {
            window.location.href = "auth.html"; // Redirect to Login Page
        });
    }
}

// Call Function on Page Load to Set Navbar Button
updateAuthButton();


