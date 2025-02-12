
const removePackage = (name) => {
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    packages = packages.filter(pkg => pkg.name !== name);
    localStorage.setItem("packages", JSON.stringify(packages));
    loadPackages();
};

const loadPackages = () => {
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    const packageList = document.getElementById("packageList");
    packageList.innerHTML = "";

    packages.forEach((pkg) => {
        const packageDiv = document.createElement("div");
        packageDiv.classList.add("card");
        packageDiv.innerHTML = `
    <img src="${pkg.imgSrc}" alt="${pkg.name}" class="card-img">
    <div class="card-content">
        <h3 class="card-title">${pkg.name}</h3>
        <p class="card-detail">${pkg.detail}</p>
        <p class="card-price">Price: &#8377;${pkg.price}</p>
        <div class="card-buttons">
            <button class="edit-btn" onclick="window.location.href='package.html?edit=${pkg.name}'">Edit</button>
            <button class="remove-btn" onclick="removePackage('${pkg.name}')">Remove</button>
        </div>
    </div>
`;
        packageList.appendChild(packageDiv);

    });
}

document.addEventListener("DOMContentLoaded", loadPackages);
