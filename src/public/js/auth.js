export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function saveToken(token) {
    localStorage.setItem("token", token);
}

export function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
    return getToken() !== null;
}

export function isAdmin() {
    const user = getUser();
    return user && user.role === "adm";
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index";
}