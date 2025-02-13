
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
            <img src="${pkg.imgSrc}" alt="${pkg.name}" class="card-img">
            <div class="card-content">
        <h3 class="card-title">${pkg.name}</h3>
        <p class="card-detail">${pkg.detail}</p>
        <p class="card-price">Price: &#8377;${pkg.price}</p>
        <p class="card-category">Category: ${pkg.category}</p>
        <p class="card-subcategory">Subcategory: ${pkg.subCategory}</p>
        <p class="card-days">Duration: ${pkg.days} Days, ${pkg.nights} Nights</p>
        <button class="book-now" data-id="${pkg.id}">Book Now</button>
        </div>
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
                days: parseInt(pkg.days) || 0, // Ensure days is a number
                nights: parseInt(pkg.nights) || 0, // Ensure nights is a number
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
// Function to Get Categories and Subcategories
const categories = {
    adventure: ["Trekking", "Hiking", "Rafting", "Scuba Diving"],
    pilgrimage: ["Char Dham Yatra", "Mecca", "Vatican City"],
    wildlife: ["Jungle Safari", "National Park Tours"],
    wellness: ["Yoga Retreats", "Ayurveda Therapy"],
    cultural: ["Historical Sites", "Architecture Tours"],
    eco: ["Sustainable Travel", "Nature Conservation"],
    business: ["Corporate Conferences", "Incentive Travel"],
    educational: ["Student Excursions", "Research Trips"],
    cruise: ["Luxury Cruises", "River Cruises"]
};

// Populate Category Dropdown
function populateCategories() {
    const categorySelect = document.getElementById("filterCategory");
    categorySelect.innerHTML = `<option value="">All Categories</option>`;
    for (let category in categories) {
        categorySelect.innerHTML += `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`;
    }
}

// Populate Subcategory Dropdown Based on Selected Category
document.getElementById("filterCategory").addEventListener("change", function () {
    const subCategorySelect = document.getElementById("filterSubCategory");
    const selectedCategory = this.value;

    subCategorySelect.innerHTML = `<option value="">All Subcategories</option>`;
    if (selectedCategory && categories[selectedCategory]) {
        categories[selectedCategory].forEach(subCat => {
            subCategorySelect.innerHTML += `<option value="${subCat}">${subCat}</option>`;
        });
    }
});

// Sort & Filter Logic
document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
    const selectedCategory = document.getElementById("filterCategory").value.trim();
    const selectedSubCategory = document.getElementById("filterSubCategory").value.trim();
    const maxPrice = parseFloat(document.getElementById("priceRange").value);
    const sortBy = document.getElementById("sortFilter").value;

    let packages = getPackages();

    filteredPackages = packages.filter(pkg => {
        const name = (pkg.name || "").toLowerCase();
        const detail = (pkg.detail || "").toLowerCase();
        const category = (pkg.category || "").toLowerCase();
        const subCategory = (pkg.subCategory || "")
        const price = parseFloat(pkg.price) || 0;
        const days = parseInt(pkg.days) || 0; // Ensure `days` exists in package data
        // const nights = parseInt(pkg.nights) || 0; // Ensure `nights` exists in package data

        const matchesSearch = searchTerm === "" || name.includes(searchTerm) || detail.includes(searchTerm);
        const matchesCategory = selectedCategory === "" || category === selectedCategory;
        const matchesSubCategory = selectedSubCategory === "" || subCategory === selectedSubCategory;
        const matchesPrice = price <= maxPrice;

        return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice;
    });

    // Sorting Logic
    if (sortBy === "priceAsc") {
        filteredPackages.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
        filteredPackages.sort((a, b) => b.price - a.price);
    } else if (sortBy === "daysAsc") {
        filteredPackages.sort((a, b) => a.days - b.days);
    } else if (sortBy === "daysDesc") {
        filteredPackages.sort((a, b) => b.days - a.days);
    }

    displayPackages(1);
});

// Set Default Price Range Display
document.getElementById("priceRange").addEventListener("input", function () {
    document.getElementById("priceValue").textContent = `₹${this.value}`;
});

// Populate Categories and Subcategories
populateCategories();


// Set Default Price Range Display
document.getElementById("priceRange").addEventListener("input", function () {
    document.getElementById("priceValue").textContent = `₹${this.value}`;
});

// Initialize Filters
populateCategories();


// Initial Load
filteredPackages = [];
displayPackages(currentPage);

// Function to Check if User is Logged In
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Function to Logout User with Alert
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("You have been signed out.");
    updateAuthButton(); // Refresh UI
}

// Function to Update Navbar (Login/Register OR Profile)
function updateAuthButton() {
    const authContainer = document.getElementById("authContainer");
    const user = getLoggedInUser();

    if (user) {
        // Show Profile Button with Dropdown
        authContainer.innerHTML = `
            <div class="profile-menu">
                <button id="profileBtn" class="profile-button">${user.name[0].toUpperCase()}</button>
                <div class="dropdown-content">
                    <button id="accountBtn">Account</button>
                    <button id="logoutBtn">Sign Out</button>
                </div>
            </div>
        `;

        // Account Button Click Event (Redirect to cart.html)
        document.getElementById("accountBtn").addEventListener("click", () => {
            window.location.href = "cart.html";
        });

        // Logout Button Click Event
        document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    } else {
        // Show Login/Register Button
        authContainer.innerHTML = `<button id="loginBtn" class="login-button">Login / Register</button>`;
        document.getElementById("loginBtn").addEventListener("click", () => {
            window.location.href = "auth.html";
        });
    }
}

// Call Function on Page Load to Set Navbar Button
updateAuthButton();




