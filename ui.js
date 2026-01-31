import { loginFlow } from "./src/login.js";
import { isEmpty, isValidEmail, isValidPassword, passwordsMatch } from "./src/validation.js";
import { logoutFlow } from "./src/logout.js";
import { registerFlow } from "./src/register.js";
import { isNicknameInUse, updateNickname, resetPassword, onAuthChange } from "./src/firebase.js";

//===========DOM============

const openAuthBtn = document.getElementById("openAuth");
const authModal = document.getElementById("authModal");
const authOverlay = document.getElementById("authOverlay");
const closeAuthBtn = document.getElementById("closeAuth");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const openRegisterBtn = document.getElementById("openRegister");
const backToLoginBtn = document.getElementById("backToLogin");

const cancelButtons = document.querySelectorAll(".cancelAuth");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");

const userPanel = document.getElementById("userPanel");
const userNickname = document.getElementById("userNickname");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");
let currentUser = null;

const regEmail = document.getElementById("regEmail");
const nickname = document.getElementById("nickname");
const regPassword = document.getElementById("regPassword");
const regPasswordRepeat = document.getElementById("regPasswordRepeat");

const regEmailError = document.getElementById("regEmailError");
const nicknameError = document.getElementById("nicknameError");
const regPasswordError = document.getElementById("regPasswordError");
const regPasswordRepeatError = document.getElementById("regPasswordRepeatError");

const registerBtn = document.getElementById("registerBtn");

const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const resetPasswordBlock = document.getElementById("resetPasswordBlock");
const resetEmailInput = document.getElementById("resetEmail");
const resetEmailError = document.getElementById("resetEmailError");
const sendResetBtn = document.getElementById("sendResetBtn");
const resetSuccessMessage = document.getElementById("resetSuccessMessage");
const resetSuccessOk = document.getElementById("resetSuccessOk");


const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileBlock = document.getElementById("editProfile");
const editNicknameInput = document.getElementById("editNicknameInput");
const editNicknameError = document.getElementById("editNicknameError");
const saveNicknameBtn = document.getElementById("saveNicknameBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");


//============MODAL CONTROL=================

openAuthBtn.addEventListener("click", openLogin);

closeAuthBtn.addEventListener("click", () => {
    resetAuthUI();
    closeAuth();
});

authOverlay.addEventListener("click", () => {
    resetAuthUI();
    closeAuth();
});

cancelButtons.forEach(btn => btn.addEventListener("click", () => {
    resetAuthUI();
    closeAuth();
}));

openRegisterBtn.addEventListener("click", openRegister);
backToLoginBtn.addEventListener("click", openLogin);

loginBtn.addEventListener("click", handleLogin);

nickname.addEventListener("blur", () => {
    checkNicknameAvailability();
});

registerBtn.addEventListener("click", handleRegister);

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("toggle-password")) return;

    const wrapper = e.target.closest(".password-field");
    const input = wrapper.querySelector("input");

    input.type = input.type === "password" ? "text" : "password";
});

loginEmail.addEventListener("input", () => {
    // clearError(loginEmailError);
    updateLoginButtonState();
});

loginPassword.addEventListener("input", () => {
    // clearError(loginPasswordError);
    updateLoginButtonState();
});

regEmail.addEventListener("input", () => {
    // clearError(regEmailError);
    updateRegisterButtonState();
});

nickname.addEventListener("input", () => {
    // clearError(nicknameError);
    updateRegisterButtonState();
});

regPassword.addEventListener("input", () => {
    // clearError(regPasswordError);
    updateRegisterButtonState();
});

regPasswordRepeat.addEventListener("input", () => {
    // clearError(regPasswordRepeatError);
    updateRegisterButtonState();
});

loginEmail.addEventListener("blur", () => {
    validateLoginEmail();
});

loginPassword.addEventListener("blur", () => {
    validateLoginPassword();
});

function openLogin() {
    authModal.hidden = false;
    authOverlay.hidden = false;
    loginForm.hidden = false;
    registerForm.hidden = true;

    updateLoginButtonState();
}

function openRegister() {
    authModal.hidden = false;
    authOverlay.hidden = false;
    loginForm.hidden = true;
    registerForm.hidden = false;

    updateRegisterButtonState();
}

function closeAuth() {
    authModal.hidden = true;
    authOverlay.hidden = true;
}

function resetAuthUI() {
    loginForm.reset();
    registerForm.reset();

    resetSuccessMessage.hidden = true;
    resetPasswordBlock.hidden = true;

    clearLoginErrors();
    clearRegisterErrors();
}

