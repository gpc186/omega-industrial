import { 
    isAuthenticated,
    isValidEmail,
    saveUser,
    saveToken
} from "/js/auth.js";

document.addEventListener("DOMContentLoaded", () => {

    // Se já estiver logado, redireciona
    // if (isAuthenticated()) {
    //     window.location.href = '/produtos';
    //     return;
    // }

    const formLogin = document.getElementById('formulario-login');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('senha');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Email inválido!");
            return;
        }

        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres!");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.ok) {
                saveToken(data.token);
                saveUser(data.user);

                // Verifica o tipo de usuário
                if (data.user.role === "admin") {
                    window.location.href = "/html/admin-dashboard.html";
                } else {
                    window.location.href = "/html/index.html";
                }

                return;
            }

            alert(data.message || "Erro ao fazer login");

        } catch (error) {
            alert("Erro inesperado: " + error);
        }
    });
});
