import { isAuthenticated, isAdmin, logout, getToken } from "./auth.js";

const userProtected = [
    "/meus-pedidos",
    "/carrinho"
];

const adminProtected = [
    "/adm/index",
    "/adm/produtos",
    "/adm/categorias"
];

const page = window.location.pathname;

if (page === "/login" || page === "/register") {
    if (isAuthenticated()) {
        window.location.href = "/index"; // redireciona para home
    }
}

if (userProtected.includes(page)) {
    if (!isAuthenticated()) {
        window.location.href = "/login";
    }
}

if (!isAdmin()){
    const btnAdm = document.getElementById("btnAdm");
    btnAdm.style.display = "none"
}

if (adminProtected.includes(page)) {
    if (!isAuthenticated()) {
        window.location.href = "/login";
    }

    if (!isAdmin()) {
        alert("Acesso negado!");
        logout();
        window.location.href = "/login";
    }
}

if (isAuthenticated()) {
    fetch("http://localhost:4000/api/auth/validate-token", {
        method: "GET",
        headers: { "Authorization": "Bearer " + getToken() }
    })
        .then(res => {
            if (!res.ok) {
                logout();
            }
        })
        .catch(() => logout());
}