function showError(element, message) {
    element.textContent = message;
}

function clearError(element) {
    element.textContent = "";
}

function renderUser(user) {

    currentUser = user;

    userNickname.textContent = user.displayName || "Anonymous";
    userEmail.textContent = user.email;

    userPanel.hidden = false;
    openAuthBtn.hidden = true;
}

//================LOGIN FLOW=================
onAuthChange((user) => {
    if (user) {
        renderUser(user);
    } else {
        clearUserUI();
    }
});

async function handleLogin() {

    clearLoginErrors();

    const email = validateLoginEmail();
    const password = validateLoginPassword();

    if (!email || !password) return;

    try {
        const user = await loginFlow(loginEmail.value, loginPassword.value);

        closeAuth();
        resetAuthUI();
        renderUser(user);

    } catch (error) {
        handleLoginError(error);
    }
}

function handleLoginError(error) {

    switch (error.code) {
        case "auth/invalid-credential":
            showError(
                loginPasswordError,
                "Invalid email or password"
            );
            break;

        case "auth/invalid-email":
            showError(
                loginEmailError,
                "Invalid email format"
            );
            break;

        case "auth/network-request-failed":
            showError(
                loginEmailError,
                "Network error. Try again later"
            );
            break;

        default:
            showError(
                loginEmailError,
                "Login failed"
            );
            console.error(error);
    }
}


function validateLoginEmail() {
    const email = loginEmail.value;

    if (isEmpty(email)) {
        showError(loginEmailError, "Email is required");
        return false;
    }

    if (!isValidEmail(email)) {
        showError(loginEmailError, "Email must contain @ and domain");
        return false;
    }

    clearError(loginEmailError);
    return true;
}

function validateLoginPassword() {
    const password = loginPassword.value;

    if (isEmpty(password)) {
        showError(loginPasswordError, "Password is required");
        return false;
    }

    if (!isValidPassword(password)) {
        showError(
            loginPasswordError,
            "Min 8 characters and at least 1 number"
        );
        return false;
    }

    clearError(loginPasswordError);
    return true;
}

function clearLoginErrors() {
    loginEmailError.textContent = "";
    loginPasswordError.textContent = "";
}

function isLoginEmailValid() {
    const email = loginEmail.value;
    return !isEmpty(email) && isValidEmail(email);
}

function isLoginPasswordValid() {
    const password = loginPassword.value;
    return !isEmpty(password) && isValidPassword(password);
}

function isLoginFormValid() {
    return (
        isLoginEmailValid() &&
        isLoginPasswordValid()
    );
}


//=============REGISTER FLOW============


async function handleRegister() {
    clearRegisterErrors();

    const emailValid = validateRegisterEmail();
    const nicknameValid = validateNickname();
    const passwordValid = validateRegisterPassword();
    const repeatValid = validateRepeatPassword();

    if (!emailValid || !nicknameValid || !passwordValid || !repeatValid) {
        return;
    }

    const email = regEmail.value;
    const nicknameValue = nickname.value;
    const password = regPassword.value;

    try {
        const user = await registerFlow(email, password, nicknameValue);
        await updateNickname(user.uid, nicknameValue);

        closeAuth();
        resetAuthUI();
        renderUser(user);

    } catch (error) {
        handleRegisterError(error);
    }
}

function handleRegisterError(error) {
    switch (error.code) {
        case "auth/email-already-in-use":
            showError(regEmailError, "Email already in use");
            break;

        case "auth/invalid-email":
            showError(regEmailError, "Invalid email");
            break;

        case "auth/weak-password":
            showError(regPasswordError, "Weak password");
            break;

        default:
            showError(regEmailError, "Registration failed");
            console.error(error);
    }
}

function validateRegisterEmail() {
    const email = regEmail.value;

    if (isEmpty(email)) {
        showError(regEmailError, "Email is required");
        return false;
    }

    if (!isValidEmail(email)) {
        showError(regEmailError, "Invalid email format");
        return false;
    }

    clearError(regEmailError);
    return true;
}

function validateNickname() {
    const value = nickname.value;

    if (isEmpty(value)) {
        showError(nicknameError, "Nickname is required");
        return false;
    }

    clearError(nicknameError);
    return true;
}

async function checkNicknameAvailability() {
    if (!validateNickname()) return false;

    try {
        const inUse = await isNicknameInUse(nickname.value);

        if (inUse) {
            showError(nicknameError, "Nickname already taken");
            return false;
        }

        clearError(nicknameError);
        return true;

    } catch {
        showError(nicknameError, "Server error");
        return false;
    }
}

