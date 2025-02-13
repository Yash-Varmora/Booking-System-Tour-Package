function checkAdmin() {
    const user = JSON.parse(localStorage.getItem("loggedInAdmin"));

    if (!user || (user.name !== "Admin" && user.email !== "admin@gmail.com")) {
        window.location.href = "auth.html";
    }
}

checkAdmin();

let editingPackageName = null;

const loadEditingPackage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editName = urlParams.get("edit");

    if (editName) {
        let packages = JSON.parse(localStorage.getItem("packages")) || [];
        const pkg = packages.find(pkg => pkg.name === editName);

        if (pkg) {
            document.getElementById("pkgName").value = pkg.name;
            document.getElementById("pkgDetail").value = pkg.detail;
            document.getElementById("pkgPrice").value = pkg.price;
            document.getElementById("pkgCategory").value = pkg.category;
            document.getElementById("pkgDays").value = pkg.days || "";
            document.getElementById("pkgNights").value = pkg.nights || "";
            updateSubcategories(pkg.category, pkg.subCategory);

            document.getElementById("pkgName").disabled = true;

            document.getElementById("pkgName").style.cursor = "no-drop"

            document.getElementById("formTitle").textContent = "Edit Package";
            document.getElementById("submitButton").textContent = "Update Package";
            document.title = "Edit Package";

            editingPackageName = editName;
        }
    }
}

const categoryToSubcategory = {
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

const updateSubcategories = (selectedCategory, selectedSubcategory = "") => {
    const subCategorySelect = document.getElementById("pkgSubCategory");
    subCategorySelect.innerHTML = "<option value=''>Select a subcategory</option>";

    if (categoryToSubcategory[selectedCategory]) {
        categoryToSubcategory[selectedCategory].forEach(sub => {
            const option = document.createElement("option");
            option.value = sub;
            option.textContent = sub;
            if (sub === selectedSubcategory) {
                option.selected = true;
            }
            subCategorySelect.appendChild(option);
        });
    }
};


document.getElementById("pkgCategory").addEventListener("change", function () {
    updateSubcategories(this.value);
});

document.getElementById("packageForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("pkgName").value;
    const detail = document.getElementById("pkgDetail").value;
    const price = document.getElementById("pkgPrice").value;
    const category = document.getElementById("pkgCategory").value;
    const days = document.getElementById("pkgDays").value;
    const nights = document.getElementById("pkgNights").value;
    const subCategory = document.getElementById("pkgSubCategory").value;
    const image = document.getElementById("pkgImage").files[0];

    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    const existingIndex = packages.findIndex(pkg => pkg.name === editingPackageName);

    if (existingIndex !== -1) {
        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                packages[existingIndex] = {
                    name, detail, price, category, subCategory,days, nights, imgSrc: e.target.result
                };
                localStorage.setItem("packages", JSON.stringify(packages));
                redirectToListPage();
            };
            reader.readAsDataURL(image);
        } else {
            packages[existingIndex] = {
                ...packages[existingIndex], detail, price, category, subCategory,days, nights
            };
            localStorage.setItem("packages", JSON.stringify(packages));
            redirectToListPage();
        }
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target.result;
            packages.push({ name, detail, price, category, subCategory,days, nights, imgSrc });
            localStorage.setItem("packages", JSON.stringify(packages));
            redirectToListPage();
        };
        reader.readAsDataURL(image);
    }
})

const redirectToListPage = () => {
    window.location.href = "packageList.html";
};

document.addEventListener("DOMContentLoaded", loadEditingPackage);


