// Fetch packages from localStorage
function getPackages() {
    return JSON.parse(localStorage.getItem("packages")) || [];
}

// Display packages
function displayPackages(packages) {
    const container = document.getElementById("packagesContainer");
    container.innerHTML = "";

    if (packages.length === 0) {
        container.innerHTML = "<p>No packages available.</p>";
        return;
    }

    packages.forEach(pkg => {
        const div = document.createElement("div");
        div.textContent = `${pkg.name} - ${pkg.category}`;
        container.appendChild(div);
    });
}

// Filter & Search Logic
document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const selectedCategory = document.getElementById("filterSelect").value;
    
    let packages = getPackages();

    if (searchTerm) {
        packages = packages.filter(pkg => pkg.name.toLowerCase().includes(searchTerm));
    }

    if (selectedCategory) {
        packages = packages.filter(pkg => pkg.category === selectedCategory);
    }

    displayPackages(packages);
});

// Navigate to Login/Signup
document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "auth.html";
});

// Initial Load
displayPackages(getPackages());
