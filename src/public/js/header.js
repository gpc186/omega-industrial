// Atualizar header com informações do usuário logado
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Selecionar todos os elementos de login no header
    const loginTextDesktop = document.querySelector('.nav-login a p');
    const loginTextMobile = document.querySelector('.login-desktop p');

    if (token && user.nome) {
        // Pegar primeiro nome da empresa
        const primeiroNome = user.nome.split(' ')[0];

        // Atualizar texto do login desktop
        if (loginTextDesktop) {
            loginTextDesktop.textContent = primeiroNome;
        }

        // Atualizar texto do login mobile
        if (loginTextMobile) {
            loginTextMobile.textContent = primeiroNome;
        }

        // Opcional: Adicionar dropdown com opções ao clicar
        const loginLinks = document.querySelectorAll('.nav-login a, .login-desktop');
        loginLinks.forEach(link => {
            link.style.cursor = 'pointer';

            // Criar menu dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.style.cssText = `
                        display: none;
                        position: absolute;
                        top: 100%;
                        right: 0;
                        background-color: #003d52;
                        min-width: 160px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        border-radius: 8px;
                        margin-top: 10px;
                        z-index: 1001;
                        padding: 0.5rem 0;
                    `;

            dropdown.innerHTML = `
                        <a href="#" onclick="logout(); return false;" style="display: block; padding: 0.75rem 1.5rem; color: #ffffff; text-decoration: none; transition: background-color 0.3s;">Sair</a>
                    `;

            // Adicionar hover aos links do dropdown
            dropdown.querySelectorAll('a').forEach(a => {
                a.addEventListener('mouseenter', () => {
                    a.style.backgroundColor = 'rgba(247, 147, 30, 0.2)';
                });
                a.addEventListener('mouseleave', () => {
                    a.style.backgroundColor = 'transparent';
                });
            });

            // Adicionar dropdown ao link (se ainda não existe)
            if (!link.querySelector('.user-dropdown')) {
                link.style.position = 'relative';
                link.appendChild(dropdown);

                // Toggle dropdown ao clicar
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                });
            }
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.user-dropdown');
            dropdowns.forEach(dropdown => {
                if (!dropdown.parentElement.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        });
    }
});

// Função de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index';
}