
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

const STORAGE_KEY = "registrations";

// Display an error message
function showError(id, text) {
    document.getElementById(id).textContent = text;
}

// Clear old errors
function clearErrors() {
    document.querySelectorAll("small").forEach(error => {
        error.textContent = "";
    });

    message.textContent = "";
    message.style.color = "";
}

// Form submit event
form.addEventListener("submit", function(event) {
    // event.preventDefault();
    window.location.reload();
    clearErrors();

    // Get values using DOM
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const department = document.getElementById("department").value;
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    let isValid = true;

    // 1. Name validation
    if (name.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.");
        isValid = false;
    }

    // 2. Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError("emailError", "Please enter a valid email address.");
        isValid = false;
    }

    // 3. Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
        showError("phoneError", "Phone number must contain 10 digits.");
        isValid = false;
    }

    // 4. Date of birth validation
    const birthDate = dob ? new Date(dob + "T00:00:00") : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!dob || Number.isNaN(birthDate?.getTime()) || birthDate >= today) {
        showError("dobError", "Select a valid date in the past.");
        isValid = false;
    }

    // 5. Gender validation
    if (!gender) {
        showError("genderError", "Please select your gender.");
        isValid = false;
    }

    // 6. Department validation
    if (!department) {
        showError("departmentError", "Please select a department.");
        isValid = false;
    }

    // 7. Address validation
    if (address.length < 10) {
        showError("addressError", "Address must contain at least 10 characters.");
        isValid = false;
    }

    // 8. City validation
    if (city.length < 2) {
        showError("cityError", "Please enter a valid city.");
        isValid = false;
    }

    // 9. Pincode validation
    if (!/^[0-9]{6}$/.test(pincode)) {
        showError("pincodeError", "Pincode must contain exactly 6 digits.");
        isValid = false;
    }

    // 10. Password validation
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordPattern.test(password)) {
        showError(
            "passwordError",
            "Use 8+ characters with uppercase, lowercase, number and special character."
        );
        isValid = false;
    }

    // 11. Confirm password validation
    if (password !== confirmPassword) {
        showError("confirmError", "Passwords do not match.");
        isValid = false;
    }

    // 12. Terms validation
    if (!terms) {
        showError("termsError", "Please accept the Terms and Conditions.");
        isValid = false;
    }

    // Stop when validation fails
    if (!isValid) {
        return;
    }

    // Get existing records
    const users = getUsers();

    // Check duplicate email
    const emailExists = users.some(user =>
        user.email.toLowerCase() === email
    );

    if (emailExists) {
        showError("emailError", "This email is already registered.");
        return;
    }

    // Create new record; never save passwords
    const newUser = {
        id: `REG-${Date.now()}`,
        name,
        email,
        phone,
        dob,
        gender,
        department,
        address,
        city,
        pincode
    };

    try {
        users.push(newUser);

        // Save records in browser storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

        message.style.color = "#15803d";
        message.textContent = "Registration successful!";

        form.reset();
        displayUsers();

    } catch (error) {
        message.style.color = "#dc2626";
        message.textContent = "Unable to save data in browser storage.";
        console.error(error);
    }
});

// Refresh table
document.getElementById("getUsers").addEventListener("click", displayUsers);

// Display saved users when page opens
displayUsers();
