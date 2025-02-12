document.addEventListener("DOMContentLoaded", () => {
    const profilePic = document.getElementById("profilePic");
    const uploadPhoto = document.getElementById("uploadPhoto");
    const userName = document.getElementById("userName");
    const userAge = document.getElementById("userAge");
    const saveProfile = document.getElementById("saveProfile");
    const logoutProfile = document.getElementById("logoutProfile");

    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem("users"));
    if (user) {
        profilePic.src = user.photo || "../src/dummy-user.png";
        userName.value = user.name || "";
        userAge.value = user.age || "";
    }

    // Save user profile
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
            window.location.href = "index.html"; // Redirect back to homepage
        };

        if (uploadPhoto.files[0]) {
            reader.readAsDataURL(uploadPhoto.files[0]);
        } else {
            reader.onload();
        }
    });

    // Logout user
    logoutProfile.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "index.html";
    });
});
