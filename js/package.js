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

            document.getElementById("pkgName").disabled = true;

            document.getElementById("pkgName").style.cursor = "no-drop"

            document.getElementById("formTitle").textContent = "Edit Package";
            document.getElementById("submitButton").textContent = "Update Package";
            document.title = "Edit Package";

            editingPackageName = editName;
        }
    }
}

document.getElementById("packageForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("pkgName").value;
    const detail = document.getElementById("pkgDetail").value;
    const price = document.getElementById("pkgPrice").value;
    const image = document.getElementById("pkgImage").files[0];

    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    const existingIndex = packages.findIndex(pkg => pkg.name === editingPackageName);

    if (existingIndex !== -1) { 
        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                packages[existingIndex] = { name, detail, price, imgSrc: e.target.result };
                localStorage.setItem("packages", JSON.stringify(packages));
                redirectToListPage();
            };
            reader.readAsDataURL(image);
        } else {
            packages[existingIndex] = { ...packages[existingIndex], detail, price };
            localStorage.setItem("packages", JSON.stringify(packages));
            redirectToListPage();
        }
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target.result;
            packages.push({ name, detail, price, imgSrc });
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