function validateRegisterPassword() {
    const password = regPassword.value;

    if (isEmpty(password)) {
        showError(regPasswordError, "Password is required");
        return false;
    }

    if (!isValidPassword(password)) {
        showError(
            regPasswordError,
            "Min 8 characters and at least 1 number"
        );
        return false;
    }

    clearError(regPasswordError);
    return true;
}

function validateRepeatPassword() {

    const repeat = regPasswordRepeat.value;
    const password = regPassword.value;

    if (isEmpty(repeat)) {
        showError(regPasswordRepeatError, "Password is required");
        return false;
    }

    if (!passwordsMatch(password, repeat)) {
        showError(regPasswordError, "Passwords must match");
        showError(regPasswordRepeatError, "Passwords must match");
        return false;
    }
    clearError(regPasswordError);
    clearError(regPasswordRepeatError);
    return true;
}

function clearRegisterErrors() {
    regEmailError.textContent = "";
    nicknameError.textContent = "";
    regPasswordError.textContent = "";
    regPasswordRepeatError.textContent = "";
}

function isRegisterFormValidSilent() {
    return (
        !isEmpty(regEmail.value) &&
        isValidEmail(regEmail.value) &&
        !isEmpty(nickname.value) &&
        !isEmpty(regPassword.value) &&
        isValidPassword(regPassword.value) &&
        passwordsMatch(regPassword.value, regPasswordRepeat.value)
    );
}

function isRegisterFormValid() {
    return isRegisterFormValidSilent();
}


//============BUTTON STATES=============

function updateLoginButtonState() {
    loginBtn.disabled = !isLoginFormValid();
}

function updateRegisterButtonState() {
    registerBtn.disabled = !isRegisterFormValid();
}

//=============USER PANEL==============

logoutBtn.addEventListener("click", handleLogout);

async function handleLogout() {
    try {
        await logoutFlow();
        clearUserUI();
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

function clearUserUI() {
    currentUser = null;
    userPanel.hidden = true;
    openAuthBtn.hidden = false;
}

//============RESET PASSWORD==============
forgotPasswordBtn.addEventListener("click", () => {
    resetPasswordBlock.hidden = false;
});
resetSuccessOk.addEventListener("click", () => {
    resetSuccessMessage.hidden = true;
    closeAuth();
    resetAuthUI();
});


sendResetBtn.addEventListener("click", async () => {
    const email = resetEmailInput.value.trim();

    resetEmailError.textContent = "";

    if (isEmpty(email)) {
        resetEmailError.textContent = "Email is required";
        return;
    }

    if (!isValidEmail(email)) {
        resetEmailError.textContent = "Invalid email";
        return;
    }

    try {
        await resetPassword(email);
        resetPasswordBlock.hidden = true;
        resetSuccessMessage.hidden = false;

        setTimeout(() => {
            resetSuccessMessage.hidden = true;
            closeAuth();
            resetAuthUI();
        }, 10000);

    } catch (error) {
        handleResetError(error);
    }
});

function handleResetError(error) {
    switch (error.code) {
        case "auth/user-not-found":
            resetEmailError.textContent = "Email not registered";
            break;

        case "auth/invalid-email":
            resetEmailError.textContent = "Invalid email";
            break;

        default:
            resetEmailError.textContent = "Something went wrong";
            console.error(error);
    }
}


//============EDIDING NICKNAME============

editProfileBtn.addEventListener("click", () => {
    editNicknameInput.value = currentUser.displayName || "";
    editNicknameError.textContent = "";

    editProfileBlock.hidden = false;
});

cancelEditBtn.addEventListener("click", () => {
    editProfileBlock.hidden = true;
    editNicknameError.textContent = "";
});

saveNicknameBtn.addEventListener("click", async () => {
    const newName = editNicknameInput.value.trim();
    const oldName = currentUser.displayName;

    if (!newName) {
        editNicknameError.textContent = "Nickname required";
        return;
    }

    if (newName === oldName) {
        editProfileBlock.hidden = true;
        return;
    }

    try {
        const inUse = await isNicknameInUse(newName);

        if (inUse) {
            editNicknameError.textContent = "Nickname already taken";
            return;
        }

        await updateNickname(currentUser.uid, oldName, newName);

        currentUser.displayName = newName;
        userNickname.textContent = newName;

        editProfileBlock.hidden = true;

    } catch (err) {
        console.error(err);
        editNicknameError.textContent = "Server error";
    }
});

