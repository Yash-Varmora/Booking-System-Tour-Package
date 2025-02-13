
const itemsPerPage = 6;
let currentPage = 1;
let filteredPackages = [];

function getPackages() {
    return JSON.parse(localStorage.getItem("packages")) || [];
}

function isUserLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

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
               
                name: (pkg.name || "").trim(),
                detail: (pkg.detail || "").trim(),
                category: (pkg.category || "").trim(),
                subCategory: (pkg.subCategory || "").trim(),
                days: parseInt(pkg.days) || 0, 
                nights: parseInt(pkg.nights) || 0, 
                price: parseFloat(pkg.price) || 0, 
            };
            console.log("Stored Package:", packageData);
        
            localStorage.setItem("selectedPackage", JSON.stringify(packageData));
            window.location.href = "cart.html";
        });
    });

    updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.classList.add("pagination-btn");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => displayPackages(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-btn");
        if (i === currentPage) pageButton.classList.add("active");
        pageButton.addEventListener("click", () => displayPackages(i));
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("pagination-btn");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => displayPackages(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}
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

function populateCategories() {
    const categorySelect = document.getElementById("filterCategory");
    categorySelect.innerHTML = `<option value="">All Categories</option>`;
    for (let category in categories) {
        categorySelect.innerHTML += `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`;
    }
}

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

document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
    const selectedCategory = document.getElementById("filterCategory").value.toLowerCase().trim();
    const selectedSubCategory = document.getElementById("filterSubCategory").value.toLowerCase().trim();
    const minPrice = parseFloat(document.getElementById("priceRange").min);
    const maxPrice = parseFloat(document.getElementById("priceRange").value);
    const sortBy = document.getElementById("sortFilter").value;

    let packages = getPackages();

    filteredPackages = packages.filter(pkg => {
        const name = (pkg.name || "").toLowerCase();
        const detail = (pkg.detail || "").toLowerCase();
        const category = (pkg.category || "").toLowerCase();
        const subCategory = (pkg.subCategory || "").toLowerCase();
        const price = parseFloat(pkg.price) || 0; 

        const matchesSearch = searchTerm === "" || name.includes(searchTerm) || detail.includes(searchTerm);
        const matchesCategory = selectedCategory === "" || category === selectedCategory;
        const matchesSubCategory = selectedSubCategory === "" || subCategory === selectedSubCategory;
        const matchesPrice = price >= minPrice && price <= maxPrice;

        return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice;
    });

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

document.getElementById("priceRange").addEventListener("input", function () {
    document.getElementById("priceValue").textContent = `₹${this.value}`;
});

populateCategories();



filteredPackages = [];
displayPackages(currentPage);

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("You have been signed out.");
    updateAuthButton(); 
}

function updateAuthButton() {
    const authContainer = document.getElementById("authContainer");
    const user = getLoggedInUser();

    if (user) {
        authContainer.innerHTML = `
            <div class="profile-menu">
                <button id="profileBtn" class="profile-button">${user.name[0].toUpperCase()}</button>
                <div class="dropdown-content">
                    <button id="accountBtn">Cart</button>
                    <button id="logoutBtn">Sign Out</button>
                </div>
            </div>
        `;

        document.getElementById("accountBtn").addEventListener("click", () => {
            window.location.href = "cart.html";
        });

        document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    } else {
        authContainer.innerHTML = `<button id="loginBtn" class="login-button">Login / Register</button>`;
        document.getElementById("loginBtn").addEventListener("click", () => {
            window.location.href = "auth.html";
        });
    }
}

updateAuthButton();




