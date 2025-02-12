const loadPage = (page) => {
    let contentFrame = document.getElementById("contentFrame");

    if (page === "packageList") {
        contentFrame.src = "packageList.html";
    } else if (page === "dashboard") {
        contentFrame.src = "dashboard.html";
    }
} 

document.addEventListener("DOMContentLoaded", () => {
    const sidebarLinks = document.querySelectorAll(".nav-link");
    const contentFrame = document.getElementById("contentFrame");

    const savedPage = localStorage.getItem("activePage") || "dashboard.html";
    contentFrame.src = savedPage;

    sidebarLinks.forEach(link => {
        if (link.dataset.page === savedPage) {
            link.classList.add("active");
        }
    });

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            sidebarLinks.forEach((l) => l.classList.remove("active"));

            link.classList.add("active");

            const page = link.dataset.page;
            contentFrame.src = page;
            localStorage.setItem("activePage", page);
        });
    });
})

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("activePage");
    alert("You have been logged out.");
    window.location.href = "";
});
