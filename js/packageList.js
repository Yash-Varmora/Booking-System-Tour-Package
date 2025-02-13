const itemsPerPage = 6;
let currentPage = 1;


const removePackage = (name) => {
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    packages = packages.filter(pkg => pkg.name !== name);
    localStorage.setItem("packages", JSON.stringify(packages));
    loadPackages();
};

const loadPackages = () => {
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    const packageList = document.getElementById("packageList");
    const pagination = document.getElementById("pagination");
    packageList.innerHTML = "";
    pagination.innerHTML = "";

    const totalPages = Math.ceil(packages.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = packages.slice(startIndex, startIndex + itemsPerPage);


    paginatedItems.forEach((pkg) => {
        const packageDiv = document.createElement("div");
        packageDiv.classList.add("card");
        packageDiv.innerHTML = `
    <img src="${pkg.imgSrc}" alt="${pkg.name}" class="card-img">
    <div class="card-content">
        <h3 class="card-title">${pkg.name}</h3>
        <p class="card-detail">${pkg.detail}</p>
        <p class="card-price">Price: &#8377;${pkg.price}</p>
        <p class="card-category">Category: ${pkg.category}</p>
        <p class="card-subcategory">Subcategory: ${pkg.subCategory}</p>
        <p>Duration: ${pkg.days} Days, ${pkg.nights} Nights</p>

        <div class="card-buttons">
            <button class="edit-btn" onclick="window.location.href='package.html?edit=${pkg.name}'">Edit</button>
            <button class="remove-btn" onclick="removePackage('${pkg.name}')">Remove</button>
        </div>
    </div>`;
        packageList.appendChild(packageDiv);

    });

    if (totalPages > 1) {
        const prevButton = document.createElement("button");
        prevButton.innerText = "Prev";
        prevButton.classList.add("page-btn");
        prevButton.disabled = currentPage === 1
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                loadPackages();
            }
        });
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.innerText = i;
            pageButton.classList.add("page-btn");
            if (i === currentPage) pageButton.classList.add("active");
            pageButton.addEventListener("click", () => {
                currentPage = i;
                loadPackages();
            });
            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.innerText = "Next";
        nextButton.classList.add("page-btn");
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadPackages();
            }
        });
        pagination.appendChild(nextButton);
    }
}

document.addEventListener("DOMContentLoaded", loadPackages);
