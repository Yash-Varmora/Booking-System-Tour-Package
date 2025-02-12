document.getElementById('show-register').addEventListener('click', function() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
}
);

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
}
);

const getuser = () => JSON.parse(localStorage.getItem('users')) || [];
const saveUser = (users) => localStorage.setItem('users', JSON.stringify(users));

const isempty = (...args) => args.some((arg) => arg.trim() === "");
const ispassword = (password) => password.length >= 6;
const isemailvalid = (email) => email.includes("@");

const showAlert = (message, isSuccess = false) => {
    alert(message);
    if (isSuccess) document.getElementById("show-login").click(); 
};

const registeruser = () => {
    const name = document.getElementById('rname').value.trim();
    const email = document.getElementById('remail').value.trim();
    const password = document.getElementById('rpassword').value.trim();
    const cpassword = document.getElementById('rconfirmPassword').value.trim();

    if (isempty(name, email, password, cpassword)) return showAlert('All fields are required!');
    if (!ispassword(password)) return showAlert('Password must be atleast 6 characters');
    if (password !== cpassword) return showAlert('Passwords do not match!');
    if (!isemailvalid(email)) return showAlert('Invalid email address!');

    let users = getuser();
    if (users.some((user) => user.email === email)) return showAlert('User already exists! Please login');
    users.push({ name, email, password });
    saveUser(users);
    showAlert('User registered successfully! Please login', true);
};

const loginuser = () => {
    const email = document.getElementById('lname').value.trim();
    const password = document.getElementById('lpassword').value.trim();
    if (isempty(email, password)) return showAlert('All fields are required!');
    // if (!isemailvalid(email)) return showAlert('Invalid email address!');

    let users = getuser();
    const validuser = users.find((user) => user.email === email || user.name === email && user.password === password);
    // validuser ? showAlert(`Welcome, ${validuser.name} ! Login successful.`) : showAlert("Invalid email or password!");
    if(validuser){
        showAlert(`Welcome, ${validuser.name} ! Login successful.`);
        window.location.href = "index.html";
    }else{
        showAlert("Invalid email or password!");
    }
};

document.getElementById('login').addEventListener('click', loginuser);
document.getElementById('register').addEventListener('click', registeruser);