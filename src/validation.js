export function isEmpty(value) {
    return value.trim() === "";
}

export function isValidPassword(password) {
    return /^(?=.*\d).{8,}$/.test(password);
}


export function passwordsMatch(a, b) {
    return a === b;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
