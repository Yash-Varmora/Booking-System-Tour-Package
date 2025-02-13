function checkAdmin() {
    const user = JSON.parse(localStorage.getItem("loggedInAdmin"));

    if (!user || (user.name !== "Admin" && user.email !== "admin@gmail.com")) {
        window.location.href = "auth.html";
    }
}

checkAdmin();

document.addEventListener("DOMContentLoaded", () => {
    const profilePic = document.getElementById("profilePic");
    const uploadPhoto = document.getElementById("uploadPhoto");
    const userName = document.getElementById("userName");
    const userAge = document.getElementById("userAge");
    const saveProfile = document.getElementById("saveProfile");
    const logoutProfile = document.getElementById("logoutProfile");

    const user = JSON.parse(localStorage.getItem("users"));
    if (user) {
        profilePic.src = user.photo || "../src/dummy-user.png";
        userName.value = user.name || "";
        userAge.value = user.age || "";
    }

    saveProfile.addEventListener("click", () => {
        const reader = new FileReader();
        reader.onload = function () {
            const updatedUser = {
                name: userName.value.trim(),
                age: userAge.value.trim(),
                photo: reader.result || profilePic.src
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            alert("Profile saved successfully!");
            window.location.href = "index.html";
        };

        if (uploadPhoto.files[0]) {
            reader.readAsDataURL(uploadPhoto.files[0]);
        } else {
            reader.onload();
        }
    });

    logoutProfile.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "index.html";
    });
});
